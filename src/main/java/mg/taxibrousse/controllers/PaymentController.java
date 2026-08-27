package mg.taxibrousse.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.controllers.interfaces.IPaymentController;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.mvola.MVolaCallbackRequest;
import mg.taxibrousse.dto.orangemoney.OrangeMoneyCallbackRequest;
import mg.taxibrousse.dto.airtel.AirtelCallbackRequest;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.services.IMVolaService;
import mg.taxibrousse.services.IOrangeMoneyService;
import mg.taxibrousse.services.IAirtelMoneyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PaymentController implements IPaymentController {

    private final IMVolaService mvolaService;
    private final IOrangeMoneyService orangeMoneyService;
    private final IAirtelMoneyService airtelMoneyService;
    private final ObjectMapper objectMapper;

    // MVola endpoints
    @Override
    public ResponseEntity<PaymentTransaction> initiateMVolaPayment(PaymentRequest paymentRequest) throws IOException, InterruptedException {
        log.info("Initiating MVola payment for payableId: {}, amount: {}", paymentRequest.getPayableId(), paymentRequest.getAmount());
        var transaction = mvolaService.initPayment(paymentRequest);
        return ResponseEntity.ok(transaction);
    }

    @Override
    public ResponseEntity<Void> handleMVolaCallback(MVolaCallbackRequest callbackRequest) {
        try {
            log.info("Received MVola callback - body: {}", objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(callbackRequest));

            mvolaService.handleCallback(callbackRequest.getServerCorrelationId(), callbackRequest.getTransactionStatus(), "MVOLA");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error handling MVola callback for correlationId: {}", callbackRequest.getServerCorrelationId(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<PaymentTransaction> getMVolaPaymentStatus(String transactionReference) {
        try {
            var transaction = mvolaService.getPaymentStatus(transactionReference);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error getting MVola payment status for transaction: {}", transactionReference, e);
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<PaymentTransaction> checkAndUpdateMVolaPaymentStatus(String transactionReference) {
        log.info("Manual MVola check requested for transaction: {}", transactionReference);

        try {
            var transaction = mvolaService.checkAndUpdateTransactionStatus(transactionReference);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error checking payment status from MVola for transaction: {}", transactionReference, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // Orange Money endpoints
    @Override
    public ResponseEntity<PaymentTransaction> initiateOrangeMoneyPayment(PaymentRequest paymentRequest) throws IOException, InterruptedException {
        log.info("Initiating Orange Money payment for payableId: {}, amount: {}", paymentRequest.getPayableId(), paymentRequest.getAmount());
        return ResponseEntity.ok(orangeMoneyService.initPayment(paymentRequest));
    }

    /**
     * Handle Orange Money payment notification callback.
     *
     * @param callbackRequest Callback payload from Orange Money
     * @return 200 OK if processed successfully, 400 if missing data, 500 on error
     */
    @Override
    public ResponseEntity<Void> handleOrangeMoneyCallback(OrangeMoneyCallbackRequest callbackRequest, String orderIdParam) {
        try {
            log.info("Received Orange Money callback - orderIdParam: {}, body: {}", orderIdParam, objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(callbackRequest));

            if (orderIdParam == null) {
                log.error("Orange Money callback received without order_id query parameter");
                return ResponseEntity.badRequest().build();
            }

            orangeMoneyService.handleCallback(orderIdParam, callbackRequest.getStatus(), callbackRequest.getNotifToken());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error handling Orange Money callback for orderId: {}", orderIdParam, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<PaymentTransaction> getOrangeMoneyPaymentStatus(String transactionReference) {
        try {
            var transaction = orangeMoneyService.getPaymentStatus(transactionReference);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error getting Orange Money payment status for transaction: {}", transactionReference, e);
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<PaymentTransaction> checkAndUpdateOrangeMoneyPaymentStatus(String transactionReference) {
        log.info("Manual Orange Money check requested for transaction: {}", transactionReference);

        try {
            var transaction = orangeMoneyService.checkAndUpdateTransactionStatus(transactionReference);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error checking payment status from Orange Money for transaction: {}", transactionReference, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // Airtel Money endpoints
    @Override
    public ResponseEntity<PaymentTransaction> initiateAirtelMoneyPayment(PaymentRequest paymentRequest) throws IOException, InterruptedException {
        log.info("Initiating Airtel Money payment for payableId: {}, amount: {}", paymentRequest.getPayableId(), paymentRequest.getAmount());
        var transaction = airtelMoneyService.initPayment(paymentRequest);
        return ResponseEntity.ok(transaction);
    }

    @Override
    public ResponseEntity<Void> handleAirtelMoneyCallback(AirtelCallbackRequest callbackRequest) {
        try {
            log.info("Received Airtel callback - body: {}", objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(callbackRequest));

            if (callbackRequest == null || callbackRequest.getTransaction() == null) {
                log.error("Invalid Airtel callback payload");
                return ResponseEntity.badRequest().build();
            }

            airtelMoneyService.handleCallback(callbackRequest.getTransaction().getId(), callbackRequest.getTransaction().getStatusCode(), "AIRTEL");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error handling Airtel callback", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<PaymentTransaction> getAirtelMoneyPaymentStatus(String transactionReference) {
        try {
            var transaction = airtelMoneyService.getPaymentStatus(transactionReference);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error getting Airtel payment status for transaction: {}", transactionReference, e);
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<PaymentTransaction> checkAndUpdateAirtelMoneyPaymentStatus(String transactionReference) {
        try {
            var transaction = airtelMoneyService.checkAndUpdateTransactionStatus(transactionReference);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error checking payment status from Airtel for transaction: {}", transactionReference, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
