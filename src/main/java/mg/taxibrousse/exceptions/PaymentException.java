package mg.taxibrousse.exceptions;

import lombok.Getter;

@Getter
public class PaymentException extends RuntimeException {

    private final String errorCode;
    private final String messageKey;

    public PaymentException(String errorCode, String messageKey) {
        super(messageKey);
        this.errorCode = errorCode;
        this.messageKey = messageKey;
    }

    public PaymentException(String errorCode, String messageKey, Throwable cause) {
        super(messageKey, cause);
        this.errorCode = errorCode;
        this.messageKey = messageKey;
    }
}
