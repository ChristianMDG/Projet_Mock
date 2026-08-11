package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.services.ITokenBlacklistService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Redis-based implementation for JWT token blacklist. Designed for high-scale
 * applications (100,000+ users).
 * <p>
 * Performance characteristics: - O(1) blacklist check via Redis GET - Automatic
 * cleanup via Redis TTL (no manual cleanup needed) - Memory efficient: only
 * stores invalidated tokens, not all active sessions - Scales horizontally with
 * Redis cluster
 */
@Service
@RequiredArgsConstructor
public class TokenBlacklistService implements ITokenBlacklistService {

    private static final String BLACKLIST_PREFIX = "jwt:blacklist:";
    private static final String USER_BLACKLIST_PREFIX = "jwt:user:blacklist:";

    private final StringRedisTemplate redisTemplate;

    @Override
    public void blacklistToken(String token, long expirationSeconds) {
        if (token == null || token.isEmpty()) {
            return;
        }
        redisTemplate.opsForValue().set(
            BLACKLIST_PREFIX + token,
            String.valueOf(System.currentTimeMillis()),
            expirationSeconds,
            TimeUnit.SECONDS
        );
    }

    @Override
    public boolean isTokenBlacklisted(String token) {
        return token != null && !token.isEmpty() && Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + token));
    }

    @Override
    public void blacklistAllUserTokens(String username) {
        if (username == null || username.isEmpty()) {
            return;
        }
        redisTemplate.opsForValue().set(
            USER_BLACKLIST_PREFIX + username,
            String.valueOf(System.currentTimeMillis()),
            7,
            TimeUnit.DAYS
        );
    }

    @Override
    public void removeFromBlacklist(String token) {
        if (token != null && !token.isEmpty()) {
            redisTemplate.delete(BLACKLIST_PREFIX + token);
        }
    }

    /**
     * Check if user has been globally blacklisted (e.g., password change)
     *
     * @param username      The username
     * @param tokenIssuedAt When the token was issued (epoch milliseconds)
     * @return true if user tokens issued before blacklist time
     */
    public boolean isUserBlacklisted(String username, long tokenIssuedAt) {
        if (username == null || username.isEmpty()) {
            return false;
        }
        String blacklistTime = redisTemplate.opsForValue().get(USER_BLACKLIST_PREFIX + username);
        return blacklistTime != null && tokenIssuedAt < Long.parseLong(blacklistTime);
    }
}
