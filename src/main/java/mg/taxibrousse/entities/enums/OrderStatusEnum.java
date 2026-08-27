package mg.taxibrousse.entities.enums;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public enum OrderStatusEnum {

    PENDING, CONFIRMED, PAYMENT_FAILED, PROCESSING, SHIPPED, DELIVERED, CANCELLED;

    private static final Map<OrderStatusEnum, Set<OrderStatusEnum>> ALLOWED_TRANSITIONS = Map.of(PENDING,
            EnumSet.of(CONFIRMED, PROCESSING, PAYMENT_FAILED, CANCELLED),
            CONFIRMED,
            EnumSet.of(PROCESSING, CANCELLED),
            PAYMENT_FAILED,
            EnumSet.of(PENDING, CANCELLED),
            PROCESSING,
            EnumSet.of(SHIPPED, CANCELLED),
            SHIPPED,
            EnumSet.of(DELIVERED, CANCELLED),
            DELIVERED,
            EnumSet.noneOf(OrderStatusEnum.class),
            CANCELLED,
            EnumSet.noneOf(OrderStatusEnum.class));

    public boolean canTransitionTo(OrderStatusEnum next) {
        return ALLOWED_TRANSITIONS.getOrDefault(this, EnumSet.noneOf(OrderStatusEnum.class)).contains(next);
    }
}
