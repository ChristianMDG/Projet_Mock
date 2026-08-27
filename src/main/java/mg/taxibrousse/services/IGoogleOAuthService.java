package mg.taxibrousse.services;

import mg.taxibrousse.models.GoogleOAuthUser;
import mg.taxibrousse.models.UserToken;

public interface IGoogleOAuthService {

    GoogleOAuthUser verifyGoogleToken(String idToken);

    UserToken authenticateGoogleUser(GoogleOAuthUser googleUser);

    String getGoogleAuthorizationUrl();
}
