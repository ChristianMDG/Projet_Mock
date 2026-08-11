package mg.taxibrousse.services;

public interface IMVolaService extends IPaymentService {

    void handleCallback(String serverCorrelationId, String status, String operatorResponse);
}
