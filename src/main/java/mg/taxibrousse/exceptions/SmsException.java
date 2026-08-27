package mg.taxibrousse.exceptions;

/**
 * Thrown when an SMS cannot be sent via the Orange API.
 * Unchecked so callers are not forced to declare it, while still
 * carrying the original cause for debugging.
 */
public class SmsException extends RuntimeException {

    public SmsException(String message) {
        super(message);
    }

    public SmsException(String message, Throwable cause) {
        super(message, cause);
    }
}
