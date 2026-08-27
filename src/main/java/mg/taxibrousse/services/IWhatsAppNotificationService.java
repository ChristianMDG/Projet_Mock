package mg.taxibrousse.services;

import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.OrderEntity;

/**
 * Service for sending WhatsApp notifications to customers
 * Uses WhatsApp Business Platform API
 */
public interface IWhatsAppNotificationService {

    /**
     * Send reservation confirmation via WhatsApp
     *
     * @param reservation the reservation entity
     * @return true if message sent successfully
     */
    boolean sendReservationConfirmation(ReservationEntity reservation);

    /**
     * Send reservation reminder (24h before departure)
     *
     * @param reservation the reservation entity
     * @return true if message sent successfully
     */
    boolean sendReservationReminder(ReservationEntity reservation);

    /**
     * Send reservation cancellation notice
     *
     * @param reservation the reservation entity
     * @return true if message sent successfully
     */
    boolean sendReservationCancellation(ReservationEntity reservation);

    /**
     * Send payment reminder
     *
     * @param phoneNumber customer phone number
     * @param amount payment amount
     * @param reference payment reference
     * @return true if message sent successfully
     */
    boolean sendPaymentReminder(String phoneNumber, Double amount, String reference);

    /**
     * Send payment confirmation
     *
     * @param phoneNumber customer phone number
     * @param amount payment amount
     * @param reference payment reference
     * @return true if message sent successfully
     */
    boolean sendPaymentConfirmation(String phoneNumber, Double amount, String reference);

    /**
     * Send order confirmation via WhatsApp
     *
     * @param order the order entity
     * @return true if message sent successfully
     */
    boolean sendOrderConfirmation(OrderEntity order);

    /**
     * Send order shipment notification
     *
     * @param order the order entity
     * @param trackingNumber tracking number
     * @return true if message sent successfully
     */
    boolean sendOrderShipmentNotification(OrderEntity order, String trackingNumber);

    /**
     * Send order delivery notification
     *
     * @param order the order entity
     * @return true if message sent successfully
     */
    boolean sendOrderDeliveryNotification(OrderEntity order);

    /**
     * Send departure location to customer
     *
     * @param phoneNumber customer phone number
     * @param gareName station name
     * @param latitude station latitude
     * @param longitude station longitude
     * @param address station address
     * @return true if message sent successfully
     */
    boolean sendDepartureLocation(String phoneNumber, String gareName, Double latitude, Double longitude, String address);

    /**
     * Send new chat message notification to admin asynchronously
     *
     * @param message the message entity
     */
    void sendNewChatMessageNotificationToAdmin(mg.taxibrousse.entities.MessageEntity message);
}
