package mg.taxibrousse.entities.enums;

import java.util.EnumSet;
import java.util.Set;

public enum PaymentTransactionStatusEnum {
    INITIATED,
    PENDING_OTP,
    OTP_VERIFIED,
    PROCESSING,
    COMPLETED,
    FAILED,
    TIMEOUT,
    CANCELLED;

    private static final Set<PaymentTransactionStatusEnum> TERMINAL_STATUSES = 
        EnumSet.of(COMPLETED, FAILED, TIMEOUT, CANCELLED);

    public boolean isTerminal() {
        return TERMINAL_STATUSES.contains(this);
    }

    public boolean isNotTerminal() {
        return !TERMINAL_STATUSES.contains(this);
    }
}
