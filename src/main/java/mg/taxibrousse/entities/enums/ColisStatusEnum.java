package mg.taxibrousse.entities.enums;

public enum ColisStatusEnum {
    REGISTERED, // Initial state when the package is registered
    PENDING, // Waiting for pickup or processing
    IN_TRANSIT, // Package is on its way
    DELIVERED, // Package has been delivered to recipient
    RETURNED, // Package was returned to sender
    LOST, // Package is lost
    CANCELLED // Shipment was cancelled
}
