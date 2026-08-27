package mg.taxibrousse.services.implementation;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.config.OrangeMoneyApiConfig;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.orangemoney.*;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.exceptions.PaymentException;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.*;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import static java.text.MessageFormat.format;

/**
 * Orange Money WebPay payment service implementation.
 * <p>
 * Handles Orange Money payment integration using the WebPay API which provides
 * a secure payment URL for customers to complete transactions on Orange Money's platform.
 * </p>
 * <p>
 * Key features:
 * <ul>
 * <li>WebPay API integration with OAuth2 authentication</li>
 * <li>Real-time WebSocket notifications to clients</li>
 * <li>Secure notifToken verification for callbacks</li>
 * <li>Transaction tracking and status management</li>
 * </ul>
 * </p>
 *
 * @see IOrangeMoneyService
 * @see MVolaService
 */
@Slf4j
@Service
public class OrangeMoneyService extends PaymentService implements IOrangeMoneyService {

    private final OrangeMoneyApiConfig config;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    private static final String NOTIF_TOKEN_PREFIX = "om:notif:";
    private static final long NOTIF_TOKEN_EXPIRATION_HOURS = 1;

    private volatile OrangeMoneyTokenResponse cachedToken;
    private final Object tokenLock = new Object();

    public OrangeMoneyService(OrangeMoneyApiConfig config, HttpClient httpClient, ObjectMapper objectMapper, StringRedisTemplate redisTemplate, IReservationService reservationService,
            IPaymentTransactionService paymentTransactionService, IPaymentTransactionRepository paymentTransactionRepository, IFacturationService facturationService,
            IPaymentNotificationService paymentNotificationService) {
        super(reservationService, paymentTransactionService, paymentTransactionRepository, facturationService, paymentNotificationService);
        this.config = config;
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
    }

    @Override
    @Transactional
    public PaymentTransaction initPayment(PaymentRequest request) throws IOException, InterruptedException {
        log.info("Initiating Orange Money payment for payable type: {}, id: {}, amount: {}", request.getPayableType(), request.getPayableId(), request.getAmount());

        var transaction = bootstrapTransaction(request);
        var transactionId = transaction.getId();
        var orderId = transaction.getTransactionReference();

        try {
            var token = getAuthToken();
            var omRequest = buildPaymentRequest(request, orderId);
            var omResponse = initiateWebPayment(omRequest, token);

            if (omResponse.isCreated()) {
                var updatedTransaction = updateTransactionWithPayment(transactionId, omResponse.getPayToken());
                redisTemplate.opsForValue().set(NOTIF_TOKEN_PREFIX + omResponse.getNotifToken(), orderId, NOTIF_TOKEN_EXPIRATION_HOURS, java.util.concurrent.TimeUnit.HOURS);

                var responseTransaction = PaymentTransaction.fromEntity(updatedTransaction);
                responseTransaction.setPaymentUrl(omResponse.getPaymentUrl());

                return responseTransaction;
            } else {
                throw new PaymentException("PAYMENT_INIT_FAILED", omResponse.getMessage());
            }
        } catch (Exception e) {
            paymentTransactionService.updateStatus(transactionId, PaymentTransactionStatusEnum.FAILED);
            throw e;
        }
    }

    @Override
    @Transactional
    public void handleCallback(String orderIdParam, String status, String notifToken) {
        log.info("Callback received - status: {}, notifToken: {}, orderIdParam: {}", status, notifToken, orderIdParam);

        String orderId = redisTemplate.opsForValue().get(NOTIF_TOKEN_PREFIX + notifToken);
        if (orderId != null) {
            redisTemplate.delete(NOTIF_TOKEN_PREFIX + notifToken);
        }

        if (orderId == null) {
            log.error("Unable to identify order for notifToken: {}", notifToken);
            throw new PaymentException("ORDER_NOT_FOUND", "Unable to identify order for notification");
        }

        processCallback(orderId, status);
    }

    private void processCallback(String orderId, String status) {
        var transaction = findTransactionByReference(orderId);
        if (transaction.getStatus().isTerminal()) {
            log.warn("Transaction {} already terminal: {}", transaction.getTransactionReference(), transaction.getStatus());
            return;
        }

        updateTransactionStatus(transaction, mapOrangeMoneyStatus(status), status);
        broadcastNotification(transaction);
    }

    @Override
    @Transactional
    public PaymentTransaction checkAndUpdateTransactionStatus(String transactionReference) throws IOException, InterruptedException {
        log.info("Checking Orange Money transaction status for: {}", transactionReference);

        var entity = requireCorrelationId(findTransactionByReference(transactionReference));

        if (entity.getStatus().isTerminal()) {
            log.info("Transaction {} already terminal: {}", transactionReference, entity.getStatus());
            return PaymentTransaction.fromEntity(entity);
        }

        var token = getAuthToken();
        var statusRequest = OrangeMoneyStatusRequest.builder().orderId(entity.getTransactionReference()).amount(entity.getAmount().toString()).payToken(entity.getServerCorrelationId()).build();

        var statusResponse = checkTransactionStatus(statusRequest, token);
        log.info("Orange Money status for {}: {}", transactionReference, statusResponse.getStatus());

        updateTransactionStatus(entity, mapOrangeMoneyStatus(statusResponse.getStatus()), statusResponse.getStatus());
        broadcastNotification(entity);

        return PaymentTransaction.fromEntity(entity);
    }

    /* -- Private helpers --- */

    private String getAuthToken() throws IOException, InterruptedException {
        synchronized (tokenLock) {
            if (cachedToken == null || cachedToken.isExpired()) {
                cachedToken = authenticate();
                log.info("Orange Money token refreshed successfully, expires in {} seconds", cachedToken.getExpiresIn());
            }
            return format("Bearer {0}", cachedToken.getAccessToken());
        }
    }

    private OrangeMoneyTokenResponse authenticate() throws IOException, InterruptedException {
        var formData = format("client_id={0}&client_secret={1}&grant_type=client_credentials", config.getClientId(), config.getClientSecret());

        var request = HttpRequest.newBuilder()
                .uri(URI.create(config.getTokenUrl()))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(formData, StandardCharsets.UTF_8))
                .build();

        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200)
            return objectMapper.readValue(response.body(), OrangeMoneyTokenResponse.class);

        log.error("Orange Money authentication failed: {} - {}", response.statusCode(), response.body());
        throw new IOException(format("Orange Money authentication failed: {0}", response.body()));
    }

    private OrangeMoneyPaymentRequest buildPaymentRequest(PaymentRequest request, String orderId) {
        return OrangeMoneyPaymentRequest.fromPayment(request, config, orderId);
    }

    private OrangeMoneyPaymentResponse initiateWebPayment(OrangeMoneyPaymentRequest request, String token) throws IOException, InterruptedException {

        var requestBody = objectMapper.writeValueAsString(request);
        log.info("Initiating Orange Money WebPay request to URL: {}, Payload: {}", config.getWebPaymentUrl(), requestBody);

        var httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(config.getWebPaymentUrl()))
                .header("Authorization", token)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();

        var response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        log.debug("Orange Money WebPay response: {} - {}", response.statusCode(), response.body());

        if (response.statusCode() == 200 || response.statusCode() == 201) {
            return objectMapper.readValue(response.body(), OrangeMoneyPaymentResponse.class);
        }

        // Return a failed response with error details
        return OrangeMoneyPaymentResponse.builder().message(format("Payment initiation failed: {0}", response.body())).build();
    }

    private OrangeMoneyStatusResponse checkTransactionStatus(OrangeMoneyStatusRequest request, String token) throws IOException, InterruptedException {

        var requestBody = objectMapper.writeValueAsString(request);
        var httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(config.getTransactionStatusUrl()))
                .header("Authorization", token)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();

        var response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        log.debug("Orange Money Status API response: {} - {}", response.statusCode(), response.body());

        if (response.statusCode() == 200 || response.statusCode() == 201) {
            return objectMapper.readValue(response.body(), OrangeMoneyStatusResponse.class);
        }

        throw new IOException(format("Status check failed: {0} - {1}", response.statusCode(), response.body()));
    }

    @Transactional
    protected PaymentTransactionEntity updateTransactionWithPayment(Long transactionId, String payToken) {
        var entity = findTransactionById(transactionId);
        entity.setServerCorrelationId(payToken);
        updateTransactionStatus(entity, PaymentTransactionStatusEnum.INITIATED, "Payment URL generated");
        return entity;
    }

    private PaymentTransactionStatusEnum mapOrangeMoneyStatus(String omStatus) {
        return switch (omStatus.toUpperCase()) {
            case "SUCCESS", "SUCCESSFUL", "COMPLETED" -> PaymentTransactionStatusEnum.COMPLETED;
            case "PENDING" -> PaymentTransactionStatusEnum.PROCESSING;
            case "INITIATED" -> PaymentTransactionStatusEnum.INITIATED;
            case "EXPIRED" -> PaymentTransactionStatusEnum.TIMEOUT;
            case "CANCELLED" -> PaymentTransactionStatusEnum.CANCELLED;
            default -> PaymentTransactionStatusEnum.FAILED;
        };
    }

    // Visible for testing
    public void clearCache() {
        synchronized (tokenLock) {
            this.cachedToken = null;
        }
    }
}
