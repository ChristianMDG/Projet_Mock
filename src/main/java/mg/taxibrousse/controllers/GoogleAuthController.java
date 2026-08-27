package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.models.GoogleOAuthUser;
import mg.taxibrousse.models.UserToken;
import mg.taxibrousse.services.IGoogleOAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.text.MessageFormat;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth/google")
@RequiredArgsConstructor
public class GoogleAuthController {

    private final IGoogleOAuthService googleOAuthService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    /**
     * Initiate Google OAuth login
     * Redirects user to Google's authorization page
     */
    @GetMapping("/login")
    public ResponseEntity<Void> googleLogin() {
        String authorizationUrl = googleOAuthService.getGoogleAuthorizationUrl();
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(authorizationUrl)).build();
    }

    /**
     * Handle Google OAuth callback
     * This endpoint receives the authorization code from Google
     */
    @GetMapping("/callback")
    public ResponseEntity<Void> googleCallback(@RequestParam(required = false) String code, @RequestParam(required = false) String error) {
        if (error != null) {
            log.error("Google OAuth error: {}", error);
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(MessageFormat.format("{0}/login?error={1}", frontendUrl, error))).build();
        }

        // Redirect to frontend with code
        // Frontend will exchange code for token
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(MessageFormat.format("{0}/auth/google/callback?code={1}", frontendUrl, code))).build();
    }

    /**
     * Verify Google ID token and authenticate user
     * Frontend calls this endpoint with the ID token from Google
     */
    @PostMapping("/verify")
    public ResponseEntity<UserToken> verifyGoogleToken(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");

        if (StringUtils.hasText(idToken)) {
            try {
                // Verify Google token
                GoogleOAuthUser googleUser = googleOAuthService.verifyGoogleToken(idToken);

                if (googleUser == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }

                // Authenticate or create user
                UserToken userToken = googleOAuthService.authenticateGoogleUser(googleUser);

                if (userToken == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }

                return ResponseEntity.ok(userToken);
            } catch (Exception e) {
                log.error("Error verifying Google token", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * Get Google authorization URL
     */
    @GetMapping("/auth-url")
    public ResponseEntity<Map<String, String>> getAuthUrl() {
        String authUrl = googleOAuthService.getGoogleAuthorizationUrl();
        return ResponseEntity.ok(Map.of("authUrl", authUrl, "clientId", googleClientId));
    }

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;
}
