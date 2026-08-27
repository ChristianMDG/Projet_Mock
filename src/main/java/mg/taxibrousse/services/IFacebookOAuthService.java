package mg.taxibrousse.services;

import mg.taxibrousse.models.FacebookOAuthUser;
import mg.taxibrousse.models.UserToken;

public interface IFacebookOAuthService {

    FacebookOAuthUser verifyFacebookToken(String accessToken);

    UserToken authenticateFacebookUser(FacebookOAuthUser facebookUser);

    String getFacebookAuthorizationUrl();
}
