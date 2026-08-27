package mg.taxibrousse.services;

public interface ISmsService {

    void sendSms(String phoneNumber, String message);
}
