package mg.taxibrousse.exceptions;

public class PaymentTimeoutException extends PaymentException {

    public PaymentTimeoutException() {
        super("PAYMENT_TIMEOUT", "exception_payment_timeout");
    }

    public PaymentTimeoutException(String messageKey) {
        super("PAYMENT_TIMEOUT", messageKey);
    }
}
