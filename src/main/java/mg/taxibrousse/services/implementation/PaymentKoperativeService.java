package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.PaymentKoperativeEntity;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;
import mg.taxibrousse.models.PaymentKoperative;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.repositories.IPaymentKoperativeRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.services.IPaymentKoperativeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentKoperativeService implements IPaymentKoperativeService {

    private final IPaymentKoperativeRepository paymentKoperativeRepository;
    private final IVoyageRepository voyageRepository;

    @Override
    @Transactional
    public PaymentKoperative getOrCreatePaymentKoperative(Long voyageId) {
        var voyage = voyageRepository.findById(voyageId).orElseThrow(() -> new EntityNotFoundException("Voyage not found with id: " + voyageId));

        var paymentOpt = paymentKoperativeRepository.findByVoyageId(voyageId);

        // Compute current total amount based on PAID reservations of the voyage
        BigDecimal calculatedTotalAmount = BigDecimal.ZERO;
        if (voyage.getReservations() != null) {
            for (var r : voyage.getReservations()) {
                if (r.getFacturation() != null && r.getFacturation().getPaymentStatus() == PaymentStatusEnum.PAID) {
                    calculatedTotalAmount = calculatedTotalAmount.add(r.getFacturation().getTotalAmount());
                }
            }
        }

        PaymentKoperativeEntity paymentEntity;
        if (paymentOpt.isPresent()) {
            paymentEntity = paymentOpt.get();
            paymentEntity.setTotalAmount(calculatedTotalAmount);

            BigDecimal remaining = calculatedTotalAmount.subtract(paymentEntity.getAmount());
            if (remaining.compareTo(BigDecimal.ZERO) < 0) {
                remaining = BigDecimal.ZERO;
            }
            paymentEntity.setRemainingAmount(remaining);

            if (remaining.compareTo(BigDecimal.ZERO) == 0 && calculatedTotalAmount.compareTo(BigDecimal.ZERO) > 0) {
                paymentEntity.setStatus(PaymentStatusEnum.PAID);
            } else if (paymentEntity.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                paymentEntity.setStatus(PaymentStatusEnum.PARTIALLY_PAID);
            } else {
                paymentEntity.setStatus(PaymentStatusEnum.PENDING);
            }
        } else {
            paymentEntity = new PaymentKoperativeEntity();
            paymentEntity.setVoyage(voyage);
            paymentEntity.setTotalAmount(calculatedTotalAmount);
            paymentEntity.setAmount(BigDecimal.ZERO);
            paymentEntity.setRemainingAmount(calculatedTotalAmount);
            paymentEntity.setStatus(PaymentStatusEnum.PENDING);
        }

        var savedEntity = paymentKoperativeRepository.save(paymentEntity);
        log.info("Saved/Updated cooperative payment for voyage {}: totalAmount={}, amount={}, status={}", voyageId, savedEntity.getTotalAmount(), savedEntity.getAmount(), savedEntity.getStatus());

        return toPaymentKoperativeWithRelations(savedEntity);
    }

    private PaymentKoperative toPaymentKoperativeWithRelations(PaymentKoperativeEntity entity) {
        var payment = PaymentKoperative.fromEntity(entity);
        if (entity.getVoyage() != null) {
            payment.setVoyage(Voyage.fromEntity(entity.getVoyage()));
        }
        return payment;
    }
}
