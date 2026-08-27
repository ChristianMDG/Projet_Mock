package mg.taxibrousse.services;

import mg.taxibrousse.entities.ReservationEntity;

/**
 * Service for sending guichet-related SMS notifications.
 * Notifies guichets when reservations are made for their routes.
 */
public interface IGuichetSmsService {

    /**
     * Sends SMS notification to guichet when a reservation is made.
     *
     * @param reservation The reservation that was made
     */
    void sendReservationNotification(ReservationEntity reservation);
}
