package mg.taxibrousse.services;

import mg.taxibrousse.entities.ReservationEntity;

/**
 * Service for sending reservation-related SMS notifications.
 * Messages are sent in the user's preferred language.
 */
public interface IReservationSmsService {

    /**
     * Sends a confirmation SMS after a reservation is confirmed/paid.
     *
     * @param reservation The confirmed reservation
     */
    void sendConfirmationSms(ReservationEntity reservation);
}
