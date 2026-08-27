package mg.taxibrousse.exceptions;

import lombok.Getter;

@Getter
public class ShopException extends RuntimeException {

    private final String errorCode;
    private final String messageKey;

    public ShopException(String errorCode, String messageKey) {
        super(messageKey);
        this.errorCode = errorCode;
        this.messageKey = messageKey;
    }

    public ShopException(String errorCode, String messageKey, String message) {
        super(message);
        this.errorCode = errorCode;
        this.messageKey = messageKey;
    }
}
