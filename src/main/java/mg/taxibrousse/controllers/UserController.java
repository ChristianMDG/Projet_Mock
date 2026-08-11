package mg.taxibrousse.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.dto.PasswordResetRequest;
import mg.taxibrousse.entities.enums.AuthorityEnum;
import mg.taxibrousse.entities.enums.LanguagePreferenceEnum;
import mg.taxibrousse.models.UserInfo;
import mg.taxibrousse.models.UserOperator;
import mg.taxibrousse.models.UserToken;
import mg.taxibrousse.models.Voyageur;
import mg.taxibrousse.services.IOperatorService;
import mg.taxibrousse.services.ITokenBlacklistService;
import mg.taxibrousse.services.IUserService;
import mg.taxibrousse.services.IVoyageurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final JwtEncoder encoder;
    private final IVoyageurService voyageurService;
    private final IOperatorService operatorService;
    private final ITokenBlacklistService tokenBlacklistService;
    private final IUserService userService;

    @GetMapping("/current")
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserInfo> getCurrentUser(Authentication authentication) {
        try {
            String username = authentication.getName();
            Voyageur voyageur = voyageurService.findByPhoneOrIdNumber(username, username);
            if (voyageur != null) {
                return ResponseEntity.ok(voyageur);
            }
            
            UserOperator operator = operatorService.findByUsername(username);
            if (operator != null) {
                return ResponseEntity.ok(operator);
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(value = "/")
    public String index() {
        return "";
    }

    @Transactional(readOnly = true)
    @PostMapping(value = "/token", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserToken> token(Authentication authentication, @RequestBody(required = false) Map<String, String> requestBody) {
        var now = Instant.now();
        var expiry = 7889152L; // ~91 days
        var scope = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        // Generate unique JWT ID for token tracking and invalidation
        var jti = UUID.randomUUID().toString();
        var claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(authentication.getName())
                .claim("scope", scope)
                .claim("jti", jti) // Add JWT ID for token invalidation
                .build();

        var token = this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        String username = authentication.getName();
        Voyageur voyageur = voyageurService.findByPhoneOrIdNumber(username, username);
        if (voyageur != null) {
            return ResponseEntity.ok(new UserToken(token, voyageur));
        }
        
        UserOperator operator = operatorService.findByUsername(username);
        if (operator != null) {
            return ResponseEntity.ok(new UserToken(token, operator));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    /**
     * Logout endpoint - invalidates the current JWT token. Token is added to
     * Redis blacklist with TTL matching token expiration.
     *
     * @param authHeader Authorization header containing Bearer token
     * @return Success message
     */
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        long remainingTtl = 7889152L;
        tokenBlacklistService.blacklistToken(token, remainingTtl);
        return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully",
                "status", "success"
        ));
    }

    @PostMapping("/account")
    @Transactional
    public ResponseEntity<Voyageur> createUserInfo(@Valid @RequestBody Voyageur model) {
        return ResponseEntity.ok(voyageurService.saveVoyageurAccount(model));
    }

    @PutMapping("/account/{id}")
    public ResponseEntity<Voyageur> updateUserAccount(@PathVariable Long id, @Valid @RequestBody Voyageur model) {
        model.setId(id);
        return ResponseEntity.ok(voyageurService.saveVoyageurAccount(model));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody PasswordResetRequest request) {
        String phone = request.getPhone();
        String result = userService.forgotPassword(phone);
        if (result.startsWith("error_")) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        String phone = request.getPhone();
        String otp = request.getOtp();
        String newPassword = request.getNewPassword();
        
        String result = userService.resetPassword(phone, otp, newPassword);
        if (result.startsWith("error_")) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @RequestBody PasswordResetRequest request) {
        String result = userService.changePassword(
                authentication.getName(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        if (result.startsWith("error_")) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/operators/{id}")
    public ResponseEntity<UserOperator> getOperatorById(@PathVariable Long id) {
        UserOperator operator = operatorService.findById(id);
        if (operator != null) {
            return ResponseEntity.ok(operator);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/operators/koperative/{koperativeId}")
    public List<UserOperator> getOperatorsByKoperative(@PathVariable Long koperativeId) {
        return operatorService.findByKoperativeId(koperativeId);
    }

    @PostMapping("/operators")
    public ResponseEntity<String> createOperator(@Valid @RequestBody UserOperator operator) {
        return ResponseEntity.ok(operatorService.saveOperatorAccount(operator, AuthorityEnum.GUICHET));
    }

    @PutMapping("/operators/{id}")
    public ResponseEntity<String> updateOperator(@PathVariable Long id, @Valid @RequestBody UserOperator operator) {
        operator.setId(id);
        return ResponseEntity.ok(operatorService.saveOperatorAccount(operator, AuthorityEnum.GUICHET));
    }

    @DeleteMapping("/operators/{id}")
    public ResponseEntity<Void> deleteOperator(@PathVariable Long id) {
        operatorService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update the language preference for the authenticated user.
     * This endpoint allows users to persist their language choice.
     */
    @PutMapping("/language-preference")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<Map<String, String>> updateLanguagePreference(
            Authentication authentication,
            @RequestBody Map<String, String> request) {
        
        var language = request.get("language");
        if (language == null || language.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Language is required"));
        }

        try {
            var preference = LanguagePreferenceEnum.valueOf(language.toUpperCase());
            var result = userService.updateLanguagePreference(authentication.getName(), preference);
            
            return result.startsWith("error_") 
                ? ResponseEntity.badRequest().body(Map.of("error", result))
                : ResponseEntity.ok(Map.of("message", result, "language", preference.name()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid language. Use: FR, EN, or MG"));
        }
    }

    @GetMapping("/operators")
    public List<UserOperator> searchUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long koperativeId,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Long gareId) {
        return operatorService.searchOperators(search, koperativeId, isActive, gareId);
    }
}
