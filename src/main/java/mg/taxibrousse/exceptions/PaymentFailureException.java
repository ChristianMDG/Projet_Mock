package mg.taxibrousse.exceptions;

/**
 * Exception thrown when marking a payment as failed encounters an error.
 *
 * <p>
 * Common scenarios:
 * <ul>
 * <li>Transaction already in terminal state</li>
 * <li>Invalid transaction reference</li>
 * <li>Order status update failure</li>
 * <li>Database constraint violation</li>
 * </ul>
 */
public class PaymentFailureException extends PaymentException {

    public PaymentFailureException(String errorCode, String messageKey) {
        super(errorCode, messageKey);
    }

    public PaymentFailureException(String errorCode, String messageKey, Throwable cause) {
        super(errorCode, messageKey, cause);
    }
}
