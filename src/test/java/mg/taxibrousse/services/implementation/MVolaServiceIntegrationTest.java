package mg.taxibrousse.services.implementation;

import mg.taxibrousse.HttpRequest.MVolaApiClient;
import mg.taxibrousse.config.TestRedisConfig;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.mvola.MVolaPaymentResponse;
import mg.taxibrousse.dto.mvola.MVolaTokenResponse;
import mg.taxibrousse.entities.*;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;
import mg.taxibrousse.exceptions.PaymentException;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IFacturationRepository;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.IMVolaService;
import mg.taxibrousse.services.IPaymentNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Integration tests for MVolaService.
 * Uses a real Spring context with H2 database.
 * External dependencies (MVolaApiClient, PaymentNotificationService) are mocked.
 */
@SpringBootTest(classes = {TestRedisConfig.class})
@ActiveProfiles("test")
@Transactional
class MVolaServiceIntegrationTest {

    @Autowired
    private IMVolaService mVolaService;

    @Autowired
    private IPaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private IFacturationRepository facturationRepository;

    @Autowired
    private EntityManager entityManager;

    @MockitoBean
    private MVolaApiClient apiClient;

    @MockitoBean
    private IPaymentNotificationService paymentNotificationService;

    // Test entities
    private VoyageEntity voyage;
    private KoperativeEntity koperative;
    private ReservationEntity reservation;

    @BeforeEach
    void setUp() throws Exception {
        // Build the minimal entity graph: Koperative -> Voyage -> Reservation
        koperative = new KoperativeEntity();
        koperative.setName("Test Koperative");
        entityManager.persist(koperative);

        voyage = new VoyageEntity();
        voyage.setKoperative(koperative);
        voyage.setDepartureTime(LocalDateTime.now().plusDays(1));
        voyage.setPricePerSeat(new BigDecimal("25000.00"));
        voyage.setAvailableSeats(20);
        entityManager.persist(voyage);

        reservation = new ReservationEntity();
        reservation.setVoyage(voyage);
        reservation.setBookingReference("BK-TEST-001");
        reservation.setStatus(ReservationStatusEnum.PENDING_PAYMENT);
        reservation.setTotalAmount(new BigDecimal("50000.00"));
        entityManager.persist(reservation);

        entityManager.flush();

        // Default mock: apiClient.authenticate returns a valid token
        var tokenResponse = MVolaTokenResponse.builder()
                .accessToken("test-token-123")
                .tokenType("Bearer")
                .expiresIn(3600)
                .scope("EXT_INT_MVOLA_SCOPE")
                .createdAt(Instant.now())
                .build();
        when(apiClient.authenticate(MVolaTokenResponse.class)).thenReturn(tokenResponse);
    }

    // =========================================================================
    // initPayment
    // =========================================================================
    @Nested
    @DisplayName("initPayment")
    class InitPayment {

        @Test
        @DisplayName("Should create facturation and transaction, then call MVola API")
        void initPayment_happyPath() throws Exception {
            // Arrange
            var mvolaResponse = MVolaPaymentResponse.builder()
                    .status("PENDING")
                    .serverCorrelationId("corr-12345")
                    .notificationMethod("CALLBACK")
                    .build();
            when(apiClient.post(anyString(), anyString(), any(), eq(MVolaPaymentResponse.class)))
                    .thenReturn(mvolaResponse);

            var request = PaymentRequest.builder()
                    .reservationId(reservation.getId())
                    .amount(new BigDecimal("50000.00"))
                    .phoneNumber("0343500001")
                    .operatorName("MVOLA")
                    .build();

            // Act
            PaymentTransaction result = mVolaService.initPayment(request);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getStatus()).isEqualTo(PaymentTransactionStatusEnum.PENDING_OTP);
            assertThat(result.getServerCorrelationId()).isEqualTo("corr-12345");
            assertThat(result.getAmount()).isEqualByComparingTo(new BigDecimal("50000.00"));
            assertThat(result.getOperatorName()).isEqualTo("MVOLA");

            // Verify facturation was created in DB
            var facturation = facturationRepository.findByReservationId(reservation.getId());
            assertThat(facturation).isPresent();
            assertThat(facturation.get().getPaymentStatus()).isEqualTo(PaymentStatusEnum.PENDING);

            // Verify API was called
            verify(apiClient).authenticate(MVolaTokenResponse.class);
            verify(apiClient).post(anyString(), anyString(), any(), eq(MVolaPaymentResponse.class));

            // Verify notification was broadcast
            verify(paymentNotificationService).broadcastPaymentUpdate(anyString(), any());
        }

        @Test
        @DisplayName("Should reuse existing facturation for same reservation")
        void initPayment_reusesExistingFacturation() throws Exception {
            // Arrange - create a facturation first
            var existingFacturation = new FacturationEntity();
            existingFacturation.setReservation(reservation);
            existingFacturation.setInvoiceNumber("INV-EXISTING");
            existingFacturation.setAmount(reservation.getTotalAmount());
            existingFacturation.setTaxAmount(BigDecimal.ZERO);
            existingFacturation.setTotalAmount(reservation.getTotalAmount());
            existingFacturation.setRemainingAmount(reservation.getTotalAmount());
            existingFacturation.setPaymentStatus(PaymentStatusEnum.PENDING);
            existingFacturation.setDueDate(LocalDateTime.now().plusDays(7));
            entityManager.persist(existingFacturation);
            entityManager.flush();

            var mvolaResponse = MVolaPaymentResponse.builder()
                    .status("PENDING")
                    .serverCorrelationId("corr-67890")
                    .build();
            when(apiClient.post(anyString(), anyString(), any(), eq(MVolaPaymentResponse.class)))
                    .thenReturn(mvolaResponse);

            var request = PaymentRequest.builder()
                    .reservationId(reservation.getId())
                    .amount(new BigDecimal("50000.00"))
                    .phoneNumber("0343500001")
                    .operatorName("MVOLA")
                    .build();

            // Act
            PaymentTransaction result = mVolaService.initPayment(request);

            // Assert - should not create a second facturation
            assertThat(result).isNotNull();
            var allFacturations = facturationRepository.findAll();
            long reservationFacturations = allFacturations.stream()
                    .filter(f -> f.getReservation().getId().equals(reservation.getId()))
                    .count();
            assertThat(reservationFacturations).isEqualTo(1);
        }

        @Test
        @DisplayName("Should mark transaction as FAILED when MVola API throws")
        void initPayment_apiFailure_marksTransactionFailed() throws Exception {
            // Arrange
            when(apiClient.post(anyString(), anyString(), any(), eq(MVolaPaymentResponse.class)))
                    .thenThrow(new IOException("MVola API error: 500 Internal Server Error"));

            var request = PaymentRequest.builder()
                    .reservationId(reservation.getId())
                    .amount(new BigDecimal("50000.00"))
                    .phoneNumber("0343500001")
                    .operatorName("MVOLA")
                    .build();

            // Act & Assert
            assertThatThrownBy(() -> mVolaService.initPayment(request))
                    .isInstanceOf(IOException.class)
                    .hasMessageContaining("MVola API error");

            // Verify the transaction was created and marked as FAILED
            var transactions = paymentTransactionRepository.findAll();
            assertThat(transactions).isNotEmpty();
            var failedTx = transactions.stream()
                    .filter(tx -> tx.getStatus() == PaymentTransactionStatusEnum.FAILED)
                    .findFirst();
            assertThat(failedTx).isPresent();
        }

        @Test
        @DisplayName("Should throw PaymentException for non-existent reservation")
        void initPayment_invalidReservation_throwsException() {
            // Arrange
            var request = PaymentRequest.builder()
                    .reservationId(99999L)
                    .amount(new BigDecimal("50000.00"))
                    .phoneNumber("0343500001")
                    .operatorName("MVOLA")
                    .build();

            // Act & Assert
            assertThatThrownBy(() -> mVolaService.initPayment(request))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Reservation not found");
        }
    }

    // =========================================================================
    // handleCallback
    // =========================================================================
    @Nested
    @DisplayName("handleCallback")
    class HandleCallback {

        private PaymentTransactionEntity createTestTransaction(PaymentTransactionStatusEnum status, String correlationId) {
            var facturation = new FacturationEntity();
            facturation.setReservation(reservation);
            facturation.setInvoiceNumber("INV-CB-" + System.nanoTime());
            facturation.setAmount(reservation.getTotalAmount());
            facturation.setTaxAmount(BigDecimal.ZERO);
            facturation.setTotalAmount(reservation.getTotalAmount());
            facturation.setRemainingAmount(reservation.getTotalAmount());
            facturation.setPaymentStatus(PaymentStatusEnum.PENDING);
            facturation.setDueDate(LocalDateTime.now().plusDays(7));
            entityManager.persist(facturation);

            var transaction = new PaymentTransactionEntity();
            transaction.setFacturation(facturation);
            transaction.setTransactionReference("TXB-CB-" + System.nanoTime());
            transaction.setOperatorName("MVOLA");
            transaction.setAmount(new BigDecimal("50000.00"));
            transaction.setStatus(status);
            transaction.setPhoneNumber("0343500001");
            transaction.setServerCorrelationId(correlationId);
            transaction.setInitiatedAt(LocalDateTime.now());
            entityManager.persist(transaction);
            entityManager.flush();

            return transaction;
        }

        @Test
        @DisplayName("Should complete transaction on SUCCESS callback")
        void handleCallback_success_completesTransaction() {
            // Arrange
            var tx = createTestTransaction(PaymentTransactionStatusEnum.PENDING_OTP, "corr-success-1");

            // Act
            mVolaService.handleCallback("corr-success-1", "COMPLETED", "Transaction completed");

            // Assert
            entityManager.clear();
            var updated = paymentTransactionRepository.findByServerCorrelationId("corr-success-1").orElseThrow();
            assertThat(updated.getStatus()).isEqualTo(PaymentTransactionStatusEnum.COMPLETED);
            assertThat(updated.getOperatorResponse()).isEqualTo("Transaction completed");
            assertThat(updated.getCompletedAt()).isNotNull();

            verify(paymentNotificationService).broadcastPaymentUpdate(eq(tx.getTransactionReference()), any());
        }

        @Test
        @DisplayName("Should cancel transaction on CANCELLED callback")
        void handleCallback_cancelled_cancelsTransaction() {
            // Arrange
            createTestTransaction(PaymentTransactionStatusEnum.PENDING_OTP, "corr-cancel-1");

            // Act
            mVolaService.handleCallback("corr-cancel-1", "CANCELLED", "User cancelled");

            // Assert
            entityManager.clear();
            var updated = paymentTransactionRepository.findByServerCorrelationId("corr-cancel-1").orElseThrow();
            assertThat(updated.getStatus()).isEqualTo(PaymentTransactionStatusEnum.CANCELLED);
            assertThat(updated.getCompletedAt()).isNotNull();
        }

        @Test
        @DisplayName("Should ignore callback on already terminal transaction")
        void handleCallback_alreadyTerminal_ignoresCallback() {
            // Arrange
            var tx = createTestTransaction(PaymentTransactionStatusEnum.COMPLETED, "corr-terminal-1");
            tx.setCompletedAt(LocalDateTime.now().minusMinutes(5));
            entityManager.persist(tx);
            entityManager.flush();

            // Act
            mVolaService.handleCallback("corr-terminal-1", "FAILED", "Should be ignored");

            // Assert
            entityManager.clear();
            var unchanged = paymentTransactionRepository.findByServerCorrelationId("corr-terminal-1").orElseThrow();
            assertThat(unchanged.getStatus()).isEqualTo(PaymentTransactionStatusEnum.COMPLETED);

            // Notification should NOT be broadcast for already-terminal transactions
            verify(paymentNotificationService, never()).broadcastPaymentUpdate(anyString(), any());
        }
    }

    // =========================================================================
    // getPaymentStatus
    // =========================================================================
    @Nested
    @DisplayName("getPaymentStatus")
    class GetPaymentStatus {

        @Test
        @DisplayName("Should return correct payment status by reference")
        void getPaymentStatus_returnsCorrectStatus() {
            // Arrange
            var facturation = new FacturationEntity();
            facturation.setReservation(reservation);
            facturation.setInvoiceNumber("INV-STATUS-" + System.nanoTime());
            facturation.setAmount(reservation.getTotalAmount());
            facturation.setTaxAmount(BigDecimal.ZERO);
            facturation.setTotalAmount(reservation.getTotalAmount());
            facturation.setRemainingAmount(reservation.getTotalAmount());
            facturation.setPaymentStatus(PaymentStatusEnum.PENDING);
            facturation.setDueDate(LocalDateTime.now().plusDays(7));
            entityManager.persist(facturation);

            var transaction = new PaymentTransactionEntity();
            transaction.setFacturation(facturation);
            transaction.setTransactionReference("TXB-STATUS-001");
            transaction.setOperatorName("MVOLA");
            transaction.setAmount(new BigDecimal("30000.00"));
            transaction.setStatus(PaymentTransactionStatusEnum.PROCESSING);
            transaction.setPhoneNumber("0343500002");
            transaction.setServerCorrelationId("corr-status-1");
            transaction.setInitiatedAt(LocalDateTime.now());
            entityManager.persist(transaction);
            entityManager.flush();

            // Act
            PaymentTransaction result = mVolaService.getPaymentStatus("TXB-STATUS-001");

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getTransactionReference()).isEqualTo("TXB-STATUS-001");
            assertThat(result.getStatus()).isEqualTo(PaymentTransactionStatusEnum.PROCESSING);
            assertThat(result.getAmount()).isEqualByComparingTo(new BigDecimal("30000.00"));
        }
    }

    // =========================================================================
    // checkAndUpdateTransactionStatus
    // =========================================================================
    @Nested
    @DisplayName("checkAndUpdateTransactionStatus")
    class CheckAndUpdateStatus {

        @Test
        @DisplayName("Should poll MVola API and update transaction status")
        void checkAndUpdate_pollsApiAndUpdatesStatus() throws Exception {
            // Arrange
            var facturation = new FacturationEntity();
            facturation.setReservation(reservation);
            facturation.setInvoiceNumber("INV-POLL-" + System.nanoTime());
            facturation.setAmount(reservation.getTotalAmount());
            facturation.setTaxAmount(BigDecimal.ZERO);
            facturation.setTotalAmount(reservation.getTotalAmount());
            facturation.setRemainingAmount(reservation.getTotalAmount());
            facturation.setPaymentStatus(PaymentStatusEnum.PENDING);
            facturation.setDueDate(LocalDateTime.now().plusDays(7));
            entityManager.persist(facturation);

            var transaction = new PaymentTransactionEntity();
            transaction.setFacturation(facturation);
            transaction.setTransactionReference("TXB-POLL-001");
            transaction.setOperatorName("MVOLA");
            transaction.setAmount(new BigDecimal("50000.00"));
            transaction.setStatus(PaymentTransactionStatusEnum.PENDING_OTP);
            transaction.setPhoneNumber("0343500001");
            transaction.setServerCorrelationId("corr-poll-1");
            transaction.setInitiatedAt(LocalDateTime.now());
            entityManager.persist(transaction);
            entityManager.flush();

            // Mock the MVola status API
            var statusResponse = MVolaPaymentResponse.builder()
                    .status("COMPLETED")
                    .serverCorrelationId("corr-poll-1")
                    .build();
            when(apiClient.get(anyString(), anyString(), eq(MVolaPaymentResponse.class)))
                    .thenReturn(statusResponse);

            // Act
            PaymentTransaction result = mVolaService.checkAndUpdateTransactionStatus("TXB-POLL-001");

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getStatus()).isEqualTo(PaymentTransactionStatusEnum.COMPLETED);

            verify(apiClient).get(anyString(), contains("corr-poll-1"), eq(MVolaPaymentResponse.class));
        }

        @Test
        @DisplayName("Should throw PaymentException when transaction has no correlationId")
        void checkAndUpdate_noCorrelationId_throwsException() {
            // Arrange
            var facturation = new FacturationEntity();
            facturation.setReservation(reservation);
            facturation.setInvoiceNumber("INV-NOCORR-" + System.nanoTime());
            facturation.setAmount(reservation.getTotalAmount());
            facturation.setTaxAmount(BigDecimal.ZERO);
            facturation.setTotalAmount(reservation.getTotalAmount());
            facturation.setRemainingAmount(reservation.getTotalAmount());
            facturation.setPaymentStatus(PaymentStatusEnum.PENDING);
            facturation.setDueDate(LocalDateTime.now().plusDays(7));
            entityManager.persist(facturation);

            var transaction = new PaymentTransactionEntity();
            transaction.setFacturation(facturation);
            transaction.setTransactionReference("TXB-NOCORR-001");
            transaction.setOperatorName("MVOLA");
            transaction.setAmount(new BigDecimal("50000.00"));
            transaction.setStatus(PaymentTransactionStatusEnum.INITIATED);
            transaction.setPhoneNumber("0343500001");
            // No serverCorrelationId set
            transaction.setInitiatedAt(LocalDateTime.now());
            entityManager.persist(transaction);
            entityManager.flush();

            // Act & Assert
            assertThatThrownBy(() -> mVolaService.checkAndUpdateTransactionStatus("TXB-NOCORR-001"))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("no server correlation ID");
        }
    }
}
