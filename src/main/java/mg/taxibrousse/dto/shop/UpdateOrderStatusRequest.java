package mg.taxibrousse.dto.shop;

import mg.taxibrousse.entities.enums.OrderStatusEnum;

public record UpdateOrderStatusRequest(OrderStatusEnum status, String reason) {
}
