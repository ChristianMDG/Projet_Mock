package mg.taxibrousse.entities.enums;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public enum OrderStatusEnum {

    PENDING,
    CONFIRMED,
    PAYMENT_FAILED,
    PROCESSING,
    SHIPPED,
    READY_IN_STORE,
    DELIVERY_TO_STATION,
    DELIVERY_IN_PROGRESS,
    AVAILABLE_AT_COUNTER,
    DELIVERED,
    CANCELLED;

    private static final Map<OrderStatusEnum, Set<OrderStatusEnum>> ALLOWED_TRANSITIONS = Map.ofEntries(
            Map.entry(PENDING, EnumSet.of(CONFIRMED, PROCESSING, PAYMENT_FAILED, CANCELLED, READY_IN_STORE)),
            Map.entry(CONFIRMED, EnumSet.of(PROCESSING, CANCELLED, READY_IN_STORE, DELIVERY_TO_STATION)),
            Map.entry(PAYMENT_FAILED, EnumSet.of(PENDING, CANCELLED)),
            Map.entry(PROCESSING, EnumSet.of(SHIPPED, READY_IN_STORE, DELIVERY_TO_STATION, DELIVERY_IN_PROGRESS, CANCELLED)),
            Map.entry(SHIPPED, EnumSet.of(DELIVERED, AVAILABLE_AT_COUNTER, DELIVERY_IN_PROGRESS, CANCELLED)),
            Map.entry(READY_IN_STORE, EnumSet.of(DELIVERY_TO_STATION, DELIVERY_IN_PROGRESS, AVAILABLE_AT_COUNTER, DELIVERED, CANCELLED, PROCESSING)),
            Map.entry(DELIVERY_TO_STATION, EnumSet.of(DELIVERY_IN_PROGRESS, AVAILABLE_AT_COUNTER, DELIVERED, CANCELLED, READY_IN_STORE)),
            Map.entry(DELIVERY_IN_PROGRESS, EnumSet.of(AVAILABLE_AT_COUNTER, DELIVERED, CANCELLED, DELIVERY_TO_STATION)),
            Map.entry(AVAILABLE_AT_COUNTER, EnumSet.of(DELIVERED, CANCELLED, DELIVERY_IN_PROGRESS)),
            Map.entry(DELIVERED, EnumSet.noneOf(OrderStatusEnum.class)),
            Map.entry(CANCELLED, EnumSet.noneOf(OrderStatusEnum.class))
    );

    public boolean canTransitionTo(OrderStatusEnum next) {
        if (next == null) {
            return false;
        }
      
        Set<OrderStatusEnum> freeStatuses = EnumSet.of(
                READY_IN_STORE, DELIVERY_TO_STATION, DELIVERY_IN_PROGRESS,
                AVAILABLE_AT_COUNTER, DELIVERED, PROCESSING, SHIPPED, CONFIRMED
        );
        if (freeStatuses.contains(this) && freeStatuses.contains(next)) {
            return true;
        }
        return ALLOWED_TRANSITIONS.getOrDefault(this, EnumSet.noneOf(OrderStatusEnum.class)).contains(next);
    }
}