package mg.taxibrousse.exceptions;

public class InvalidPaymentException extends RuntimeException {

    private final String resourceKey;

    public InvalidPaymentException(String resourceKey) {
        super(resourceKey);
        this.resourceKey = resourceKey;
    }

    public InvalidPaymentException(String resourceKey, String message) {
        super(message);
        this.resourceKey = resourceKey;
    }

    public String getResourceKey() {
        return resourceKey;
    }
}
