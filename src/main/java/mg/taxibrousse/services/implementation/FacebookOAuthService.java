package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.UserOperatorEntity;
import mg.taxibrousse.models.FacebookOAuthUser;
import mg.taxibrousse.models.UserOperator;
import mg.taxibrousse.models.UserToken;
import mg.taxibrousse.repositories.IUserOperatorRepository;
import mg.taxibrousse.services.IFacebookOAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FacebookOAuthService implements IFacebookOAuthService {

    private final IUserOperatorRepository userOperatorRepository;
    private final JwtEncoder jwtEncoder;
    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.facebook.client-id}")
    private String facebookClientId;

    @Value("${spring.security.oauth2.client.registration.facebook.client-secret}")
    private String facebookClientSecret;

    @Value("${spring.security.oauth2.client.registration.facebook.redirect-uri}")
    private String redirectUri;

    @Value("${spring.security.oauth2.client.provider.facebook.token-uri:https://graph.facebook.com/v18.0/oauth/access_token}")
    private String tokenUri;

    private static final String FACEBOOK_GRAPH_API_URL = "https://graph.facebook.com/v18.0/me";
    private static final String FACEBOOK_FIELDS = "id,email,name,first_name,last_name,picture.type(large)";

    @Override
    public FacebookOAuthUser verifyFacebookToken(String accessToken) {
        try {
            String url = String.format(
                    "%s?fields=%s&access_token=%s",
                    FACEBOOK_GRAPH_API_URL,
                    FACEBOOK_FIELDS,
                    accessToken
            );

            log.debug("Calling Facebook Graph API to verify token");
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("id")) {
                FacebookOAuthUser user = new FacebookOAuthUser();
                user.setId((String) response.get("id"));
                user.setEmail((String) response.get("email"));
                user.setName((String) response.get("name"));
                user.setFirstName((String) response.get("first_name"));
                user.setLastName((String) response.get("last_name"));
                user.setPhone((String) response.get("phone"));

                // Extract picture URL if available
                if (response.containsKey("picture") && response.get("picture") instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> pictureData = (Map<String, Object>) response.get("picture");
                    if (pictureData.containsKey("data") && pictureData.get("data") instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> data = (Map<String, Object>) pictureData.get("data");
                        user.setPicture((String) data.get("url"));
                    }
                }

                log.info("Successfully verified Facebook token for user: {}", user.getId());
                return user;
            } else {
                log.warn("Facebook API response missing 'id' field");
            }
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                log.error("Invalid Facebook access token: {}", e.getMessage());
            } else {
                log.error("Error calling Facebook Graph API: {} - {}", e.getStatusCode(), e.getMessage());
            }
        } catch (Exception e) {
            log.error("Unexpected error verifying Facebook token", e);
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public UserToken authenticateFacebookUser(FacebookOAuthUser facebookUser) {
        if (facebookUser == null) {
            log.warn("FacebookOAuthUser is null");
            return null;
        }

        UserOperatorEntity user = null;

        // Try to find by email first
        if (facebookUser.getEmail() != null && !facebookUser.getEmail().isEmpty()) {
            var userOptByEmail = userOperatorRepository.findByEmail(facebookUser.getEmail());
            if (userOptByEmail.isPresent()) {
                user = userOptByEmail.get();
                log.info("User found by email: {}", facebookUser.getEmail());
            }
        }

        // If not found by email, try phone
        if (user == null && facebookUser.getPhone() != null && !facebookUser.getPhone().isEmpty()) {
            var userOptByPhone = userOperatorRepository.findByPhone(facebookUser.getPhone());
            if (userOptByPhone.isPresent()) {
                user = userOptByPhone.get();
                log.info("User found by phone: {}", facebookUser.getPhone());
            }
        }

        // If user not found, return null (login fails - no registration)
        if (user == null) {
            log.warn("User not found with email: {} or phone: {}",
                    facebookUser.getEmail(), facebookUser.getPhone());
            return null;
        }

        // Check if user account is active
        if (!user.isEnabled()) {
            log.warn("User account is disabled: {}", user.getUsername());
            return null;
        }

        // Generate JWT token
        String token = generateJwtToken(user);

        // Convert to UserOperator model
        UserOperator userInfo = UserOperator.fromEntity(user, true);

        log.info("Successfully authenticated Facebook user: {}", user.getUsername());
        return new UserToken(token, userInfo);
    }

    @Override
    public String getFacebookAuthorizationUrl() {
        String state = UUID.randomUUID().toString();
        String authUrl = String.format(
                "https://www.facebook.com/v18.0/dialog/oauth?" +
                        "client_id=%s&" +
                        "redirect_uri=%s&" +
                        "scope=email,public_profile&" +
                        "state=%s&" +
                        "response_type=code",
                facebookClientId,
                redirectUri,
                state
        );
        log.debug("Generated Facebook authorization URL with state: {}", state);
        return authUrl;
    }

    /**
     * Generate JWT token for authenticated user
     */
    private String generateJwtToken(UserOperatorEntity user) {
        Instant now = Instant.now();
        long expiry = 7889152L; // ~3 months in seconds

        String scope = user.getAuthorities()
                .stream()
                .map(auth -> auth.getName())
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(user.getUsername())
                .claim("scope", scope)
                .claim("userId", user.getId())
                .claim("email", user.getEmail())
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        log.debug("Generated JWT token for user: {}", user.getUsername());
        return token;
    }
}