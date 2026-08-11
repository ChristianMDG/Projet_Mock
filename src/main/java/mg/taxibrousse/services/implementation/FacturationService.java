package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;
import mg.taxibrousse.exceptions.PaymentException;
import mg.taxibrousse.repositories.IFacturationRepository;
import mg.taxibrousse.repositories.IReservationRepository;
import mg.taxibrousse.services.IFacturationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class FacturationService implements IFacturationService {

    private final IFacturationRepository facturationRepository;
    private final IReservationRepository reservationRepository;

    @Override
    @Transactional
    public Long getOrCreateFacturation(Long reservationId) {
        return facturationRepository.findByReservationId(reservationId)
                .map(FacturationEntity::getId)
                .orElseGet(() -> createFacturation(reservationId));
    }

    private Long createFacturation(Long reservationId) {
        var reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new PaymentException("RESERVATION_NOT_FOUND",
                        "Reservation not found with id: %d".formatted(reservationId)));

        var facturation = new FacturationEntity();
        facturation.setReservation(reservation);
        facturation.setInvoiceNumber("INV-%d".formatted(System.currentTimeMillis()));
        facturation.setAmount(reservation.getTotalAmount());
        facturation.setTaxAmount(BigDecimal.ZERO);
        facturation.setTotalAmount(reservation.getTotalAmount());
        facturation.setRemainingAmount(reservation.getTotalAmount());
        facturation.setPaymentStatus(PaymentStatusEnum.PENDING);
        facturation.setDueDate(LocalDateTime.now().plusDays(7));

        reservation.setFacturation(facturation);

        var saved = facturationRepository.save(facturation);
        log.info("Created facturation {} for reservation {}", saved.getId(), reservationId);
        return saved.getId();
    }
}
