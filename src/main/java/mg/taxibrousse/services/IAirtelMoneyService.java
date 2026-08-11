package mg.taxibrousse.services;

public interface IAirtelMoneyService extends IPaymentService {

    void handleCallback(String transactionId, String status, String operatorResponse);
}
