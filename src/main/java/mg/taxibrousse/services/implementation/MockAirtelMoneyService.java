package mg.taxibrousse.services.implementation;

import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.exceptions.InvalidPaymentException;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
@Primary
@ConditionalOnProperty(name = "app.payment.mock", havingValue = "true")
@Slf4j
public class MockAirtelMoneyService extends PaymentService implements IAirtelMoneyService {

    public MockAirtelMoneyService(IReservationService reservationService, IPaymentTransactionService paymentTransactionService, IPaymentTransactionRepository paymentTransactionRepository,
            IFacturationService facturationService, IPaymentNotificationService paymentNotificationService) {
        super(reservationService, paymentTransactionService, paymentTransactionRepository, facturationService, paymentNotificationService);
    }

    @Override
    @Transactional
    public PaymentTransaction initPayment(PaymentRequest request) throws IOException, InterruptedException {
        validatePaymentRequest(request);

        log.info("[MOCK] Initiating Airtel Money payment. PayableId: {}, Amount: {}", request.getPayableId(), request.getAmount());
        var transaction = bootstrapTransaction(request);
        var transactionId = transaction.getId();

        var entity = findTransactionById(transactionId);
        entity.setServerCorrelationId("mock-airtel-correlation-" + transaction.getTransactionReference());
        updateTransactionStatus(entity, PaymentTransactionStatusEnum.COMPLETED, "Mocked Airtel Success");
        broadcastNotification(entity);

        return PaymentTransaction.fromEntity(entity);
    }

    @Override
    @Transactional
    public void handleCallback(String transactionId, String status, String operatorResponse) {
        log.info("[MOCK] Callback received for transactionId: {}", transactionId);
        var transaction = findTransactionByCorrelation(transactionId);
        if (transaction.getStatus().isTerminal()) {
            return;
        }
        updateTransactionStatus(transaction, PaymentTransactionStatusEnum.COMPLETED, "Mocked Airtel Success Callback");
        broadcastNotification(transaction);
    }

    @Override
    @Transactional
    public PaymentTransaction checkAndUpdateTransactionStatus(String transactionReference) throws IOException, InterruptedException {
        log.info("[MOCK] Checking transaction status for reference: {}", transactionReference);
        var entity = requireCorrelationId(findTransactionByReference(transactionReference));
        if (entity.getStatus().isTerminal()) {
            return PaymentTransaction.fromEntity(entity);
        }
        updateTransactionStatus(entity, PaymentTransactionStatusEnum.COMPLETED, "Mocked Airtel Success Status Check");
        broadcastNotification(entity);
        return PaymentTransaction.fromEntity(entity);
    }

    private void validatePaymentRequest(PaymentRequest request) {
        if (PaymentRequest.isValidAmount(request) && PaymentRequest.hasValidPhoneNumber(request)) {
            return;
        }
        if (PaymentRequest.isValidAmount(request)) {
            throw new InvalidPaymentException("payment_error_invalid_phone", "A valid phone number is required");
        }
        throw new InvalidPaymentException("payment_error_invalid_amount", "Amount must be greater than zero");
    }
}
