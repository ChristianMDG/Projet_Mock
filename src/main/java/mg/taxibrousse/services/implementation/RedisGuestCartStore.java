package mg.taxibrousse.services.implementation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.Cart;
import mg.taxibrousse.services.IRedisGuestCartStore;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.Optional;

/**
 * Redis-backed guest cart store keyed by senderId.
 * <p>
 * Schema:
 * - {@code cart:guest:<senderId>} → JSON-serialized {@link Cart}
 * - {@code cart:guest:<senderId>:seq} → atomic counter for client-side item ids
 * <p>
 * TTL: 7 days, refreshed on every write.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RedisGuestCartStore implements IRedisGuestCartStore {

    private static final String KEY_PREFIX = "cart:guest:";
    private static final String SEQ_SUFFIX = ":seq";
    private static final Duration TTL = Duration.ofDays(7);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public Optional<Cart> find(String senderId) {
        if (hasSenderId(senderId)) {
            String json = redisTemplate.opsForValue().get(key(senderId));
            if (json == null) {
                return Optional.empty();
            }
            try {
                return Optional.ofNullable(objectMapper.readValue(json, Cart.class));
            } catch (JsonProcessingException e) {
                log.warn("Failed to deserialize guest cart for senderId={}", senderId, e);
                redisTemplate.delete(key(senderId));
            }
        }
        return Optional.empty();
    }

    @Override
    public Cart save(String senderId, Cart cart) {
        requireSenderId(senderId);
        try {
            String json = objectMapper.writeValueAsString(cart);
            redisTemplate.opsForValue().set(key(senderId), json, TTL);
            return cart;
        } catch (JsonProcessingException e) {
            throw new ShopException("error_cart_serialize", "exception_cart_serialize_failed");
        }
    }

    @Override
    public void delete(String senderId) {
        if (hasSenderId(senderId)) {
            redisTemplate.delete(key(senderId));
            redisTemplate.delete(seqKey(senderId));
        }
    }

    @Override
    public boolean exists(String senderId) {
        if (hasSenderId(senderId)) {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key(senderId)));
        }
        return false;
    }

    @Override
    public long nextItemId(String senderId) {
        requireSenderId(senderId);
        Long next = redisTemplate.opsForValue().increment(seqKey(senderId));
        if (next == null) {
            // Fallback: random positive long
            return Math.abs(System.nanoTime());
        }
        redisTemplate.expire(seqKey(senderId), TTL);
        return next;
    }

    private static boolean hasSenderId(String senderId) {
        return StringUtils.hasText(senderId);
    }

    private static void requireSenderId(String senderId) {
        if (hasSenderId(senderId)) {
            return;
        }
        throw new ShopException("error_sender_id_required", "exception_sender_id_required");
    }

    private static String key(String senderId) {
        return KEY_PREFIX + senderId;
    }

    private static String seqKey(String senderId) {
        return KEY_PREFIX + senderId + SEQ_SUFFIX;
    }
}
