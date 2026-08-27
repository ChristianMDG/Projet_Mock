package mg.taxibrousse.services.implementation;

import mg.taxibrousse.dto.PaymentTransactionRequest;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.exceptions.PaymentException;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IFacturationRepository;
import mg.taxibrousse.repositories.IOrderRepository;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.repositories.IRentalReservationRepository;
import mg.taxibrousse.services.IPaymentTransactionService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

import static java.text.MessageFormat.*;

@Service
public class PaymentTransactionService implements IPaymentTransactionService {

    private final IPaymentTransactionRepository paymentTransactionRepository;
    private final IFacturationRepository facturationRepository;
    private final IOrderRepository orderRepository;
    private final IRentalReservationRepository rentalReservationRepository;

    public PaymentTransactionService(IPaymentTransactionRepository paymentTransactionRepository, IFacturationRepository facturationRepository, IOrderRepository orderRepository,
            IRentalReservationRepository rentalReservationRepository) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.facturationRepository = facturationRepository;
        this.orderRepository = orderRepository;
        this.rentalReservationRepository = rentalReservationRepository;
    }

    @Override
    @Transactional
    @CacheEvict(value = "financeStats", allEntries = true)
    public PaymentTransaction create(PaymentTransactionRequest request) {
        PaymentTransactionEntity entity = new PaymentTransactionEntity();

        linkFacturation(entity, request);
        linkOrder(entity, request);
        linkRentalReservation(entity, request);

        if (entity.getFacturation() == null && entity.getOrder() == null && entity.getRentalReservation() == null) {
            throw new PaymentException("INVALID_TRANSACTION_TARGET", "exception_payment_target_required");
        }

        entity.setTransactionReference(generateTransactionReference());
        entity.setOperatorName(request.getOperatorName());
        entity.setAmount(request.getAmount());
        entity.setStatus(PaymentTransactionStatusEnum.INITIATED);
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setInitiatedAt(LocalDateTime.now());
        entity.setOtpAttempts(0);

        PaymentTransactionEntity saved = paymentTransactionRepository.save(entity);
        return PaymentTransaction.fromEntity(saved);
    }

    private void linkFacturation(PaymentTransactionEntity entity, PaymentTransactionRequest request) {
        if (request.getFacturationId() == null) {
            return;
        }
        FacturationEntity facturation = facturationRepository.findById(request.getFacturationId()).orElseThrow(() -> new PaymentException("FACTURATION_NOT_FOUND", "exception_facturation_not_found"));
        entity.setFacturation(facturation);
    }

    private void linkOrder(PaymentTransactionEntity entity, PaymentTransactionRequest request) {
        if (request.getOrderId() == null) {
            return;
        }
        OrderEntity order = orderRepository.findById(request.getOrderId()).orElseThrow(() -> new PaymentException("ORDER_NOT_FOUND", "exception_order_not_found"));
        entity.setOrder(order);
    }

    private void linkRentalReservation(PaymentTransactionEntity entity, PaymentTransactionRequest request) {
        if (request.getRentalReservationId() == null) {
            return;
        }
        rentalReservationRepository.findById(request.getRentalReservationId()).ifPresent(entity::setRentalReservation);
        // Requirement 10.5: silently proceed without the association if the id doesn't resolve.
    }

    @Override
    @Transactional
    public PaymentTransaction updateStatus(Long id, PaymentTransactionStatusEnum status) {
        PaymentTransactionEntity entity = paymentTransactionRepository.findById(id).orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", "exception_transaction_not_found"));

        entity.setStatus(status);

        if (isTerminalStatus(status)) {
            entity.setCompletedAt(LocalDateTime.now());
        }

        PaymentTransactionEntity saved = paymentTransactionRepository.save(entity);
        return PaymentTransaction.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentTransaction findById(Long id) {
        return paymentTransactionRepository.findById(id).map(PaymentTransaction::fromEntity).orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", "exception_transaction_not_found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentTransaction findByReference(String reference) {
        return paymentTransactionRepository.findByTransactionReference(reference)
                .map(PaymentTransaction::fromEntity)
                .orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", "exception_transaction_not_found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentTransaction> findByFacturationId(Long facturationId) {
        return paymentTransactionRepository.findByFacturationIdOrderByInitiatedAtDesc(facturationId).stream().map(PaymentTransaction::fromEntity).toList();
    }

    private String generateTransactionReference() {
        return format("TXN{0}", UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    }

    private boolean isTerminalStatus(PaymentTransactionStatusEnum status) {
        return status == PaymentTransactionStatusEnum.COMPLETED || status == PaymentTransactionStatusEnum.FAILED || status == PaymentTransactionStatusEnum.TIMEOUT
                || status == PaymentTransactionStatusEnum.CANCELLED;
    }
}
