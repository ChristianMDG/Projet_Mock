package mg.taxibrousse.exceptions;

/**
 * Exception thrown when payment status checking fails.
 *
 * <p>
 * Common scenarios:
 * <ul>
 * <li>Transaction reference not found</li>
 * <li>Payment operator API unavailable</li>
 * <li>Network timeout during status check</li>
 * <li>Invalid transaction state</li>
 * </ul>
 */
public class PaymentStatusCheckException extends PaymentException {

    public PaymentStatusCheckException(String errorCode, String messageKey) {
        super(errorCode, messageKey);
    }

    public PaymentStatusCheckException(String errorCode, String messageKey, Throwable cause) {
        super(errorCode, messageKey, cause);
    }
}
