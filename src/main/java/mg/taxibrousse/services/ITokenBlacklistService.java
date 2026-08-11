package mg.taxibrousse.services;

/**
 * Service for managing JWT token blacklist using Redis. Optimized for
 * high-scale applications (100,000+ concurrent users).
 */
public interface ITokenBlacklistService {

    /**
     * Add a token to the blacklist with TTL matching token expiration
     *
     * @param token The JWT token string
     * @param expirationSeconds Time until token naturally expires
     */
    void blacklistToken(String token, long expirationSeconds);

    /**
     * Check if a token is blacklisted (invalidated)
     *
     * @param token The JWT token string
     * @return true if token is blacklisted, false otherwise
     */
    boolean isTokenBlacklisted(String token);

    /**
     * Blacklist all tokens for a specific user (e.g., on password change)
     *
     * @param username The username
     */
    void blacklistAllUserTokens(String username);

    /**
     * Remove a token from blacklist (rarely used, for testing)
     *
     * @param token The JWT token string
     */
    void removeFromBlacklist(String token);
}
