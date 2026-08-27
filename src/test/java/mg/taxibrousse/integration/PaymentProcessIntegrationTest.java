package mg.taxibrousse.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import mg.taxibrousse.HttpRequest.AirtelApiClient;
import mg.taxibrousse.HttpRequest.MVolaApiClient;
import mg.taxibrousse.TaxibrousseApplication;
import mg.taxibrousse.config.TestRedisConfig;
import mg.taxibrousse.dto.PayableType;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.airtel.AirtelCallbackRequest;
import mg.taxibrousse.dto.airtel.AirtelPaymentData;
import mg.taxibrousse.dto.airtel.AirtelPaymentResponse;
import mg.taxibrousse.dto.airtel.AirtelStatus;
import mg.taxibrousse.dto.airtel.AirtelStatusResponse;
import mg.taxibrousse.dto.airtel.AirtelTokenResponse;
import mg.taxibrousse.dto.mvola.MVolaCallbackRequest;
import mg.taxibrousse.dto.mvola.MVolaPaymentResponse;
import mg.taxibrousse.dto.mvola.MVolaTokenResponse;
import mg.taxibrousse.dto.orangemoney.OrangeMoneyCallbackRequest;
import mg.taxibrousse.dto.shop.BuyNowRequest;
import mg.taxibrousse.entities.ChauffeurEntity;
import mg.taxibrousse.entities.CommissionEntity;
import mg.taxibrousse.entities.CrafterEntity;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.InventoryEntity;
import mg.taxibrousse.entities.KoperativeEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.UserInfoEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;
import mg.taxibrousse.models.Order;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IFacturationRepository;
import mg.taxibrousse.repositories.IOrderRepository;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.services.IMVolaService;
import mg.taxibrousse.services.IOrangeMoneyService;
import mg.taxibrousse.services.IAirtelMoneyService;
import mg.taxibrousse.services.implementation.MVolaService;
import mg.taxibrousse.services.implementation.OrangeMoneyService;
import mg.taxibrousse.services.implementation.AirtelMoneyService;
import mg.taxibrousse.services.IPaymentNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = {TaxibrousseApplication.class, TestRedisConfig.class})
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
public class PaymentProcessIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private IPaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private IFacturationRepository facturationRepository;

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private IUserInfoRepository userInfoRepository;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @MockitoBean
    private MVolaApiClient mvolaApiClient;

    @MockitoBean
    private AirtelApiClient airtelApiClient;

    @MockitoBean
    private HttpClient httpClient;

    @MockitoBean
    private IPaymentNotificationService paymentNotificationService;

    @Autowired
    private IMVolaService mvolaService;

    @Autowired
    private IOrangeMoneyService orangeMoneyService;

    @Autowired
    private IAirtelMoneyService airtelMoneyService;

    // Test data holders
    private KoperativeEntity koperative;
    private ChauffeurEntity chauffeur;
    private CrafterEntity crafter;
    private VoyageEntity voyage;
    private ReservationEntity reservation;
    private CommissionEntity commission;

    private UserInfoEntity testUser;
    private ProductEntity testProduct;

    @BeforeEach
    void setUp() throws Exception {
        if (mvolaService instanceof MVolaService) {
            ((MVolaService) mvolaService).clearCache();
        }
        if (orangeMoneyService instanceof OrangeMoneyService) {
            ((OrangeMoneyService) orangeMoneyService).clearCache();
        }
        if (airtelMoneyService instanceof AirtelMoneyService) {
            ((AirtelMoneyService) airtelMoneyService).clearCache();
        }

        // 1. Setup minimal Voyage + Reservation graph
        koperative = new KoperativeEntity();
        koperative.setName("Integration Koperative");
        entityManager.persist(koperative);

        chauffeur = new ChauffeurEntity();
        chauffeur.setLicenseNumber("LIC-INTEG-001");
        chauffeur.setKoperative(koperative);
        entityManager.persist(chauffeur);

        crafter = new CrafterEntity();
        crafter.setRegistrationNumber("REG-INTEG-001");
        crafter.setKoperative(koperative);
        entityManager.persist(crafter);

        voyage = new VoyageEntity();
        voyage.setKoperative(koperative);
        voyage.setChauffeur(chauffeur);
        voyage.setCrafter(crafter);
        voyage.setDepartureTime(LocalDateTime.now().plusDays(2));
        voyage.setPricePerSeat(new BigDecimal("30000.00"));
        voyage.setPriceKoperative(new BigDecimal("30000.00"));
        voyage.setAvailableSeats(18);
        entityManager.persist(voyage);

        reservation = new ReservationEntity();
        reservation.setVoyage(voyage);
        reservation.setBookingReference("BK-INTEG-001");
        reservation.setStatus(ReservationStatusEnum.PENDING_PAYMENT);
        reservation.setTotalAmount(new BigDecimal("60000.00"));
        reservation.setSeatCount(2);
        entityManager.persist(reservation);

        commission = new CommissionEntity();
        commission.setKoperative(koperative);
        commission.setMinAmount(new BigDecimal("100.00"));
        commission.setMaxAmount(new BigDecimal("999999.00"));
        commission.setFrais(new BigDecimal("4000.00"));
        entityManager.persist(commission);

        // 2. Setup Shop product and stock
        testProduct = new ProductEntity();
        testProduct.setName("Taxi-Brousse Toy Model");
        testProduct.setPrice(new BigDecimal("45000.00"));
        testProduct.setSku("TOY-MODEL-001");
        testProduct.setSlug("toy-model-001");
        testProduct.setStock(10);
        testProduct.setIsActive(true);
        entityManager.persist(testProduct);

        InventoryEntity inventory = new InventoryEntity();
        inventory.setProduct(testProduct);
        inventory.setQuantity(10);
        inventory.setReserved(0);
        entityManager.persist(inventory);

        // 3. Setup User info
        testUser = new UserInfoEntity();
        testUser.setUsername("testuser");
        testUser.setPassword("password");
        testUser.setAdmin(false);
        testUser.setEmail("testuser@example.com");
        testUser.setPhone("0343500001");
        testUser.setIsActive(true);
        entityManager.persist(testUser);

        entityManager.flush();
    }

    private void mockMVolaApi(String correlationId) throws Exception {
        var tokenResponse = MVolaTokenResponse.builder()
                .accessToken("mvola-token-123")
                .tokenType("Bearer")
                .expiresIn(3600)
                .scope("EXT_INT_MVOLA_SCOPE")
                .createdAt(Instant.now())
                .build();
        when(mvolaApiClient.authenticate(MVolaTokenResponse.class)).thenReturn(tokenResponse);

        var mvolaResponse = MVolaPaymentResponse.builder()
                .status("PENDING")
                .serverCorrelationId(correlationId)
                .notificationMethod("CALLBACK")
                .build();
        when(mvolaApiClient.post(anyString(), anyString(), any(), eq(MVolaPaymentResponse.class))).thenReturn(mvolaResponse);

        var statusResponse = MVolaPaymentResponse.builder()
                .status("COMPLETED")
                .serverCorrelationId(correlationId)
                .build();
        when(mvolaApiClient.get(anyString(), anyString(), eq(MVolaPaymentResponse.class))).thenReturn(statusResponse);
    }

    private HttpResponse<String> mockHttpResponse(int statusCode, String body) {
        HttpResponse<String> response = mock(HttpResponse.class);
        when(response.statusCode()).thenReturn(statusCode);
        when(response.body()).thenReturn(body);
        return response;
    }

    private void mockOrangeMoneyHttp(String notifToken, String payToken, String status) throws IOException, InterruptedException {
        HttpResponse<String> authResponse = mockHttpResponse(200, "{\"access_token\":\"om-auth-token-xyz\",\"expires_in\":3600}");
        HttpResponse<String> initResponse = mockHttpResponse(201, "{\"status\":201,\"pay_token\":\"" + payToken + "\",\"payment_url\":\"http://om.example.com/pay\",\"notif_token\":\"" + notifToken + "\"}");
        HttpResponse<String> statusResponse = mockHttpResponse(200, "{\"status\":\"" + status + "\",\"txnid\":\"om-txn-123\"}");

        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(authResponse)
                .thenReturn(initResponse)
                .thenReturn(authResponse)
                .thenReturn(statusResponse);
    }

    private void mockAirtelApi(String correlationId) throws IOException, InterruptedException {
        AirtelTokenResponse tokenResponse = new AirtelTokenResponse("airtel-token-123", "Bearer", 3600);
        when(airtelApiClient.authenticate(AirtelTokenResponse.class)).thenReturn(tokenResponse);

        AirtelPaymentResponse paymentResponse = new AirtelPaymentResponse();
        AirtelPaymentData data = new AirtelPaymentData();
        AirtelPaymentData.Transaction transaction = new AirtelPaymentData.Transaction();
        transaction.setId(correlationId);
        transaction.setAirtelMoneyId("airtel-money-txn-999");
        transaction.setStatus("SUCCESS");
        data.setTransaction(transaction);
        paymentResponse.setData(data);

        AirtelStatus status = new AirtelStatus();
        status.setSuccess(true);
        status.setCode("200");
        paymentResponse.setStatus(status);

        when(airtelApiClient.post(anyString(), anyString(), any(), eq(AirtelPaymentResponse.class))).thenReturn(paymentResponse);

        AirtelStatusResponse statusResponse = new AirtelStatusResponse();
        statusResponse.setData(data);
        statusResponse.setStatus(status);
        when(airtelApiClient.get(anyString(), anyString(), eq(AirtelStatusResponse.class))).thenReturn(statusResponse);
    }

    // =========================================================================
    // MVOLA RESERVATION TEST FLOW
    // =========================================================================
    @Test
    void testMVolaReservationPaymentFlow_E2E() throws Exception {
        String correlationId = "mvola-corr-integ-1";
        mockMVolaApi(correlationId);

        // 1. Initiate Payment
        PaymentRequest request = PaymentRequest.builder()
                .payableId(reservation.getId())
                .payableType(PayableType.RESERVATION)
                .amount(new BigDecimal("60000.00"))
                .phoneNumber("0343500001") // MVola / Telma prefix
                .operatorName("MVOLA")
                .build();

        MvcResult initResult = mockMvc.perform(post("/api/payments/mvola/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        var initTx = objectMapper.readValue(initResult.getResponse().getContentAsString(), PaymentTransaction.class);
        assertThat(initTx.getStatus()).isEqualTo(PaymentTransactionStatusEnum.PENDING_OTP);
        assertThat(initTx.getServerCorrelationId()).isEqualTo(correlationId);

        // Verify Facturation and Transaction exist in DB
        var facturation = facturationRepository.findByReservationId(reservation.getId()).orElseThrow();
        assertThat(facturation.getPaymentStatus()).isEqualTo(PaymentStatusEnum.PENDING);
        assertThat(facturation.getRemainingAmount()).isEqualByComparingTo(new BigDecimal("60000.00"));

        // 2. Manual status check (polling)
        mockMvc.perform(post("/api/payments/mvola/check/" + initTx.getTransactionReference()))
                .andExpect(status().isOk());

        // 3. Simulate callback completion from MVola operator
        MVolaCallbackRequest callback = MVolaCallbackRequest.builder()
                .serverCorrelationId(correlationId)
                .transactionStatus("COMPLETED")
                .build();

        mockMvc.perform(put("/api/payments/mvola/callback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        // 4. Verify Final State
        entityManager.flush();
        entityManager.clear();

        var updatedTx = paymentTransactionRepository.findByTransactionReference(initTx.getTransactionReference()).orElseThrow();
        assertThat(updatedTx.getStatus()).isEqualTo(PaymentTransactionStatusEnum.COMPLETED);

        var updatedFact = facturationRepository.findByReservationId(reservation.getId()).orElseThrow();
        assertThat(updatedFact.getPaymentStatus()).isEqualTo(PaymentStatusEnum.PAID);
        assertThat(updatedFact.getRemainingAmount()).isEqualByComparingTo(BigDecimal.ZERO);

        var updatedRes = entityManager.find(ReservationEntity.class, reservation.getId());
        assertThat(updatedRes.getStatus()).isEqualTo(ReservationStatusEnum.CONFIRMED);
    }

    // =========================================================================
    // ORANGE MONEY RESERVATION TEST FLOW
    // =========================================================================
    @Test
    void testOrangeMoneyReservationPaymentFlow_E2E() throws Exception {
        String payToken = "om-paytoken-integ-1";
        String notifToken = "om-notiftoken-integ-1";
        mockOrangeMoneyHttp(notifToken, payToken, "SUCCESS");

        // 1. Initiate Payment
        PaymentRequest request = PaymentRequest.builder()
                .payableId(reservation.getId())
                .payableType(PayableType.RESERVATION)
                .amount(new BigDecimal("60000.00"))
                .phoneNumber("0323500001") // Orange prefix
                .operatorName("ORANGE")
                .build();

        MvcResult initResult = mockMvc.perform(post("/api/payments/orangemoney/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        var initTx = objectMapper.readValue(initResult.getResponse().getContentAsString(), PaymentTransaction.class);
        assertThat(initTx.getStatus()).isEqualTo(PaymentTransactionStatusEnum.INITIATED);
        assertThat(initTx.getServerCorrelationId()).isEqualTo(payToken);

        // Verify Redis setup (must bridge callback using stringRedisTemplate mock)
        ValueOperations<String, String> ops = mock(ValueOperations.class);
        when(stringRedisTemplate.opsForValue()).thenReturn(ops);
        when(ops.get("om:notif:" + notifToken)).thenReturn(initTx.getTransactionReference());

        // 2. Simulate callback success
        OrangeMoneyCallbackRequest callback = OrangeMoneyCallbackRequest.builder()
                .status("SUCCESS")
                .txnId(initTx.getTransactionReference())
                .notifToken(notifToken)
                .build();

        mockMvc.perform(post("/api/payments/orangemoney/callback")
                        .param("order_id", initTx.getTransactionReference())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        // 3. Verify final state
        entityManager.flush();
        entityManager.clear();

        var updatedTx = paymentTransactionRepository.findByTransactionReference(initTx.getTransactionReference()).orElseThrow();
        assertThat(updatedTx.getStatus()).isEqualTo(PaymentTransactionStatusEnum.COMPLETED);

        var updatedRes = entityManager.find(ReservationEntity.class, reservation.getId());
        assertThat(updatedRes.getStatus()).isEqualTo(ReservationStatusEnum.CONFIRMED);
    }

    // =========================================================================
    // AIRTEL MONEY RESERVATION TEST FLOW
    // =========================================================================
    @Test
    void testAirtelMoneyReservationPaymentFlow_E2E() throws Exception {
        String correlationId = "airtel-corr-integ-1";
        mockAirtelApi(correlationId);

        // 1. Initiate Payment
        PaymentRequest request = PaymentRequest.builder()
                .payableId(reservation.getId())
                .payableType(PayableType.RESERVATION)
                .amount(new BigDecimal("60000.00"))
                .phoneNumber("0333500001") // Airtel prefix
                .operatorName("AIRTEL")
                .build();

        MvcResult initResult = mockMvc.perform(post("/api/payments/airtelmoney/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        var initTx = objectMapper.readValue(initResult.getResponse().getContentAsString(), PaymentTransaction.class);
        assertThat(initTx.getStatus()).isEqualTo(PaymentTransactionStatusEnum.PENDING_OTP);
        assertThat(initTx.getServerCorrelationId()).isEqualTo(initTx.getTransactionReference());

        // 2. Simulate callback success
        AirtelCallbackRequest callback = new AirtelCallbackRequest();
        AirtelCallbackRequest.Transaction txBody = new AirtelCallbackRequest.Transaction();
        txBody.setId(initTx.getTransactionReference());
        txBody.setStatusCode("TS"); // TS normally stands for transaction success/completed in Airtel callbacks
        callback.setTransaction(txBody);

        mockMvc.perform(post("/api/payments/airtelmoney/callback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        // 3. Verify final state
        entityManager.flush();
        entityManager.clear();

        var updatedTx = paymentTransactionRepository.findByTransactionReference(initTx.getTransactionReference()).orElseThrow();
        assertThat(updatedTx.getStatus()).isEqualTo(PaymentTransactionStatusEnum.COMPLETED);

        var updatedRes = entityManager.find(ReservationEntity.class, reservation.getId());
        assertThat(updatedRes.getStatus()).isEqualTo(ReservationStatusEnum.CONFIRMED);
    }

    // =========================================================================
    // MVOLA SHOP ORDER FLOW
    // =========================================================================
    @Test
    @WithMockUser(username = "testuser")
    void testMVolaShopOrderFlow_E2E() throws Exception {
        String correlationId = "mvola-order-corr-1";
        mockMVolaApi(correlationId);

        // 1. Initiate buyNow Order
        BuyNowRequest buyNowRequest = BuyNowRequest.builder()
                .productId(testProduct.getId())
                .quantity(1)
                .paymentMethod(PaymentMethodEnum.MOBILE_MONEY)
                .phoneNumber("0343500001") // TELMA
                .customerName("Customer Integ")
                .customerPhone("0343500001")
                .build();

        MvcResult buyNowResult = mockMvc.perform(post("/api/orders/buy-now")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buyNowRequest)))
                .andExpect(status().isOk())
                .andReturn();

        var order = objectMapper.readValue(buyNowResult.getResponse().getContentAsString(), Order.class);
        assertThat(order.getStatus()).isEqualTo(OrderStatusEnum.PENDING);
        assertThat(order.getTransactionReference()).isNotNull();

        // 2. Simulate callback success
        MVolaCallbackRequest callback = MVolaCallbackRequest.builder()
                .serverCorrelationId(correlationId)
                .transactionStatus("COMPLETED")
                .build();

        mockMvc.perform(put("/api/payments/mvola/callback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        // 3. Verify Final State
        entityManager.flush();
        entityManager.clear();

        var updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatusEnum.PROCESSING);

        // Verify inventory reservation committed
        var inventory = entityManager.createQuery("SELECT i FROM Inventory i WHERE i.product.id = :prodId", InventoryEntity.class)
                .setParameter("prodId", testProduct.getId())
                .getSingleResult();
        // Starts with 10 quantity, 1 buyNow reserves 1.
        // Upon confirmation, reserved decreases by 1, quantity decreases by 1. Total available should be 9.
        assertThat(inventory.getQuantity()).isEqualTo(9);
        assertThat(inventory.getReserved()).isEqualTo(0);
    }

    // =========================================================================
    // ORANGE MONEY SHOP ORDER FLOW
    // =========================================================================
    @Test
    @WithMockUser(username = "testuser")
    void testOrangeMoneyShopOrderFlow_E2E() throws Exception {
        String payToken = "om-order-pay-1";
        String notifToken = "om-order-notif-1";
        mockOrangeMoneyHttp(notifToken, payToken, "SUCCESS");

        // 1. Buy Now
        BuyNowRequest buyNowRequest = BuyNowRequest.builder()
                .productId(testProduct.getId())
                .quantity(1)
                .paymentMethod(PaymentMethodEnum.MOBILE_MONEY)
                .phoneNumber("0323500001") // ORANGE
                .customerName("Customer Integ")
                .customerPhone("0323500001")
                .build();

        MvcResult buyNowResult = mockMvc.perform(post("/api/orders/buy-now")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buyNowRequest)))
                .andExpect(status().isOk())
                .andReturn();

        var order = objectMapper.readValue(buyNowResult.getResponse().getContentAsString(), Order.class);
        assertThat(order.getStatus()).isEqualTo(OrderStatusEnum.PENDING);
        assertThat(order.getTransactionReference()).isNotNull();

        // Setup Redis Bridge Mock
        ValueOperations<String, String> ops = mock(ValueOperations.class);
        when(stringRedisTemplate.opsForValue()).thenReturn(ops);
        when(ops.get("om:notif:" + notifToken)).thenReturn(order.getTransactionReference());

        // 2. Simulate Callback
        OrangeMoneyCallbackRequest callback = OrangeMoneyCallbackRequest.builder()
                .status("SUCCESS")
                .txnId(order.getTransactionReference())
                .notifToken(notifToken)
                .build();

        mockMvc.perform(post("/api/payments/orangemoney/callback")
                        .param("order_id", order.getTransactionReference())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        // 3. Verify Final State
        entityManager.flush();
        entityManager.clear();

        var updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatusEnum.PROCESSING);
    }

    // =========================================================================
    // AIRTEL MONEY SHOP ORDER FLOW
    // =========================================================================
    @Test
    @WithMockUser(username = "testuser")
    void testAirtelMoneyShopOrderFlow_E2E() throws Exception {
        String correlationId = "airtel-order-corr-1";
        mockAirtelApi(correlationId);

        // 1. Buy Now
        BuyNowRequest buyNowRequest = BuyNowRequest.builder()
                .productId(testProduct.getId())
                .quantity(1)
                .paymentMethod(PaymentMethodEnum.MOBILE_MONEY)
                .phoneNumber("0333500001") // AIRTEL
                .customerName("Customer Integ")
                .customerPhone("0333500001")
                .build();

        MvcResult buyNowResult = mockMvc.perform(post("/api/orders/buy-now")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buyNowRequest)))
                .andExpect(status().isOk())
                .andReturn();

        var order = objectMapper.readValue(buyNowResult.getResponse().getContentAsString(), Order.class);
        assertThat(order.getStatus()).isEqualTo(OrderStatusEnum.PENDING);
        assertThat(order.getTransactionReference()).isNotNull();

        // 2. Simulate Callback
        AirtelCallbackRequest callback = new AirtelCallbackRequest();
        AirtelCallbackRequest.Transaction txBody = new AirtelCallbackRequest.Transaction();
        txBody.setId(order.getTransactionReference());
        txBody.setStatusCode("TS");
        callback.setTransaction(txBody);

        mockMvc.perform(post("/api/payments/airtelmoney/callback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        // 3. Verify Final State
        entityManager.flush();
        entityManager.clear();

        var updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatusEnum.PROCESSING);
    }
}
