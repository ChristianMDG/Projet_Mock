package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.models.FacebookOAuthUser;
import mg.taxibrousse.models.UserToken;
import mg.taxibrousse.services.IFacebookOAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth/facebook")
@RequiredArgsConstructor
public class FacebookAuthController {

    private final IFacebookOAuthService facebookOAuthService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${spring.security.oauth2.client.registration.facebook.client-id}")
    private String facebookClientId;

    /**
     * Initiate Facebook OAuth login
     * Redirects user to Facebook's authorization page
     */
    @GetMapping("/login")
    public ResponseEntity<Void> facebookLogin() {
        String authorizationUrl = facebookOAuthService.getFacebookAuthorizationUrl();
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(authorizationUrl))
                .build();
    }

    /**
     * Handle Facebook OAuth callback
     * This endpoint receives the authorization code from Facebook
     */
    @GetMapping("/callback")
    public ResponseEntity<Void> facebookCallback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String error,
            @RequestParam(required = false, name = "error_description") String errorDescription
    ) {
        if (error != null) {
            log.error("Facebook OAuth error: {} - {}", error, errorDescription);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(frontendUrl + "/login?error=" + error))
                    .build();
        }

        if (code == null || code.isEmpty()) {
            log.error("No authorization code received from Facebook");
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(frontendUrl + "/login?error=no_code"))
                    .build();
        }

        // Redirect to frontend with code
        // Frontend will exchange code for access token
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(frontendUrl + "/auth/facebook/callback?code=" + code))
                .build();
    }

    /**
     * Verify Facebook access token and authenticate user
     * Frontend calls this endpoint with the access token from Facebook
     */
    @PostMapping("/verify")
    public ResponseEntity<UserToken> verifyFacebookToken(@RequestBody Map<String, String> request) {
        String accessToken = request.get("accessToken");

        if (accessToken == null || accessToken.isEmpty()) {
            log.warn("No access token provided in request");
            return ResponseEntity.badRequest().build();
        }

        try {
            // Verify Facebook token
            FacebookOAuthUser facebookUser = facebookOAuthService.verifyFacebookToken(accessToken);

            if (facebookUser == null) {
                log.warn("Invalid Facebook token or user data");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Authenticate user (login only, no registration)
            UserToken userToken = facebookOAuthService.authenticateFacebookUser(facebookUser);

            if (userToken == null) {
                log.warn("User not found in database for Facebook user: {}", facebookUser.getEmail());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.ok(userToken);
        } catch (Exception e) {
            log.error("Error verifying Facebook token", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get Facebook authorization URL and client ID
     */
    @GetMapping("/auth-url")
    public ResponseEntity<Map<String, String>> getAuthUrl() {
        String authUrl = facebookOAuthService.getFacebookAuthorizationUrl();
        return ResponseEntity.ok(Map.of(
                "authUrl", authUrl,
                "clientId", facebookClientId
        ));
    }
}