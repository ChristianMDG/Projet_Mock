package mg.taxibrousse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetRequest {

    @NotBlank
    private String otp;
    @NotBlank
    private String phone;
    private String newPassword;
    private String currentPassword;
}
