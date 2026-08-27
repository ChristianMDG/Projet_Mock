package mg.taxibrousse.exceptions;

public class LoyaltyException extends RuntimeException {

    private final String resourceKey;

    public LoyaltyException(String resourceKey) {
        super(resourceKey);
        this.resourceKey = resourceKey;
    }

    public LoyaltyException(String resourceKey, String message) {
        super(message);
        this.resourceKey = resourceKey;
    }

    public String getResourceKey() {
        return resourceKey;
    }
}
