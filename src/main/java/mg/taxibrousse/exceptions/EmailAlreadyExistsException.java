package mg.taxibrousse.exceptions;

public class EmailAlreadyExistsException extends RuntimeException {

    private final String resourceKey;

    public EmailAlreadyExistsException(String resourceKey) {
        super(resourceKey);
        this.resourceKey = resourceKey;
    }

    public EmailAlreadyExistsException(String resourceKey, String message) {
        super(message);
        this.resourceKey = resourceKey;
    }

    public String getResourceKey() {
        return resourceKey;
    }
}
