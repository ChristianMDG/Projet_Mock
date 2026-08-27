package mg.taxibrousse.entities.enums;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public enum RentalReservationStatusEnum {

    PENDING, CONFIRMED, PAYMENT_FAILED, CANCELLED;

    private static final Map<RentalReservationStatusEnum, Set<RentalReservationStatusEnum>> ALLOWED_TRANSITIONS = Map.of(PENDING,
            EnumSet.of(CONFIRMED, PAYMENT_FAILED, CANCELLED),
            CONFIRMED,
            EnumSet.of(CANCELLED),
            PAYMENT_FAILED,
            EnumSet.of(PENDING, CANCELLED),
            CANCELLED,
            EnumSet.noneOf(RentalReservationStatusEnum.class));

    public boolean canTransitionTo(RentalReservationStatusEnum next) {
        return ALLOWED_TRANSITIONS.getOrDefault(this, EnumSet.noneOf(RentalReservationStatusEnum.class)).contains(next);
    }
}
