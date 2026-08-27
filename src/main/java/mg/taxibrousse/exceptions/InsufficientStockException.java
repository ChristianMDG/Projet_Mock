package mg.taxibrousse.exceptions;

import lombok.Getter;

@Getter
public class InsufficientStockException extends RuntimeException {

    private final String errorCode = "error_insufficient_stock";
    private final String messageKey = "exception_insufficient_stock";

    public InsufficientStockException(String message) {
        super(message);
    }
}
