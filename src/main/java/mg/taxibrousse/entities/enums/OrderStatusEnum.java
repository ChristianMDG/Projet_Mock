package mg.taxibrousse.entities.enums;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public enum OrderStatusEnum {

    PENDING,
    CONFIRMED,
    PAYMENT_FAILED,
    READY_IN_STORE,
    DELIVERY_TO_STATION,
    DELIVERY_IN_PROGRESS,
    AVAILABLE_AT_COUNTER,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    private static final Set<OrderStatusEnum> OPERATIONAL_STATUSES = EnumSet.of(
            READY_IN_STORE,
            DELIVERY_TO_STATION,
            DELIVERY_IN_PROGRESS,
            AVAILABLE_AT_COUNTER,
            DELIVERED,
            PROCESSING,
            SHIPPED,
            CANCELLED
    );

    private static final Map<OrderStatusEnum, Set<OrderStatusEnum>> ALLOWED_TRANSITIONS = Map.ofEntries(
            Map.entry(PENDING, EnumSet.of(CONFIRMED, READY_IN_STORE, DELIVERY_TO_STATION, DELIVERY_IN_PROGRESS, AVAILABLE_AT_COUNTER, PROCESSING, PAYMENT_FAILED, CANCELLED)),
            Map.entry(CONFIRMED, EnumSet.of(READY_IN_STORE, DELIVERY_TO_STATION, DELIVERY_IN_PROGRESS, AVAILABLE_AT_COUNTER, PROCESSING, CANCELLED)),
            Map.entry(PAYMENT_FAILED, EnumSet.of(PENDING, CANCELLED)),
            Map.entry(READY_IN_STORE, OPERATIONAL_STATUSES),
            Map.entry(DELIVERY_TO_STATION, OPERATIONAL_STATUSES),
            Map.entry(DELIVERY_IN_PROGRESS, OPERATIONAL_STATUSES),
            Map.entry(AVAILABLE_AT_COUNTER, OPERATIONAL_STATUSES),
            Map.entry(PROCESSING, OPERATIONAL_STATUSES),
            Map.entry(SHIPPED, OPERATIONAL_STATUSES),
            Map.entry(DELIVERED, OPERATIONAL_STATUSES),
            Map.entry(CANCELLED, EnumSet.noneOf(OrderStatusEnum.class))
    );

    public boolean canTransitionTo(OrderStatusEnum next) {
        return ALLOWED_TRANSITIONS.getOrDefault(this, EnumSet.noneOf(OrderStatusEnum.class)).contains(next);
    }
}
