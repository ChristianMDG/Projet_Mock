package mg.taxibrousse.services.implementation;

import lombok.extern.slf4j.Slf4j;
import com.fasterxml.jackson.databind.ObjectMapper;
import mg.taxibrousse.HttpRequest.AirtelApiClient;
import mg.taxibrousse.config.AirtelApiConfig;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.airtel.AirtelPaymentRequest;
import mg.taxibrousse.dto.airtel.AirtelPaymentResponse;
import mg.taxibrousse.dto.airtel.AirtelStatusResponse;
import mg.taxibrousse.dto.airtel.AirtelSubscriber;
import mg.taxibrousse.dto.airtel.AirtelTokenResponse;
import mg.taxibrousse.dto.airtel.AirtelTransactionRequest;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.exceptions.InvalidPaymentException;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Map;

import static java.text.MessageFormat.format;

@Service
@Slf4j
public class AirtelMoneyService extends PaymentService implements IAirtelMoneyService {
    private final AirtelApiConfig config;
    private final AirtelApiClient apiClient;
    private final ObjectMapper objectMapper;

    private volatile AirtelTokenResponse cachedToken;
    private final Object tokenLock = new Object();

    private static final Map<String, String> AIRTEL_ERROR_MESSAGES = Map.ofEntries(
            Map.entry("DP00800001002", "payment_error_incorrect_pin"),
            Map.entry("DP00800001003", "payment_error_exceeds_limit"),
            Map.entry("DP00800001004", "payment_error_invalid_amount"),
            Map.entry("DP00800001005", "payment_error_no_pin_entered"),
            Map.entry("DP00800001007", "payment_error_insufficient_funds"),
            Map.entry("DP00800001008", "payment_error_refused"),
            Map.entry("DP00800001010", "payment_error_not_permitted"),
            Map.entry("DP00800001024", "payment_error_timeout"),
            Map.entry("DP00800001025", "payment_error_transaction_not_found")
    );

    public AirtelMoneyService(
            AirtelApiConfig config,
            AirtelApiClient apiClient,
            ObjectMapper objectMapper,
            IReservationService reservationService,
            IPaymentTransactionService paymentTransactionService,
            IPaymentTransactionRepository paymentTransactionRepository,
            IFacturationService facturationService,
            IPaymentNotificationService paymentNotificationService) {

        super(reservationService, paymentTransactionService, paymentTransactionRepository, facturationService, paymentNotificationService);
        this.config = config;
        this.apiClient = apiClient;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public PaymentTransaction initPayment(PaymentRequest request) throws IOException, InterruptedException {
        validatePaymentRequest(request);

        var facturationId = facturationService.getOrCreateFacturation(request.getReservationId());
        var transaction = createTransaction(facturationId, request);
        var transactionId = transaction.getId();

        try {
            var payload = buildPaymentRequest(request, transaction.getTransactionReference());
            var response = apiClient.post(getAuthToken(), config.getPaymentUrl(), payload, AirtelPaymentResponse.class);

            log.info("Airtel API response: {}", objectMapper.writeValueAsString(response));

            var updated = updateTransactionWithCorrelation(transactionId, transaction.getTransactionReference());
            broadcastNotification(updated);

            log.info("Airtel payment initiated: ref={}, airtelId={}", updated.getTransactionReference(), response.getData().getTransaction().getId());

            return PaymentTransaction.fromEntity(updated);
        } catch (Exception e) {
            paymentTransactionService.updateStatus(transactionId, PaymentTransactionStatusEnum.FAILED);
            throw e;
        }
    }

    @Override
    @Transactional
    public void handleCallback(String transactionId, String status, String operatorResponse) {
        log.info("Airtel callback received - ID: {}, Status: {}", transactionId, status);

        var transaction = findTransactionByCorrelation(transactionId);
        if (transaction.getStatus().isTerminal()) {
            log.warn("Transaction {} already terminal: {}", transaction.getTransactionReference(), transaction.getStatus());
            return;
        }

        updateTransactionStatus(transaction, mapAirtelStatus(status), resolveErrorMessage(status));
        broadcastNotification(transaction);
    }

    @Override
    @Transactional
    public PaymentTransaction checkAndUpdateTransactionStatus(String transactionReference) throws IOException, InterruptedException {
        log.info("Checking Airtel transaction status for: {}", transactionReference);

        var entity = requireCorrelationId(findTransactionByReference(transactionReference));

        if (entity.getStatus().isTerminal()) {
            log.info("Transaction {} already terminal: {}", transactionReference, entity.getStatus());
            return PaymentTransaction.fromEntity(entity);
        }

        var token = getAuthToken();
        var statusResponse = apiClient.get(token, config.getStatusUrl(entity.getServerCorrelationId()), AirtelStatusResponse.class);
        var responseCode = statusResponse.getStatus().getResponseCode();
        log.info("Airtel status for {}: responseCode={}", transactionReference, responseCode);

        updateTransactionStatus(entity, mapAirtelStatus(responseCode), resolveErrorMessage(responseCode));
        broadcastNotification(entity);

        return PaymentTransaction.fromEntity(entity);
    }

    private String getAuthToken() throws IOException, InterruptedException {
        synchronized (tokenLock) {
            if (cachedToken == null || cachedToken.isExpired()) {
                cachedToken = apiClient.authenticate(AirtelTokenResponse.class);
                log.info("Airtel Token Refreshed");
            }
            return format("Bearer {0}", cachedToken.getAccessToken());
        }
    }

    private AirtelPaymentRequest buildPaymentRequest(PaymentRequest request, String reference) {
        var phone = PaymentRequest.hasValidPhoneNumber(request) ? request.getPhoneNumber() : "";
        String msisdn = phone.startsWith("0") ? phone.substring(1) : phone;

        var subscriber = AirtelSubscriber.builder()
            .country("MG")
            .currency("MGA")
            .msisdn(msisdn)
            .build();

        var transaction = AirtelTransactionRequest.builder()
            .amount(request.getAmount())
            .country("MG")
            .currency("MGA")
            .id(reference)
            .build();

        return AirtelPaymentRequest.builder()
            .reference(reference)
            .subscriber(subscriber)
            .transaction(transaction)
            .build();
    }

    @Transactional
    protected PaymentTransactionEntity updateTransactionWithCorrelation(Long transactionId, String correlationId) {
        var entity = findTransactionById(transactionId);
        entity.setServerCorrelationId(correlationId);
        updateTransactionStatus(entity, PaymentTransactionStatusEnum.PENDING_OTP, "Awaiting confirmation");
        return entity;
    }

    private PaymentTransactionStatusEnum mapAirtelStatus(String status) {
        if (status == null) return PaymentTransactionStatusEnum.FAILED;
        return switch (status.toUpperCase()) {
            // Callback status_code: TS = Transaction Successful
            case "TS" -> PaymentTransactionStatusEnum.COMPLETED;
            // response_code from status enquiry
            case "DP00800001001" -> PaymentTransactionStatusEnum.COMPLETED;     // Success
            case "DP00800001000",                                               // Ambiguous
                 "DP00800001006" -> PaymentTransactionStatusEnum.PROCESSING;    // In process
            case "DP00800001008" -> PaymentTransactionStatusEnum.CANCELLED;     // Refused
            case "DP00800001002",                                               // Incorrect Pin
                 "DP00800001003",                                               // Exceeds limit
                 "DP00800001004",                                               // Invalid Amount
                 "DP00800001005",                                               // User didn't enter pin
                 "DP00800001007",                                               // Not enough balance
                 "DP00800001010",                                               // Not permitted to Payee
                 "DP00800001024",                                               // Timed Out
                 "DP00800001025" -> PaymentTransactionStatusEnum.FAILED;        // Transaction Not Found
            default -> PaymentTransactionStatusEnum.FAILED;
        };
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

    private String resolveErrorMessage(String responseCode) {
        if (responseCode != null) {
            return AIRTEL_ERROR_MESSAGES.getOrDefault(responseCode.toUpperCase(), responseCode);
        }
        return "payment_error_unknown";
    }
}
