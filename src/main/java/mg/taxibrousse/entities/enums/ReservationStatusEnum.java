package mg.taxibrousse.entities.enums;

import java.util.Set;

public enum ReservationStatusEnum {
    PENDING_PAYMENT,
    CONFIRMED,
    CANCELLED_BY_USER,
    CANCELLED_BY_OPERATOR,
    COMPLETED,
    NO_SHOW;
    
    private static final Set<ReservationStatusEnum> CANCELLATION_STATUSES = Set.of(
        CANCELLED_BY_USER,
        CANCELLED_BY_OPERATOR
    );
    
    /**
     * Checks if this status represents a cancelled reservation
     * @return true if the status is a cancellation status
     */
    public boolean isCancelled() {
        return CANCELLATION_STATUSES.contains(this);
    }
    
    /**
     * Checks if this status is a valid cancellation status
     * @return true if this status can be used for cancelling reservations
     */
    public boolean isValidCancellationStatus() {
        return CANCELLATION_STATUSES.contains(this);
    }
    
    /**
     * Gets all possible cancellation statuses
     * @return Set of cancellation statuses
     */
    public static Set<ReservationStatusEnum> getCancellationStatuses() {
        return CANCELLATION_STATUSES;
    }
}
