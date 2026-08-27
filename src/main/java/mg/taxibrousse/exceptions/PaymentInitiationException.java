package mg.taxibrousse.exceptions;

/**
 * Exception thrown when payment initiation fails.
 *
 * <p>
 * Common scenarios:
 * <ul>
 * <li>Invalid phone number format</li>
 * <li>Payment operator service unavailable</li>
 * <li>Network timeout during payment request</li>
 * <li>Invalid payment method for operator</li>
 * </ul>
 */
public class PaymentInitiationException extends PaymentException {

    public PaymentInitiationException(String errorCode, String messageKey) {
        super(errorCode, messageKey);
    }

    public PaymentInitiationException(String errorCode, String messageKey, Throwable cause) {
        super(errorCode, messageKey, cause);
    }
}
