package mg.taxibrousse.exceptions;

public class ReservationNotFoundException extends RuntimeException {

    private final String resourceKey;

    public ReservationNotFoundException(String resourceKey) {
        super(resourceKey);
        this.resourceKey = resourceKey;
    }

    public ReservationNotFoundException(String resourceKey, String message) {
        super(message);
        this.resourceKey = resourceKey;
    }

    public String getResourceKey() {
        return resourceKey;
    }
}
