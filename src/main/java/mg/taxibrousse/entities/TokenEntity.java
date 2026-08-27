package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity for tracking active JWT tokens. Provides audit trail and enables bulk
 * token invalidation.
 *
 * Note: This is primarily for audit/analytics. The Redis blacklist handles
 * actual token validation for performance at scale.
 */
@Entity
@Table(name = "token", indexes = {@Index(name = "idx_jti", columnList = "jti"), @Index(name = "idx_username", columnList = "username"), @Index(name = "idx_expires_at", columnList = "expiresAt")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * JWT ID (jti claim) - unique identifier for each token
     */
    @Column(nullable = false, unique = true, length = 36)
    private String jti;

    /**
     * Username associated with this token
     */
    @Column(nullable = false, length = 100)
    private String username;

    /**
     * When the token was issued
     */
    @Column(nullable = false)
    private LocalDateTime issuedAt;

    /**
     * When the token expires
     */
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    /**
     * IP address from which token was requested (for audit)
     */
    @Column(length = 45) // IPv6 max length
    private String ipAddress;

    /**
     * User agent string (for audit)
     */
    @Column(length = 500)
    private String userAgent;

    /**
     * Whether token has been invalidated
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean revoked = false;

    /**
     * When token was revoked (null if not revoked)
     */
    private LocalDateTime revokedAt;
}
