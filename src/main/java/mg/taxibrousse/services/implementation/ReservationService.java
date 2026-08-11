package mg.taxibrousse.services.implementation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import static java.util.Optional.ofNullable;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.dto.ReservationWithoutVoyageurRequest;
import mg.taxibrousse.entities.ClasseEntity;
import mg.taxibrousse.entities.CrafterEntity;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.SeatEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.VoyageurEntity;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;
import mg.taxibrousse.entities.enums.SeatStatusEnum;
import mg.taxibrousse.exceptions.InvalidPaymentException;
import mg.taxibrousse.exceptions.InvalidSeatException;
import mg.taxibrousse.exceptions.ReservationNotFoundException;
import mg.taxibrousse.models.Reservation;
import mg.taxibrousse.models.Seat;
import mg.taxibrousse.repositories.ICrafterRepository;
import mg.taxibrousse.repositories.IFacturationRepository;
import mg.taxibrousse.repositories.IReservationRepository;
import mg.taxibrousse.repositories.ISeatRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.services.IReservationService;
import mg.taxibrousse.services.IReservationSmsService;

@Service
@RequiredArgsConstructor
public class ReservationService implements IReservationService {

    private final IReservationRepository reservationRepository;
    private final ISeatRepository seatRepository;
    private final IReservationSmsService reservationSmsService;
    private final IFacturationRepository facturationRepository;
    private final IVoyageRepository voyageRepository;
    private final ICrafterRepository crafterRepository;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public Reservation save(Reservation reservation) {
        // Generate booking reference if not provided
        if (reservation.getBookingReference() == null || reservation.getBookingReference().trim().isEmpty()) {
            reservation.setBookingReference(generateBookingReference());
        }

        var seats = ofNullable(reservation.getSeats())
                .map(seatList -> seatList.stream().map(Seat::toEntity).toList())
                .orElse(new ArrayList<>());
        var savedSeats = seatRepository.saveAll(seats);

        var entity = reservation.toEntity();
        entity.setSeats(savedSeats);
        var saved = reservationRepository.save(entity);

        for (SeatEntity seatEntity : savedSeats) {
            seatEntity.setReservation(saved);
        }

        return Reservation.fromEntity(saved);
    }

    /**
     * Processes payment for a reservation
     *
     * @param reservationId The ID of the reservation to process payment for
     * @param amount The payment amount
     * @return Updated reservation with payment information
     */
    @Override
    @Transactional
    public Reservation processPayment(Long reservationId, BigDecimal amount) {
        ReservationEntity reservation = getReservationById(reservationId);

        validatePaymentAmount(amount, reservation.getTotalAmount());

        FacturationEntity facturation = getOrCreateFacturation(reservation);
        BigDecimal newTotalPaid = updateFacturationWithPayment(facturation, amount);
        updatePaymentStatus(facturation, reservation, newTotalPaid);

        facturationRepository.save(facturation);
        ReservationEntity savedReservation = reservationRepository.save(reservation);
        return Reservation.fromEntity(savedReservation);
    }

    private ReservationEntity getReservationById(Long reservationId) {
        return reservationRepository.findByIdWithDetails(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException("exception_reservation_not_found"));
    }

    private void validatePaymentAmount(BigDecimal amount, BigDecimal totalAmount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidPaymentException("exception_payment_amount_zero");
        }
        if (amount.compareTo(totalAmount) > 0) {
            throw new InvalidPaymentException("exception_payment_amount_exceeds_total");
        }
    }

    private FacturationEntity getOrCreateFacturation(ReservationEntity reservation) {
        FacturationEntity facturation = reservation.getFacturation();
        if (facturation == null) {
            facturation = createNewFacturation(reservation);
            reservation.setFacturation(facturation);
        }
        return facturation;
    }

    private FacturationEntity createNewFacturation(ReservationEntity reservation) {
        FacturationEntity facturation = new FacturationEntity();
        facturation.setReservation(reservation);
        facturation.setInvoiceNumber(generateInvoiceNumber());
        facturation.setAmount(BigDecimal.ZERO);
        facturation.setTotalAmount(BigDecimal.ZERO);
        facturation.setRemainingAmount(reservation.getTotalAmount()); // Initial remaining is the full amount
        facturation.setPaymentStatus(PaymentStatusEnum.PENDING);
        return facturation;
    }

    private BigDecimal updateFacturationWithPayment(FacturationEntity facturation, BigDecimal amount) {
        BigDecimal currentPaid = ofNullable(facturation.getTotalAmount()).orElse(BigDecimal.ZERO);
        BigDecimal newTotalPaid = currentPaid.add(amount);

        facturation.setAmount(amount);
        facturation.setTotalAmount(newTotalPaid);
        facturation.setPaymentDate(LocalDateTime.now());

        BigDecimal totalReservationAmount = facturation.getReservation().getTotalAmount();
        BigDecimal remainingAmount = totalReservationAmount.subtract(newTotalPaid);
        facturation.setRemainingAmount(remainingAmount.max(BigDecimal.ZERO));

        return newTotalPaid;
    }

    private void updatePaymentStatus(FacturationEntity facturation, ReservationEntity reservation, BigDecimal totalPaid) {
        if (totalPaid.compareTo(reservation.getTotalAmount()) >= 0) {
            facturation.setPaymentStatus(PaymentStatusEnum.PAID);
            reservation.setStatus(ReservationStatusEnum.CONFIRMED);
            reservationSmsService.sendConfirmationSms(reservation);
        } else {
            facturation.setPaymentStatus(PaymentStatusEnum.PARTIALLY_PAID);
        }
    }

    /**
     * Generates a unique invoice number.
     * Format: INV-YYYYMMDD-XXXX
     */
    private String generateInvoiceNumber() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomStr = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return String.format("INV-%s-%s", dateStr, randomStr);
    }

    /**
     * Generates a unique booking reference.
     * Format: TXB-YYYYMMDD-HHMMSS-XXXX
     */
    private String generateBookingReference() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String timeStr = now.format(DateTimeFormatter.ofPattern("HHmmss"));
        String randomStr = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String reference = String.format("TXB-%s-%s-%s", dateStr, timeStr, randomStr);

        // Ensure uniqueness
        // Ensure uniqueness by checking if the reference already exists
        while (reservationRepository.existsByBookingReference(reference)) {
            randomStr = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
            reference = String.format("TXB-%s-%s-%s", dateStr, timeStr, randomStr);
        }

        return reference;
    }

    @Override
    public Reservation findById(Long id) {
        return reservationRepository.findByIdWithDetails(id)
                .map(Reservation::fromEntity)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> findByVoyageId(Long voyageId) {
        return reservationRepository.findByVoyageId(voyageId).stream()
                .map(entity -> {
                    var reservation = Reservation.fromEntity(entity);
                    if (entity.getSeats() != null && !entity.getSeats().isEmpty()) {
                        reservation.setSeats(entity.getSeats().stream()
                                .map(Seat::fromEntity)
                                .toList());
                    }
                    return reservation;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> findActiveByVoyageId(Long voyageId) {
        return reservationRepository.findActiveByVoyageId(
                voyageId,
                ReservationStatusEnum.getCancellationStatuses()
        ).stream()
                .map(entity -> {
                    var reservation = Reservation.fromEntity(entity);
                    if (entity.getSeats() != null && !entity.getSeats().isEmpty()) {
                        reservation.setSeats(entity.getSeats().stream()
                                .map(Seat::fromEntity)
                                .toList());
                    }
                    return reservation;
                })
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        reservationRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Reservation cancelReservation(Long id, ReservationStatusEnum cancelStatus) {
        ReservationEntity reservation = getReservationById(id);

        if (reservation.getStatus().isCancelled()) {
            throw new IllegalArgumentException("reservation_already_cancelled");
        }

        if (cancelStatus.isValidCancellationStatus()) {
            seatRepository.deleteByReservationId(id);
            reservationRepository.updateStatus(id, cancelStatus);
        }

        return Reservation.fromEntity(reservation);
    }

    @Override
    public boolean isSeatAvailable(Long voyageId, String seatNumber) {
        try {
            Integer seatNum = Integer.valueOf(seatNumber);
            return !reservationRepository.existsByVoyageIdAndSeatNumberAndStatusNotCancelled(voyageId, seatNum);
        } catch (NumberFormatException e) {
            throw new InvalidSeatException("exception_invalid_seat_number");
        }
    }

    // Implementation of the service to get reservations by voyageur
    @Override
    @Transactional(readOnly = true)
    public List<Reservation> findByVoyageurId(Long voyageurId) {
        List<ReservationEntity> entities = reservationRepository.findByVoyageurId(voyageurId);
        return entities.stream().map(Reservation::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Reservation> findAllPageable(String status, String phoneNumber, String bookingReference, Pageable pageable) {
        Specification<ReservationEntity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null && !status.trim().isEmpty()) {
                try {
                    ReservationStatusEnum statusEnum = ReservationStatusEnum.valueOf(status.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("status"), statusEnum));
                } catch (IllegalArgumentException e) {
                    // Invalid status, ignore filter
                }
            }

            if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("voyageur").get("phoneNumber")),
                        "%" + phoneNumber.toLowerCase() + "%"
                ));
            }

            if (bookingReference != null && !bookingReference.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("bookingReference")),
                        "%" + bookingReference.toLowerCase() + "%"
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<ReservationEntity> entities = reservationRepository.findAll(spec, pageable);
        return entities.map(Reservation::fromEntity);
    }

    @Override
    @Transactional
    public Reservation confirmReservation(Long id) {
        ReservationEntity reservation = getReservationById(id);

        if (reservation.getStatus() == ReservationStatusEnum.CONFIRMED) {
            throw new IllegalArgumentException("reservation_already_confirmed");
        }

        if (reservation.getStatus().isCancelled()) {
            throw new IllegalArgumentException("reservation_cancelled_cannot_confirm");
        }

        reservation.setStatus(ReservationStatusEnum.CONFIRMED);
        ReservationEntity savedReservation = reservationRepository.save(reservation);
        return Reservation.fromEntity(savedReservation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> findByPhoneNumberOrIdNumber(String phoneNumber, String idNumber) {
        return reservationRepository.findByPhoneNumberOrIdNumber(phoneNumber, idNumber)
                .stream()
                .map(Reservation::fromEntity)
                .toList();
    }

    @Transactional
    public Reservation confirmReservationWithoutVoyageur(ReservationWithoutVoyageurRequest request) {
        if (request.getVoyageId() == null) {
            throw new IllegalArgumentException("voyage_id_required");
        }

        // crafterId is optional: allow null to create reservations without assigning a crafter

        if (request.getSeatNumbers() == null || request.getSeatNumbers().isEmpty()) {
            throw new IllegalArgumentException("seat_numbers_required");
        }

        VoyageEntity voyageEntity = voyageRepository.findById(request.getVoyageId())
                .orElseThrow(() -> new RuntimeException("Voyage not found with id: " + request.getVoyageId()));

        // Classe is optional
        ClasseEntity classeEntity = null;
        if (request.getClasseId() != null) {
            classeEntity = entityManager.find(ClasseEntity.class, request.getClasseId());
            if (classeEntity == null) {
                throw new RuntimeException("Classe not found with id: " + request.getClasseId());
            }
        }

        // Use provided crafterId, or fall back to the voyage's crafter
        CrafterEntity crafterEntity;
        if (request.getCrafterId() != null) {
            crafterEntity = crafterRepository.findById(request.getCrafterId())
                    .orElseThrow(() -> new RuntimeException("Crafter not found with id: " + request.getCrafterId()));
        } else {
            crafterEntity = voyageEntity.getCrafter();
        }

        // Check seat availability
        for (String seatNumber : request.getSeatNumbers()) {
            if (!isSeatAvailable(request.getVoyageId(), seatNumber)) {
                throw new InvalidSeatException("seat_already_reserved: " + seatNumber);
            }
        }

        // Create reservation without voyageur
        var reservationEntity = new ReservationEntity();
        reservationEntity.setVoyage(voyageEntity);
        reservationEntity.setClasse(classeEntity);
        reservationEntity.setVoyageur(null);
        reservationEntity.setBookingReference(generateBookingReference());
        reservationEntity.setStatus(ReservationStatusEnum.CONFIRMED);
        reservationEntity.setBookingDate(LocalDateTime.now());
        reservationEntity.setTotalAmount(BigDecimal.ZERO);
        reservationEntity.setNotes(request.getNotes());

        var savedReservation = reservationRepository.save(reservationEntity);

        // Create seats
        List<SeatEntity> seats = new ArrayList<>();
        for (String seatNumber : request.getSeatNumbers()) {
            var seatEntity = new SeatEntity();
            seatEntity.setReservation(savedReservation);
            seatEntity.setVoyage(voyageEntity);
            seatEntity.setCrafter(crafterEntity);
            seatEntity.setSeatNumber(Integer.valueOf(seatNumber));
            seatEntity.setSeatStatus(SeatStatusEnum.RESERVED);
            seats.add(seatEntity);
        }
        seatRepository.saveAll(seats);

        return Reservation.fromEntity(savedReservation);
    }

    @Override
    @Transactional
    public Reservation attachVoyageur(Long reservationId, Long voyageurId) {
        ReservationEntity reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found: " + reservationId));

        VoyageurEntity voyageur = entityManager.find(VoyageurEntity.class, voyageurId);
        if (voyageur == null) {
            throw new RuntimeException("Voyageur not found: " + voyageurId);
        }

        reservation.setVoyageur(voyageur);
        return Reservation.fromEntity(reservationRepository.save(reservation));
    }
}
