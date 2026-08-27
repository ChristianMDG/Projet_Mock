package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.PayableType;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.PaymentTransactionRequest;
import mg.taxibrousse.dto.payment.PaymentNotification;
import mg.taxibrousse.dto.shop.OrderPaymentRequest;
import mg.taxibrousse.dto.shop.PaymentInitiationResponse;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.exceptions.PaymentConfirmationException;
import mg.taxibrousse.exceptions.PaymentException;
import mg.taxibrousse.exceptions.PaymentFailureException;
import mg.taxibrousse.exceptions.PaymentInitiationException;
import mg.taxibrousse.exceptions.PaymentStatusCheckException;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.IFacturationService;
import mg.taxibrousse.services.IOrderService;
import mg.taxibrousse.services.IPaymentNotificationService;
import mg.taxibrousse.services.IPaymentService;
import mg.taxibrousse.services.IPaymentTransactionService;
import mg.taxibrousse.services.IReservationService;
import mg.taxibrousse.services.IRentalReservationService;
import mg.taxibrousse.services.ICommissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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

    @Autowired
    @Lazy
    private IOrderService orderService;

    @Autowired
    @Lazy
    private IRentalReservationService rentalReservationService;

    @Autowired
    @Lazy
    private ICommissionService commissionService;

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

    protected PaymentTransaction createOrderTransaction(Long orderId, PaymentRequest request) {
        return paymentTransactionService.create(PaymentTransactionRequest.builder()
                .orderId(orderId)
                .operatorName(request.getOperatorName())
                .amount(request.getAmount())
                .phoneNumber(request.getPhoneNumber())
                .build());
    }

    protected PaymentTransaction createRentalReservationTransaction(Long rentalReservationId, PaymentRequest request) {
        return paymentTransactionService.create(PaymentTransactionRequest.builder()
                .rentalReservationId(rentalReservationId)
                .operatorName(request.getOperatorName())
                .amount(request.getAmount())
                .phoneNumber(request.getPhoneNumber())
                .build());
    }

    /**
     * Create a transaction tied to either a shop order (when {@code request.getPayableType() == PayableType.ORDER} is set),
     * a rental reservation (when {@code request.getPayableType() == PayableType.RENTAL_RESERVATION} is set), or a
     * reservation facturation (default reservation flow).
     */
    protected PaymentTransaction bootstrapTransaction(PaymentRequest request) {
        if (request.getPayableType() == PayableType.ORDER) {
            return createOrderTransaction(request.getPayableId(), request);
        }
        if (request.getPayableType() == PayableType.RENTAL_RESERVATION) {
            return createRentalReservationTransaction(request.getPayableId(), request);
        }
        Long facturationId = facturationService.getOrCreateFacturation(request.getPayableId());
        return createTransaction(facturationId, request);
    }

    protected void updateTransactionStatus(PaymentTransactionEntity transaction, PaymentTransactionStatusEnum newStatus, String response) {
        transaction.setStatus(newStatus);
        transaction.setOperatorResponse(response);

        if (newStatus.isTerminal()) {
            transaction.setCompletedAt(LocalDateTime.now());
            if (newStatus == PaymentTransactionStatusEnum.COMPLETED) {
                processPayment(transaction);
            } else {
                processTerminalFailure(transaction);
            }
        }
        paymentTransactionRepository.save(transaction);
    }

    protected void processPayment(PaymentTransactionEntity transaction) {
        try {
            if (transaction.getOrder() != null) {
                orderService.confirm(transaction.getOrder().getId());
                log.info("Shop order confirmed for transaction: {}", transaction.getTransactionReference());
                return;
            }
            if (transaction.getRentalReservation() != null) {
                rentalReservationService.confirm(transaction.getRentalReservation().getId());
                log.info("Rental reservation confirmed for transaction: {}", transaction.getTransactionReference());
                return;
            }
            if (transaction.getFacturation() != null) {
                ReservationEntity reservation = transaction.getFacturation().getReservation();
                reservationService.processPayment(reservation.getId(), transaction.getAmount());
                commissionService.computeCommission(transaction, reservation);
                commissionService.computeFrais(transaction);
                log.info("Payment processed for transaction: {}", transaction.getTransactionReference());
            }
        } catch (Exception e) {
            log.error("Error processing payment for transaction: {}", transaction.getTransactionReference(), e);
        }
    }

    // Additive only - no-op for order/facturation to preserve existing behavior exactly.
    protected void processTerminalFailure(PaymentTransactionEntity transaction) {
        if (transaction.getRentalReservation() == null) {
            return;
        }
        try {
            rentalReservationService.failPayment(transaction.getRentalReservation().getId(), "payment_" + transaction.getStatus().name().toLowerCase());
        } catch (Exception e) {
            log.error("Error processing rental payment failure for transaction: {}", transaction.getTransactionReference(), e);
        }
    }

    protected void broadcastNotification(PaymentTransactionEntity transaction) {
        paymentNotificationService.broadcastPaymentUpdate(transaction.getTransactionReference(), PaymentNotification.fromEntity(transaction));
        log.info("Notification sent for transaction: {}, status: {}", transaction.getTransactionReference(), transaction.getStatus());
    }

    protected PaymentTransactionEntity findTransactionById(Long id) {
        return paymentTransactionRepository.findById(id).orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", "Transaction not found"));
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

    @Override
    @Transactional
    public PaymentTransaction checkPaymentStatus(String transactionReference) throws PaymentStatusCheckException, IOException, InterruptedException {

        if (StringUtils.hasText(transactionReference)) {
            try {
                return checkAndUpdateTransactionStatus(transactionReference);
            } catch (PaymentStatusCheckException e) {
                throw e;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw e;
            } catch (Exception e) {
                log.error("Failed to check payment status for transaction {}: {}", transactionReference, e.getMessage(), e);
                throw new PaymentStatusCheckException("STATUS_CHECK_FAILED", "Failed to check payment status", e);
            }
        }
        throw new PaymentStatusCheckException("INVALID_REFERENCE", "Transaction reference is required");
    }

    @Override
    @Transactional
    public void confirmPayment(String transactionReference) throws PaymentConfirmationException {

        if (StringUtils.hasText(transactionReference)) {
            try {
                PaymentTransactionEntity transaction = findTransactionByReference(transactionReference);

                // Check if transaction is already in terminal state
                if (transaction.getStatus().isTerminal()) {
                    if (transaction.getStatus() == PaymentTransactionStatusEnum.COMPLETED) {
                        log.warn("Transaction {} already confirmed", transactionReference);
                        return;
                    }
                    throw new PaymentConfirmationException("INVALID_STATE", format("Cannot confirm transaction in state: {0}", transaction.getStatus()));
                }

                // Update transaction status to COMPLETED
                updateTransactionStatus(transaction, PaymentTransactionStatusEnum.COMPLETED, "Payment confirmed");

                // Broadcast notification
                broadcastNotification(transaction);

                log.info("Payment confirmed for transaction: {}", transactionReference);
                return;
            } catch (PaymentConfirmationException e) {
                throw e;
            } catch (Exception e) {
                log.error("Failed to confirm payment for transaction {}: {}", transactionReference, e.getMessage(), e);
                throw new PaymentConfirmationException("CONFIRMATION_FAILED", "Failed to confirm payment", e);
            }
        }
        throw new PaymentConfirmationException("INVALID_REFERENCE", "Transaction reference is required");
    }

    @Override
    @Transactional
    public void failPayment(String transactionReference, String reason) throws PaymentFailureException {

        if (StringUtils.hasText(transactionReference)) {
            try {
                PaymentTransactionEntity transaction = findTransactionByReference(transactionReference);

                // Check if transaction is already in terminal state
                if (transaction.getStatus().isTerminal()) {
                    if (transaction.getStatus() == PaymentTransactionStatusEnum.FAILED) {
                        log.warn("Transaction {} already failed", transactionReference);
                        return;
                    }
                    throw new PaymentFailureException("INVALID_STATE", format("Cannot fail transaction in state: {0}", transaction.getStatus()));
                }

                // Build failure message
                String failureMessage = StringUtils.hasText(reason) ? reason : "Payment failed";

                // Update transaction status to FAILED
                updateTransactionStatus(transaction, PaymentTransactionStatusEnum.FAILED, failureMessage);

                // Broadcast notification
                broadcastNotification(transaction);

                log.info("Payment marked as failed for transaction: {}", transactionReference);
                return;
            } catch (PaymentFailureException e) {
                throw e;
            } catch (Exception e) {
                log.error("Failed to mark payment as failed for transaction {}: {}", transactionReference, e.getMessage(), e);
                throw new PaymentFailureException("FAILURE_UPDATE_FAILED", "Failed to update payment status to failed", e);
            }
        }
        throw new PaymentFailureException("INVALID_REFERENCE", "Transaction reference is required");
    }

    @Override
    @Transactional
    public PaymentInitiationResponse initiateOrderPayment(Long orderId, OrderPaymentRequest request) throws PaymentInitiationException, IOException, InterruptedException {

        throw new UnsupportedOperationException("initiateOrderPayment should be called on OrderService, not on individual payment operator services");
    }
}
