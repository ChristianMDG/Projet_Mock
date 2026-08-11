package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.PaymentTransactionRequest;
import mg.taxibrousse.dto.payment.PaymentNotification;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.exceptions.PaymentException;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.*;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

import static java.text.MessageFormat.format;

@Slf4j
@RequiredArgsConstructor
public abstract class PaymentService implements IPaymentService {

    protected final IReservationService reservationService;
    protected final IPaymentTransactionService paymentTransactionService;
    protected final IPaymentTransactionRepository paymentTransactionRepository;
    protected final IFacturationService facturationService;
    protected final IPaymentNotificationService paymentNotificationService;

    @Override
    public abstract PaymentTransaction initPayment(PaymentRequest request) throws IOException, InterruptedException;

    @Override
    public abstract PaymentTransaction checkAndUpdateTransactionStatus(String transactionReference) throws IOException, InterruptedException;


    @Transactional(readOnly = true)
    public PaymentTransaction getPaymentStatus(String transactionReference) {
        return paymentTransactionService.findByReference(transactionReference);
    }

    protected PaymentTransaction createTransaction(Long facturationId, PaymentRequest request) {
        return paymentTransactionService.create(PaymentTransactionRequest.builder()
                .facturationId(facturationId)
                .operatorName(request.getOperatorName())
                .amount(request.getAmount())
                .phoneNumber(request.getPhoneNumber())
                .build());
    }

    protected void updateTransactionStatus(PaymentTransactionEntity transaction, PaymentTransactionStatusEnum newStatus, String response) {
        transaction.setStatus(newStatus);
        transaction.setOperatorResponse(response);

        if (newStatus.isTerminal()) {
            transaction.setCompletedAt(LocalDateTime.now());
            if (newStatus == PaymentTransactionStatusEnum.COMPLETED) {
                processPayment(transaction);
            }
        }
        paymentTransactionRepository.save(transaction);
    }

    protected void processPayment(PaymentTransactionEntity transaction) {
        try {
            reservationService.processPayment(
                    transaction.getFacturation().getReservation().getId(),
                    transaction.getAmount()
            );
            log.info("Payment processed for transaction: {}", transaction.getTransactionReference());
        } catch (Exception e) {
            log.error("Error processing payment for transaction: {}", transaction.getTransactionReference(), e);
        }
    }

    protected void broadcastNotification(PaymentTransactionEntity transaction) {
        paymentNotificationService.broadcastPaymentUpdate(
                transaction.getTransactionReference(),
                PaymentNotification.fromEntity(transaction)
        );
        log.info("Notification sent for transaction: {}, status: {}", transaction.getTransactionReference(), transaction.getStatus());
    }

    protected PaymentTransactionEntity findTransactionById(Long id) {
        return paymentTransactionRepository.findById(id)
                .orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", "Transaction not found"));
    }

    protected PaymentTransactionEntity findTransactionByReference(String transactionReference) {
        return paymentTransactionRepository.findByTransactionReference(transactionReference)
                .orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", format("Transaction not found: {0}", transactionReference)));
    }

    protected PaymentTransactionEntity findTransactionByCorrelation(String correlationId) {
        return paymentTransactionRepository.findByServerCorrelationId(correlationId)
                .orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", "Transaction not found for correlationId: %s".formatted(correlationId)));
    }

    protected PaymentTransactionEntity requireCorrelationId(PaymentTransactionEntity entity) {
        if (entity.getServerCorrelationId() == null) {
            throw new PaymentException("NO_CORRELATION_ID", "Transaction has no server correlation ID");
        }
        return entity;
    }
}
