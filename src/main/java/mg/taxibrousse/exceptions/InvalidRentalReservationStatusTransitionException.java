package mg.taxibrousse.exceptions;

import lombok.Getter;

@Getter
public class InvalidRentalReservationStatusTransitionException extends RuntimeException {

    private final String errorCode = "error_invalid_rental_reservation_status_transition";

    public InvalidRentalReservationStatusTransitionException(String message) {
        super(message);
    }
}
