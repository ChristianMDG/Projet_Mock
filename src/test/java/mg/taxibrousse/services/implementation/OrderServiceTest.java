package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityManager;
import mg.taxibrousse.entities.CartEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.UserAccountEntity;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.Order;
import mg.taxibrousse.repositories.ICartItemRepository;
import mg.taxibrousse.repositories.ICartRepository;
import mg.taxibrousse.repositories.IOrderRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.services.IAirtelMoneyService;
import mg.taxibrousse.services.ICartService;
import mg.taxibrousse.services.IInventoryService;
import mg.taxibrousse.services.IMVolaService;
import mg.taxibrousse.services.IOrangeMoneyService;
import mg.taxibrousse.services.IPromotionService;
import mg.taxibrousse.services.IShippingCalculator;
import mg.taxibrousse.services.IShopNotificationService;
import mg.taxibrousse.services.ITaxCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.ObjectProvider;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OrderServiceTest {

    @Mock
    private IOrderRepository orderRepository;

    @Mock
    private ICartRepository cartRepository;

    @Mock
    private ICartItemRepository cartItemRepository;

    @Mock
    private ICartService cartService;

    @Mock
    private IProductRepository productRepository;

    @Mock
    private IInventoryService inventoryService;

    @Mock
    private ITaxCalculator taxCalculator;

    @Mock
    private IShippingCalculator shippingCalculator;

    @Mock
    private IShopNotificationService notificationService;

    @Mock
    private IPromotionService promotionService;

    @Mock
    private EntityManager entityManager;

    @Mock
    private ObjectProvider<IMVolaService> mvolaProvider;

    @Mock
    private ObjectProvider<IAirtelMoneyService> airtelProvider;

    @Mock
    private ObjectProvider<IOrangeMoneyService> orangeProvider;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldUpdateStatusAcrossOperationalStatuses() {
        OrderEntity entity = new OrderEntity();
        entity.setId(10L);
        entity.setOrderNumber("SO-TEST-001");
        entity.setStatus(OrderStatusEnum.READY_IN_STORE);
        entity.setPickupCode("123456");

        when(orderRepository.findById(10L)).thenReturn(Optional.of(entity));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order updated = orderService.updateStatus(10L, OrderStatusEnum.DELIVERY_TO_STATION, "Sent to station", 1L);

        assertThat(updated.getStatus()).isEqualTo(OrderStatusEnum.DELIVERY_TO_STATION);
        assertThat(updated.getPreviousStatus()).isEqualTo(OrderStatusEnum.READY_IN_STORE);
        assertThat(updated.getPickupCode()).isEqualTo("123456");
        verify(notificationService).notifyStatusChange(any(OrderEntity.class), any(OrderStatusEnum.class));
    }

    @Test
    void shouldConfirmPickupWithValidCode() {
        OrderEntity entity = new OrderEntity();
        entity.setId(15L);
        entity.setOrderNumber("SO-TEST-002");
        entity.setStatus(OrderStatusEnum.AVAILABLE_AT_COUNTER);
        entity.setPickupCode("654321");

        when(orderRepository.findById(15L)).thenReturn(Optional.of(entity));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order confirmed = orderService.confirmPickup(15L, "654321");

        assertThat(confirmed.getStatus()).isEqualTo(OrderStatusEnum.DELIVERED);
        assertThat(confirmed.getPreviousStatus()).isEqualTo(OrderStatusEnum.AVAILABLE_AT_COUNTER);
        assertThat(confirmed.getStatusChangeReason()).contains("Code de récupération validé");
        verify(notificationService).notifyStatusChange(any(OrderEntity.class), any(OrderStatusEnum.class));
    }

    @Test
    void shouldFailConfirmPickupWithInvalidCode() {
        OrderEntity entity = new OrderEntity();
        entity.setId(15L);
        entity.setOrderNumber("SO-TEST-002");
        entity.setStatus(OrderStatusEnum.AVAILABLE_AT_COUNTER);
        entity.setPickupCode("654321");

        when(orderRepository.findById(15L)).thenReturn(Optional.of(entity));

        assertThatThrownBy(() -> orderService.confirmPickup(15L, "000000"))
                .isInstanceOf(ShopException.class)
                .hasMessage("exception_invalid_pickup_code");
    }

    @Test
    void shouldReturnOrderWhenAlreadyDeliveredOnConfirmPickup() {
        OrderEntity entity = new OrderEntity();
        entity.setId(20L);
        entity.setOrderNumber("SO-TEST-003");
        entity.setStatus(OrderStatusEnum.DELIVERED);
        entity.setPickupCode("999888");

        when(orderRepository.findById(20L)).thenReturn(Optional.of(entity));

        Order result = orderService.confirmPickup(20L, "999888");

        assertThat(result.getStatus()).isEqualTo(OrderStatusEnum.DELIVERED);
    }
}
