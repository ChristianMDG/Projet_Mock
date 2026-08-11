package mg.taxibrousse.services.implementation;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.VoyageurEntity;
import mg.taxibrousse.entities.enums.AuthorityEnum;
import mg.taxibrousse.models.GoogleOAuthUser;
import mg.taxibrousse.models.UserToken;
import mg.taxibrousse.models.Voyageur;
import mg.taxibrousse.repositories.IAuthorityRepository;
import mg.taxibrousse.repositories.IVoyageurRepository;
import mg.taxibrousse.services.IGoogleOAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleOAuthService implements IGoogleOAuthService {

    private final IVoyageurRepository voyageurRepository;
    private final IAuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    @Override
    public GoogleOAuthUser verifyGoogleToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken token = verifier.verify(idToken);
            if (token != null) {
                GoogleIdToken.Payload payload = token.getPayload();

                GoogleOAuthUser user = new GoogleOAuthUser();
                user.setSub(payload.getSubject());
                user.setEmail(payload.getEmail());
                user.setEmailVerified(payload.getEmailVerified());
                user.setName((String) payload.get("name"));
                user.setGivenName((String) payload.get("given_name"));
                user.setFamilyName((String) payload.get("family_name"));
                user.setPicture((String) payload.get("picture"));
                user.setLocale((String) payload.get("locale"));

                return user;
            }
        } catch (Exception e) {
            log.error("Error verifying Google token", e);
        }
        return null;
    }

    @Override
    @Transactional
    public UserToken authenticateGoogleUser(GoogleOAuthUser googleUser) {
        if (googleUser == null || googleUser.getEmail() == null) {
            return null;
        }

        // Check if user exists by email
        var userOpt = voyageurRepository.findByEmail(googleUser.getEmail());

        VoyageurEntity user;
        if (userOpt.isEmpty()) {
            // Create new user
            user = createNewGoogleUser(googleUser);
        } else {
            user = userOpt.get();
        }

        // Generate JWT token
        String token = generateJwtToken(user);

        // Convert to Voyageur model using the existing fromEntity method
        Voyageur userInfo = Voyageur.fromEntity(user, true);

        return new UserToken(token, userInfo);
    }

    @Override
    public String getGoogleAuthorizationUrl() {
        return String.format(
                "https://accounts.google.com/o/oauth2/v2/auth?" +
                        "client_id=%s&" +
                        "redirect_uri=%s&" +
                        "response_type=code&" +
                        "scope=openid email profile&" +
                        "access_type=offline&" +
                        "prompt=consent",
                googleClientId,
                redirectUri
        );
    }

    private VoyageurEntity createNewGoogleUser(GoogleOAuthUser googleUser) {
        VoyageurEntity user = new VoyageurEntity();

        // Set username as email
        user.setUsername(googleUser.getEmail());

        // Set email
        user.setEmail(googleUser.getEmail());

        // Set names if available
        if (googleUser.getGivenName() != null) {
            user.setFirstName(googleUser.getGivenName());
        }
        if (googleUser.getFamilyName() != null) {
            user.setLastName(googleUser.getFamilyName());
        }

        // Generate random password (user won't use it, only OAuth login)
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

        // Set as regular user (not admin)
        user.setAdmin(false);

        // Set as active
        user.setIsActive(true);

        // Generate a temporary ID number (required field)
        user.setIdNumber("GOOGLE_" + googleUser.getSub());

        // Assign USER authority
        var userAuthority = authorityRepository.findByNameIn(
                Collections.singletonList(AuthorityEnum.USER.getName())
        );
        user.setAuthorities(new HashSet<>(userAuthority));

        // Save user
        return voyageurRepository.save(user);
    }

    private String generateJwtToken(VoyageurEntity user) {
        var now = Instant.now();
        var expiry = 7889152L; // ~3 months (same as UserController)

        var scope = user.getAuthorities()
                .stream()
                .map(auth -> auth.getName())
                .collect(Collectors.joining(" "));

        var claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(user.getUsername())
                .claim("scope", scope)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}