package mg.taxibrousse.services;

import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.enums.OrderStatusEnum;

public interface IShopNotificationService {

    void sendOrderConfirmation(OrderEntity order);

    void notifyStatusChange(OrderEntity order, OrderStatusEnum previousStatus);
}
