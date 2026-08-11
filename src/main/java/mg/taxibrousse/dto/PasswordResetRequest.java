package mg.taxibrousse.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetRequest {
    private String otp;
    private String phone;
    private String newPassword;
    private String currentPassword;
}
