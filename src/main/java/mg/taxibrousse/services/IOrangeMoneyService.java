package mg.taxibrousse.services;

public interface IOrangeMoneyService extends IPaymentService {

    /**
     * Handle callback notification from Orange Money
     */
    void handleCallback(String orderId, String status, String notifToken);
}
