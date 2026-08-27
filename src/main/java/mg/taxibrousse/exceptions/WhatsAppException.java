package mg.taxibrousse.exceptions;

/**
 * Thrown when a WhatsApp message cannot be sent via the Cloud API.
 * Unchecked so callers are not forced to declare it, while still
 * carrying the original cause for debugging.
 */
public class WhatsAppException extends RuntimeException {

    public WhatsAppException(String message) {
        super(message);
    }

    public WhatsAppException(String message, Throwable cause) {
        super(message, cause);
    }
}
