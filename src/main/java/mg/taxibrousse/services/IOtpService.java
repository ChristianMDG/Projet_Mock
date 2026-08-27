package mg.taxibrousse.services;

public interface IOtpService {

    void generateAndSendOtp(String phoneNumber);

    boolean verifyOtp(String phoneNumber, String otp);
}
