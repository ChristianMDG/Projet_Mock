package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.TokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IActiveTokenRepository extends JpaRepository<TokenEntity, Long> {

    /**
     * Find active token by JWT ID
     */
    Optional<TokenEntity> findByJti(String jti);

    /**
     * Find all active (non-revoked) tokens for a user
     */
    @Query("SELECT t FROM TokenEntity t WHERE t.username = :username AND t.revoked = false AND t.expiresAt > :now")
    List<TokenEntity> findActiveTokensByUsername(@Param("username") String username, @Param("now") LocalDateTime now);

    /**
     * Find all tokens (active and revoked) for a user
     */
    List<TokenEntity> findByUsername(String username);

    /**
     * Revoke all active tokens for a user (e.g., on password change)
     */
    @Modifying
    @Query("UPDATE TokenEntity t SET t.revoked = true, t.revokedAt = :revokedAt WHERE t.username = :username AND t.revoked = false")
    int revokeAllUserTokens(@Param("username") String username, @Param("revokedAt") LocalDateTime revokedAt);

    /**
     * Revoke a specific token by JTI
     */
    @Modifying
    @Query("UPDATE TokenEntity t SET t.revoked = true, t.revokedAt = :revokedAt WHERE t.jti = :jti AND t.revoked = false")
    int revokeToken(@Param("jti") String jti, @Param("revokedAt") LocalDateTime revokedAt);

    /**
     * Delete expired tokens (cleanup job)
     */
    @Modifying
    @Query("DELETE FROM TokenEntity t WHERE t.expiresAt < :expirationTime")
    int deleteExpiredTokens(@Param("expirationTime") LocalDateTime expirationTime);

    /**
     * Count active tokens for a user
     */
    @Query("SELECT COUNT(t) FROM TokenEntity t WHERE t.username = :username AND t.revoked = false AND t.expiresAt > :now")
    long countActiveTokensByUsername(@Param("username") String username, @Param("now") LocalDateTime now);
}
