package mg.taxibrousse.exceptions;

import lombok.Getter;

@Getter
public class OTPVerificationException extends PaymentException {
    
    private final int attemptCount;

    public OTPVerificationException(int attemptCount) {
        super("OTP_VERIFICATION_FAILED", "exception_otp_verification_failed");
        this.attemptCount = attemptCount;
    }

    public OTPVerificationException(int attemptCount, String messageKey) {
        super("OTP_VERIFICATION_FAILED", messageKey);
        this.attemptCount = attemptCount;
    }
}
