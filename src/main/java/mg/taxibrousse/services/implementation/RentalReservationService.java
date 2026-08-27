package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.PayableType;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.rental.RentalPaymentInitiateRequest;
import mg.taxibrousse.dto.rental.RentalReservationCreateRequest;
import mg.taxibrousse.dto.shop.PaymentInitiationResponse;
import mg.taxibrousse.entities.RentalReservationEntity;
import mg.taxibrousse.entities.RentalVehicleEntity;
import mg.taxibrousse.entities.UserAccountEntity;
import mg.taxibrousse.entities.enums.RentalReservationStatusEnum;
import mg.taxibrousse.exceptions.InvalidRentalReservationStatusTransitionException;
import mg.taxibrousse.exceptions.RentalConflictException;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IRentalReservationRepository;
import mg.taxibrousse.repositories.IRentalVehicleRepository;
import mg.taxibrousse.services.IAirtelMoneyService;
import mg.taxibrousse.services.IPaymentService;
import mg.taxibrousse.services.IOrangeMoneyService;
import mg.taxibrousse.services.IMVolaService;
import mg.taxibrousse.services.IRentalReservationService;
import mg.taxibrousse.utils.PhoneUtils;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RentalReservationService implements IRentalReservationService {

    private static final Set<RentalReservationStatusEnum> ACTIVE_STATUSES = EnumSet.of(RentalReservationStatusEnum.PENDING, RentalReservationStatusEnum.CONFIRMED);

    private final IRentalReservationRepository reservationRepository;
    private final IRentalVehicleRepository vehicleRepository;
    private final EntityManager entityManager;
    private final ObjectProvider<IMVolaService> mvolaProvider;
    private final ObjectProvider<IAirtelMoneyService> airtelProvider;
    private final ObjectProvider<IOrangeMoneyService> orangeProvider;

    @Override
    @Transactional(readOnly = true)
    public List<RentalReservationEntity> findByUserId(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public RentalReservationEntity findByIdOrThrow(Long id) {
        return reservationRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Rental reservation not found: " + id));
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public RentalReservationEntity createReservation(RentalReservationCreateRequest request, Long callerUserId) {
        RentalVehicleEntity vehicle = vehicleRepository.findById(request.getVehicleId()).orElseThrow(() -> new EntityNotFoundException("Rental vehicle not found: " + request.getVehicleId()));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("error_invalid_date_range");
        }
        if (!Boolean.TRUE.equals(vehicle.getAvailable())) {
            throw new RentalConflictException("error_vehicle_unavailable", "exception_vehicle_unavailable");
        }

        try {
            boolean overlaps = reservationRepository.existsOverlapping(vehicle.getId(), ACTIVE_STATUSES, request.getStartDate(), request.getEndDate());
            if (overlaps) {
                throw new RentalConflictException("error_rental_overlap", "exception_rental_overlap");
            }

            RentalReservationEntity reservation = new RentalReservationEntity();
            reservation.setVehicle(vehicle);
            reservation.setStartDate(request.getStartDate());
            reservation.setEndDate(request.getEndDate());
            reservation.setDriverName(request.getDriverName());
            reservation.setDriverPhone(request.getDriverPhone());
            reservation.setDriverEmail(request.getDriverEmail());
            reservation.setStatus(RentalReservationStatusEnum.PENDING);
            reservation.setTotalPrice(calculateTotalPrice(vehicle.getPricePerDay(), request.getStartDate(), request.getEndDate()));
            if (callerUserId != null) {
                reservation.setUser(entityManager.getReference(UserAccountEntity.class, callerUserId));
            }

            RentalReservationEntity saved = reservationRepository.save(reservation);
            attachBookingReference(saved);
            return saved;
        } catch (ConcurrencyFailureException e) {
            throw new RentalConflictException("error_rental_overlap", "exception_rental_overlap_concurrent", e);
        }
    }

    private void attachBookingReference(RentalReservationEntity reservation) {
        try {
            String candidate;
            int attempts = 0;
            do {
                candidate = "RB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                attempts++;
            } while (reservationRepository.existsByBookingReference(candidate) && attempts < 5);
            reservation.setBookingReference(candidate);
            reservationRepository.save(reservation);
        } catch (Exception e) {
            log.warn("Booking reference generation failed for reservation {} - proceeding without one", reservation.getId(), e);
        }
    }

    private BigDecimal calculateTotalPrice(Double pricePerDay, java.time.LocalDate start, java.time.LocalDate end) {
        long days = ChronoUnit.DAYS.between(start, end);
        BigDecimal raw = BigDecimal.valueOf(pricePerDay).multiply(BigDecimal.valueOf(days));
        return raw.setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    @Transactional
    public PaymentInitiationResponse initiatePayment(Long id, RentalPaymentInitiateRequest request) throws IOException, InterruptedException {
        RentalReservationEntity reservation = findByIdOrThrow(id);
        boolean payable = reservation.getStatus() == RentalReservationStatusEnum.PENDING || reservation.getStatus() == RentalReservationStatusEnum.PAYMENT_FAILED;
        if (!payable) {
            throw new RentalConflictException("error_reservation_not_payable", "exception_reservation_status_conflict");
        }

        String operator = PhoneUtils.getOperatorName(request.getPhoneNumber());
        if ("Unknown".equals(operator)) {
            throw new IllegalArgumentException("error_unresolvable_operator");
        }

        PaymentRequest paymentRequest = PaymentRequest.builder()
                .payableId(id)
                .payableType(PayableType.RENTAL_RESERVATION)
                .amount(reservation.getTotalPrice())
                .phoneNumber(request.getPhoneNumber())
                .operatorName(operator)
                .build();

        IPaymentService provider = resolveMobileMoneyProvider(operator);
        PaymentTransaction tx = provider.initPayment(paymentRequest);

        return PaymentInitiationResponse.builder().transactionReference(tx.getTransactionReference()).paymentUrl(tx.getPaymentUrl()).status(tx.getStatus()).operatorName(operator).build();
    }

    private IPaymentService resolveMobileMoneyProvider(String operator) {
        ObjectProvider<? extends IPaymentService> provider = switch (operator) {
            case "TELMA" -> mvolaProvider;
            case "AIRTEL" -> airtelProvider;
            case "ORANGE" -> orangeProvider;
            default -> throw new IllegalArgumentException("error_unresolvable_operator");
        };
        IPaymentService svc = provider.getIfAvailable();
        if (svc == null) {
            throw new RentalConflictException("error_mobile_money_unavailable", "exception_mobile_money_unavailable");
        }
        return svc;
    }

    @Override
    @Transactional
    public RentalReservationEntity confirm(Long id) {
        return applyTransition(id, RentalReservationStatusEnum.CONFIRMED);
    }

    @Override
    @Transactional
    public RentalReservationEntity failPayment(Long id, String reason) {
        return applyTransition(id, RentalReservationStatusEnum.PAYMENT_FAILED);
    }

    private RentalReservationEntity applyTransition(Long id, RentalReservationStatusEnum next) {
        RentalReservationEntity reservation = findByIdOrThrow(id);
        if (!reservation.getStatus().canTransitionTo(next)) {
            throw new InvalidRentalReservationStatusTransitionException("Invalid rental reservation status transition: " + reservation.getStatus() + " -> " + next);
        }
        reservation.setStatus(next);
        return reservationRepository.save(reservation);
    }
}
