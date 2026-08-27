package mg.taxibrousse.exceptions;

import lombok.Getter;

@Getter
public class RentalConflictException extends RuntimeException {

    private final String errorCode;
    private final String messageKey;

    public RentalConflictException(String errorCode, String messageKey) {
        super(messageKey);
        this.errorCode = errorCode;
        this.messageKey = messageKey;
    }

    public RentalConflictException(String errorCode, String messageKey, Throwable cause) {
        super(messageKey, cause);
        this.errorCode = errorCode;
        this.messageKey = messageKey;
    }
}
