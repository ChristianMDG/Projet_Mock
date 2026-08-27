package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.UserInfoEntity;
import mg.taxibrousse.entities.UserOperatorEntity;
import mg.taxibrousse.entities.VoyageurEntity;
import mg.taxibrousse.entities.enums.LanguagePreferenceEnum;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.repositories.IUserOperatorRepository;
import mg.taxibrousse.repositories.IVoyageurRepository;
import mg.taxibrousse.services.IOtpService;
import mg.taxibrousse.services.IUserService;
import mg.taxibrousse.utils.PhoneUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final IOtpService otpService;
    private final IUserInfoRepository userInfoRepository;
    private final IUserOperatorRepository userRepository;
    private final IVoyageurRepository voyageurRepository;
    private final PasswordEncoder passwordEncoder;

    // Constants for error messages
    private static final String ERROR_INVALID_PHONE = "error_invalid_madagascar_phone";
    private static final String ERROR_INVALID_OTP = "error_invalid_otp";
    private static final String ERROR_USER_NOT_FOUND = "error_user_not_found";
    private static final String ERROR_INVALID_CURRENT_PASSWORD = "error_invalid_current_password";
    private static final String SUCCESS_PASSWORD_RESET = "success_password_reset";
    private static final String SUCCESS_PASSWORD_CHANGED = "success_password_changed";
    private static final String SUCCESS_LANGUAGE_UPDATED = "success_language_updated";
    private static final String MSG_PASSWORD_RESET_LINK = "msg_password_reset_link";

    @Override
    @Transactional(readOnly = true)
    public UserInfoEntity loadUserByUsername(String username) throws UsernameNotFoundException {
        return userInfoRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }

    @Override
    public void updateUser(UserDetails user) {
        switch (user) {
            case UserOperatorEntity userOperatorEntity -> userRepository.save(userOperatorEntity);
            case VoyageurEntity voyageurEntity -> voyageurRepository.save(voyageurEntity);
            default -> throw new IllegalArgumentException(user.getClass().getName() + "Unsupported user type: ");
        }
    }

    @Override
    public void deleteUser(String username) {
        UserInfoEntity user = userInfoRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));

        if (user instanceof UserOperatorEntity) {
            userRepository.deleteUserDetailsByUsername(username);
        } else if (user instanceof VoyageurEntity voyageurEntity) {
            voyageurRepository.delete(voyageurEntity);
        }
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        throw new UnsupportedOperationException("Use changePassword(username, currentPassword, newPassword) instead");
    }

    @Override
    @Transactional
    public String changePassword(String username, String currentPassword, String newPassword) {
        return userInfoRepository.findByUsername(username).map(user -> {
            if (passwordEncoder.matches(currentPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                updateUser(user);
                return SUCCESS_PASSWORD_CHANGED;
            }
            return ERROR_INVALID_CURRENT_PASSWORD;
        }).orElse(ERROR_USER_NOT_FOUND);
    }

    @Override
    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional
    public void createUser(UserDetails user) {
        switch (user) {
            case UserOperatorEntity userOperatorEntity -> userRepository.save(userOperatorEntity);
            case VoyageurEntity voyageurEntity -> voyageurRepository.save(voyageurEntity);
            default -> throw new IllegalArgumentException("Unsupported user type: " + user.getClass().getName());
        }
    }

    @Override
    public String forgotPassword(String phone) {
        if (phone == null || phone.isBlank())
            return "error_phone_required";

        String normalizedPhone = PhoneUtils.normalizePhone(phone);
        if (PhoneUtils.isValidMadagascarPhone(normalizedPhone)) {
            if (userInfoRepository.findByUsername(normalizedPhone).isPresent()) {
                otpService.generateAndSendOtp(normalizedPhone);
                return MSG_PASSWORD_RESET_LINK;
            }
            return ERROR_USER_NOT_FOUND;
        }
        return ERROR_INVALID_PHONE;
    }

    @Override
    @Transactional
    public String resetPassword(String phone, String otp, String newPassword) {
        String normalizedPhone = PhoneUtils.normalizePhone(phone);
        if (otpService.verifyOtp(normalizedPhone, otp)) {
            return userInfoRepository.findByUsername(normalizedPhone).map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                updateUser(user);
                return SUCCESS_PASSWORD_RESET;
            }).orElse(ERROR_USER_NOT_FOUND);
        }
        return ERROR_INVALID_OTP;
    }

    @Override
    @Transactional
    public String updateLanguagePreference(String username, LanguagePreferenceEnum language) {
        return userInfoRepository.findByUsername(username).map(user -> {
            user.setLanguagePreference(language);
            updateUser(user);
            return SUCCESS_LANGUAGE_UPDATED;
        }).orElse(ERROR_USER_NOT_FOUND);
    }
}
