package mg.taxibrousse.services.implementation;

import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
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
public class MockOrangeMoneyService extends PaymentService implements IOrangeMoneyService {

    @org.springframework.beans.factory.annotation.Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public MockOrangeMoneyService(IReservationService reservationService, IPaymentTransactionService paymentTransactionService, IPaymentTransactionRepository paymentTransactionRepository,
            IFacturationService facturationService, IPaymentNotificationService paymentNotificationService) {
        super(reservationService, paymentTransactionService, paymentTransactionRepository, facturationService, paymentNotificationService);
    }

    private String buildMockSuccessUrl(PaymentRequest request) {
        String path = request.getReturnUrl();
        if (request.getPayableType() == mg.taxibrousse.dto.PayableType.ORDER) {
            return frontendUrl + "/en/shop/payment/success?orderId=" + request.getPayableId();
        }

        if (path == null || path.isEmpty()) {
            return frontendUrl + "/en/payment/success/" + request.getPayableId();
        }

        String successPath;
        if (path.contains("/dia/")) {
            successPath = path.replace("/dia/", "/fahombiazana/");
        } else if (path.contains("/voyage/")) {
            successPath = path.replace("/voyage/", "/succes/");
        } else if (path.contains("/trip/")) {
            successPath = path.replace("/trip/", "/success/");
        } else {
            successPath = "/en/payment/success/" + request.getPayableId();
        }

        return frontendUrl + successPath;
    }

    @Override
    @Transactional
    public PaymentTransaction initPayment(PaymentRequest request) throws IOException, InterruptedException {
        log.info("[MOCK] Initiating Orange Money payment. PayableId: {}, Amount: {}", request.getPayableId(), request.getAmount());
        var transaction = bootstrapTransaction(request);
        var transactionId = transaction.getId();

        var entity = findTransactionById(transactionId);
        entity.setServerCorrelationId("mock-orange-correlation-" + transaction.getTransactionReference());
        updateTransactionStatus(entity, PaymentTransactionStatusEnum.COMPLETED, "Mocked Orange Success");
        broadcastNotification(entity);

        var response = PaymentTransaction.fromEntity(entity);
        response.setPaymentUrl(buildMockSuccessUrl(request));
        return response;
    }

    @Override
    @Transactional
    public void handleCallback(String orderId, String status, String notifToken) {
        log.info("[MOCK] Callback received for orderId: {}, notifToken: {}", orderId, notifToken);
        var transaction = findTransactionByReference(orderId);
        if (transaction.getStatus().isTerminal()) {
            return;
        }
        updateTransactionStatus(transaction, PaymentTransactionStatusEnum.COMPLETED, "Mocked Orange Success Callback");
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
        updateTransactionStatus(entity, PaymentTransactionStatusEnum.COMPLETED, "Mocked Orange Success Status Check");
        broadcastNotification(entity);
        return PaymentTransaction.fromEntity(entity);
    }
}
