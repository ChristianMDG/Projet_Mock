package mg.taxibrousse.entities.enums;

/**
 * Enum representing the status of a seat in a vehicle (crafter)
 */
public enum SeatStatusEnum {
    AVAILABLE, // Seat is available for booking
    RESERVED, // Seat is reserved/booked by a passenger
    BLOCKED, // Seat is temporarily blocked (maintenance, VIP, etc.)
    DAMAGED // Seat is damaged and unavailable
}
