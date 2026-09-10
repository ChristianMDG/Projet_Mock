package mg.taxibrousse.controllers;

import mg.taxibrousse.dto.shop.ConfirmPickupRequest;
import mg.taxibrousse.dto.shop.UpdateOrderStatusRequest;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.models.Order;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.services.IOrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OrderControllerTest {

    @Mock
    private IOrderService orderService;

    @Mock
    private IUserInfoRepository userInfoRepository;

    @InjectMocks
    private OrderController orderController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldConfirmPickup() {
        Order mockOrder = Order.builder()
                .id(1L)
                .orderNumber("SO-12345678")
                .status(OrderStatusEnum.DELIVERED)
                .pickupCode("123456")
                .build();

        when(orderService.confirmPickup(1L, "123456")).thenReturn(mockOrder);

        ConfirmPickupRequest request = new ConfirmPickupRequest("123456");
        ResponseEntity<Order> response = orderController.confirmPickup(1L, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(OrderStatusEnum.DELIVERED);
        verify(orderService).confirmPickup(1L, "123456");
    }

    @Test
    void shouldUpdateOrderStatus() {
        Order mockOrder = Order.builder()
                .id(1L)
                .orderNumber("SO-12345678")
                .status(OrderStatusEnum.DELIVERY_TO_STATION)
                .build();

        when(orderService.updateStatus(1L, OrderStatusEnum.DELIVERY_TO_STATION, "En gare", null))
                .thenReturn(mockOrder);

        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest(OrderStatusEnum.DELIVERY_TO_STATION, "En gare");
        ResponseEntity<Order> response = orderController.updateOrderStatus(1L, request, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(OrderStatusEnum.DELIVERY_TO_STATION);
        verify(orderService).updateStatus(1L, OrderStatusEnum.DELIVERY_TO_STATION, "En gare", null);
    }
}
