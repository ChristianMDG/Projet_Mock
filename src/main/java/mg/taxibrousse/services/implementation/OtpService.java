package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.services.IOtpService;
import mg.taxibrousse.services.ISmsService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService implements IOtpService {

    private final StringRedisTemplate redisTemplate;
    private final ISmsService smsService;
    private static final String OTP_PREFIX = "otp:";
    private static final long OTP_EXPIRATION_MINUTES = 5;

    @Override
    public void generateAndSendOtp(String phoneNumber) {
        String otp = generateOtp();
        redisTemplate.opsForValue().set(OTP_PREFIX + phoneNumber, otp, OTP_EXPIRATION_MINUTES, TimeUnit.MINUTES);
        String message = String.format("Taxibrousse - Kaody fanamarinana: %s. Lany ao anatin'ny %d minitra.", otp, OTP_EXPIRATION_MINUTES);
        smsService.sendSms(phoneNumber, message);
    }

    @Override
    public boolean verifyOtp(String phoneNumber, String otp) {
        String storedOtp = redisTemplate.opsForValue().get(OTP_PREFIX + phoneNumber);
        if (storedOtp != null && storedOtp.equals(otp)) {
            redisTemplate.delete(OTP_PREFIX + phoneNumber);
            return true;
        }
        return false;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
