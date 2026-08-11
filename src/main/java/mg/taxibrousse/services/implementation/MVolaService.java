package mg.taxibrousse.services.implementation;

import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.HttpRequest.MVolaApiClient;
import mg.taxibrousse.config.MVolaApiConfig;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.mvola.*;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.List;

@Service
@Slf4j
public class MVolaService extends PaymentService implements IMVolaService {
    private final MVolaApiConfig config;
    private final MVolaApiClient apiClient;

    private volatile MVolaTokenResponse cachedToken;
    private final Object tokenLock = new Object();

    public MVolaService(
            MVolaApiConfig config,
            MVolaApiClient apiClient,
            IReservationService reservationService,
            IPaymentTransactionService paymentTransactionService,
            IPaymentTransactionRepository paymentTransactionRepository,
            IFacturationService facturationService,
            IPaymentNotificationService paymentNotificationService) {
        super(
            reservationService, 
            paymentTransactionService, 
            paymentTransactionRepository, 
            facturationService, 
            paymentNotificationService
        );
        this.config = config;
        this.apiClient = apiClient;
    }

    @Override
    @Transactional
    public PaymentTransaction initPayment(PaymentRequest request) throws IOException, InterruptedException {
        var facturationId = facturationService.getOrCreateFacturation(request.getReservationId());
        var transaction = createTransaction(facturationId, request);
        var transactionId = transaction.getId();

        try {
            var requestPayload = buildPaymentRequest(request, transaction.getTransactionReference());
            var response = apiClient.post(
                getAuthToken(), config.getPaymentUrl(),
                requestPayload, MVolaPaymentResponse.class
            );

            var updatedTransaction = updateTransactionWithCorrelation(transactionId, response.getServerCorrelationId());

            broadcastNotification(updatedTransaction);
            log.info("Payment initiated: {}, CorrelationId: {}", updatedTransaction.getTransactionReference(), response.getServerCorrelationId());

            return PaymentTransaction.fromEntity(updatedTransaction);
        } catch (Exception e) {
            paymentTransactionService.updateStatus(transactionId, PaymentTransactionStatusEnum.FAILED);
            throw e;
        }
    }

    @Override
    @Transactional
    public void handleCallback(String serverCorrelationId, String status, String operatorResponse) {
        log.info("Callback received - correlationId: {}, status: {}", serverCorrelationId, status);

        var transaction = findTransactionByCorrelation(serverCorrelationId);
        if (transaction.getStatus().isTerminal()) {
            log.warn("Transaction {} already terminal: {}", transaction.getTransactionReference(), transaction.getStatus());
            return;
        }

        updateTransactionStatus(transaction, mapMVolaStatus(status), operatorResponse);
        broadcastNotification(transaction);
    }

    @Override
    @Transactional
    public PaymentTransaction checkAndUpdateTransactionStatus(String transactionReference) throws IOException, InterruptedException {
        log.info("Checking MVola transaction status for: {}", transactionReference);

        var entity = requireCorrelationId(findTransactionByReference(transactionReference));

        if (entity.getStatus().isTerminal()) {
            log.info("Transaction {} already terminal: {}", transactionReference, entity.getStatus());
            return PaymentTransaction.fromEntity(entity);
        }

        var token = getAuthToken();
        var statusResponse = apiClient.get(token, config.getStatusUrl(entity.getServerCorrelationId()), MVolaPaymentResponse.class);
        log.info("MVola status for {}: {}", transactionReference, statusResponse.getStatus());

        updateTransactionStatus(entity, mapMVolaStatus(statusResponse.getStatus()), statusResponse.getStatus());
        broadcastNotification(entity);

        return PaymentTransaction.fromEntity(entity);
    }

    // --- Private helpers ---
    private String getAuthToken() throws IOException, InterruptedException {
        synchronized (tokenLock) {
            if (cachedToken == null || cachedToken.isExpired()) {
                log.info("Refreshing MVola authentication token");
                cachedToken = apiClient.authenticate(MVolaTokenResponse.class);
                log.info("MVola token refreshed successfully, expires in {} seconds", cachedToken.getExpiresIn());
            }
            return "Bearer %s".formatted(cachedToken.getAccessToken());
        }
    }

    private MVolaPaymentRequest buildPaymentRequest(PaymentRequest request, String transactionReference) {
        return MVolaPaymentRequest.builder()
                .amount(request.getAmount().toString())
                .currency("Ar")
                .descriptionText(MessageFormat.format("Paiement reservation Taxibrousse {0}", request.getReservationId()))
                .requestingOrganisationTransactionReference(transactionReference)
                .originalTransactionReference(transactionReference)
                .debitParty(List.of(Party.msisdn(request.getPhoneNumber())))
                .creditParty(List.of(Party.msisdn(config.getCreditPartyMsisdn())))
                .metadata(List.of(
                        Metadata.partnerName(config.getPartnerName()),
                        Metadata.foreignCurrency("MGA"),
                        Metadata.amountForeignCurrency(request.getAmount().toString())
                ))
                .build();
    }

    @Transactional
    protected PaymentTransactionEntity updateTransactionWithCorrelation(Long transactionId, String correlationId) {
        var entity = findTransactionById(transactionId);
        entity.setServerCorrelationId(correlationId);
        updateTransactionStatus(entity, PaymentTransactionStatusEnum.PENDING_OTP, "Awaiting OTP confirmation");
        return entity;
    }

    private PaymentTransactionStatusEnum mapMVolaStatus(String mvolaStatus) {
        return switch (mvolaStatus.toUpperCase()) {
            case "COMPLETED", "SUCCESS", "SUCCESSFUL" -> PaymentTransactionStatusEnum.COMPLETED;
            case "PENDING" -> PaymentTransactionStatusEnum.PROCESSING;
            case "CANCELLED" -> PaymentTransactionStatusEnum.CANCELLED;
            default -> PaymentTransactionStatusEnum.FAILED;
        };
    }
}
