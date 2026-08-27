package mg.taxibrousse.exceptions;

import lombok.Getter;

@Getter
public class InvalidOrderStatusTransitionException extends RuntimeException {

    private final String errorCode = "error_invalid_order_status_transition";
    private final String messageKey = "exception_invalid_order_status_transition";

    public InvalidOrderStatusTransitionException(String message) {
        super(message);
    }
}
