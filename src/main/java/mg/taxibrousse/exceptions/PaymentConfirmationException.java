package mg.taxibrousse.exceptions;

/**
 * Exception thrown when payment confirmation fails.
 *
 * <p>
 * Common scenarios:
 * <ul>
 * <li>Transaction already confirmed</li>
 * <li>Transaction in terminal state (failed/cancelled)</li>
 * <li>Order status transition validation failure</li>
 * <li>Database constraint violation</li>
 * </ul>
 */
public class PaymentConfirmationException extends PaymentException {

    public PaymentConfirmationException(String errorCode, String messageKey) {
        super(errorCode, messageKey);
    }

    public PaymentConfirmationException(String errorCode, String messageKey, Throwable cause) {
        super(errorCode, messageKey, cause);
    }
}
