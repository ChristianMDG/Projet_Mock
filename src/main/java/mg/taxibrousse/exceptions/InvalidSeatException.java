package mg.taxibrousse.exceptions;

public class InvalidSeatException extends RuntimeException {

    private final String resourceKey;

    public InvalidSeatException(String resourceKey) {
        super(resourceKey);
        this.resourceKey = resourceKey;
    }

    public InvalidSeatException(String resourceKey, String message) {
        super(message);
        this.resourceKey = resourceKey;
    }

    public String getResourceKey() {
        return resourceKey;
    }
}
