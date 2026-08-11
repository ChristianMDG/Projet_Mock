package mg.taxibrousse.services;

import mg.taxibrousse.entities.enums.LanguagePreferenceEnum;
import org.springframework.security.provisioning.UserDetailsManager;

public interface IUserService extends UserDetailsManager {
    String forgotPassword(String phone);
    String resetPassword(String phone, String otp, String newPassword);
    String changePassword(String username, String currentPassword, String newPassword);
    String updateLanguagePreference(String username, LanguagePreferenceEnum language);
}
