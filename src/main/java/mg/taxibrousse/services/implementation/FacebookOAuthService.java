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
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;

import java.time.Instant;
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

    @Value("${spring.security.oauth2.client.provider.facebook.token-uri:https://graph.facebook.com/v25.0/oauth/access_token}")
    private String tokenUri;

    private static final String FACEBOOK_GRAPH_API_URL = "https://graph.facebook.com/v25.0/me";
    private static final String FACEBOOK_FIELDS = "id,email,name,first_name,last_name,picture.type(large)";
    private static final String PICTURE_LITERAL = "picture";
    private static final String EMAIL_LITERAL = "email";

    @Override
    public FacebookOAuthUser verifyFacebookToken(String accessToken) {
        try {
            String url = String.format("%s?fields=%s&access_token=%s", FACEBOOK_GRAPH_API_URL, FACEBOOK_FIELDS, accessToken);

            log.debug("Calling Facebook Graph API to verify token");
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);

            if (response == null || !response.has("id")) {
                log.warn("Facebook API response missing 'id' field");
                return null;
            }

            FacebookOAuthUser user = mapToFacebookOAuthUser(response);
            log.info("Successfully verified Facebook token for user: {}", user.getId());
            return user;
        } catch (HttpClientErrorException e) {
            handleHttpClientError(e);
        } catch (Exception e) {
            log.error("Unexpected error verifying Facebook token", e);
        }
        return null;
    }

    private FacebookOAuthUser mapToFacebookOAuthUser(JsonNode response) {
        FacebookOAuthUser user = new FacebookOAuthUser();
        user.setId(getNodeText(response, "id"));
        user.setEmail(getNodeText(response, EMAIL_LITERAL));
        user.setName(getNodeText(response, "name"));
        user.setFirstName(getNodeText(response, "first_name"));
        user.setLastName(getNodeText(response, "last_name"));
        user.setPhone(getNodeText(response, "phone"));
        user.setPicture(extractPictureUrl(response));
        return user;
    }

    private String getNodeText(JsonNode node, String fieldName) {
        return node.has(fieldName) ? node.get(fieldName).asText() : null;
    }

    private String extractPictureUrl(JsonNode response) {
        if (!response.has(PICTURE_LITERAL))
            return null;
        JsonNode picture = response.get(PICTURE_LITERAL);
        if (!picture.has("data"))
            return null;
        JsonNode data = picture.get("data");
        return getNodeText(data, "url");
    }

    private void handleHttpClientError(HttpClientErrorException e) {
        if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
            log.error("Invalid Facebook access token: {}", e.getMessage());
        } else {
            log.error("Error calling Facebook Graph API: {} - {}", e.getStatusCode(), e.getMessage());
        }
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
        if (StringUtils.hasText(facebookUser.getEmail())) {
            var userOptByEmail = userOperatorRepository.findByEmail(facebookUser.getEmail());
            if (userOptByEmail.isPresent()) {
                user = userOptByEmail.get();
                log.info("User found by email: {}", facebookUser.getEmail());
            }
        }

        // If not found by email, try phone
        if (user == null && StringUtils.hasText(facebookUser.getPhone())) {
            var userOptByPhone = userOperatorRepository.findByPhone(facebookUser.getPhone());
            if (userOptByPhone.isPresent()) {
                user = userOptByPhone.get();
                log.info("User found by phone: {}", facebookUser.getPhone());
            }
        }

        // If user not found, return null (login fails - no registration)
        if (user == null) {
            log.warn("User not found with email: {} or phone: {}", facebookUser.getEmail(), facebookUser.getPhone());
            return null;
        }

        // Check if user account is active
        if (user.isEnabled()) {
            // Generate JWT token
            String token = generateJwtToken(user);
            // Convert to UserOperator model
            UserOperator userInfo = UserOperator.fromEntity(user, true);

            log.info("Successfully authenticated Facebook user: {}", user.getUsername());
            return new UserToken(token, userInfo);
        }

        log.warn("User account is disabled: {}", user.getUsername());
        return null;
    }

    @Override
    public String getFacebookAuthorizationUrl() {
        String state = UUID.randomUUID().toString();
        String authUrl = String.format("https://www.facebook.com/v18.0/dialog/oauth?" + "client_id=%s&" + "redirect_uri=%s&" + "scope=email,public_profile&" + "state=%s&" + "response_type=code",
                facebookClientId,
                redirectUri,
                state);
        log.debug("Generated Facebook authorization URL with state: {}", state);
        return authUrl;
    }

    /**
     * Generate JWT token for authenticated user
     */
    private String generateJwtToken(UserOperatorEntity user) {
        Instant now = Instant.now();
        long expiry = 7889152L; // ~3 months in seconds

        String scope = user.getAuthorities().stream().map(auth -> auth.getName()).collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(user.getUsername())
                .claim("scope", scope)
                .claim("userId", user.getId())
                .claim(EMAIL_LITERAL, user.getEmail())
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        log.debug("Generated JWT token for user: {}", user.getUsername());
        return token;
    }
}
