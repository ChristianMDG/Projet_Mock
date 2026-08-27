package mg.taxibrousse.services;

import mg.taxibrousse.dto.payment.PaymentNotification;

public interface IPaymentNotificationService {

    String PAYMENT_TOPIC_PREFIX = "/topic/payment/";
    String USER_PAYMENT_QUEUE_PREFIX = "/queue/payment/";

    /**
     * Send payment notification to a specific room
     *
     * @param roomId Room ID to send notification to
     * @param notification Payment notification details
     */
    void sendPaymentNotification(String roomId, PaymentNotification notification);

    /**
     * Broadcast payment status update to payment room
     *
     * @param transactionReference Transaction reference
     * @param notification Payment notification details
     */
    void broadcastPaymentUpdate(String transactionReference, PaymentNotification notification);

    /**
     * Notify a specific subscriber about the latest payment status when they subscribe to a topic
     *
     * @param roomId Room identifier (e.g. transaction reference)
     * @param transactionReference Transaction reference to fetch status for
     */
    void notifySubscriber(String roomId, String transactionReference);
}
