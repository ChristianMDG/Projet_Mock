package mg.taxibrousse.services.implementation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.payment.PaymentNotification;
import mg.taxibrousse.services.IPaymentNotificationService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

import static mg.taxibrousse.services.IPaymentNotificationService.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentNotificationService implements IPaymentNotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String PAYMENT_STATUS_CACHE_PREFIX = "payment:status:";
    private static final long CACHE_EXPIRATION_HOURS = 1;

    @Override
    public void sendPaymentNotification(String roomId, PaymentNotification notification) {
        var destination = USER_PAYMENT_QUEUE_PREFIX + roomId;

        messagingTemplate.convertAndSend(destination, notification);

        log.info("Sent payment notification to room {}: transaction={}, status={}", roomId, notification.getTransactionReference(), notification.getStatus());
    }

    @Override
    public void broadcastPaymentUpdate(String transactionReference, PaymentNotification notification) {
        var destination = PAYMENT_TOPIC_PREFIX + transactionReference;
        var key = PAYMENT_STATUS_CACHE_PREFIX + transactionReference;
        // Cache the latest status in Redis
        try {
            var json = objectMapper.writeValueAsString(notification);
            redisTemplate.opsForValue().set(key, json, CACHE_EXPIRATION_HOURS, TimeUnit.HOURS);
        } catch (JsonProcessingException e) {
            log.error("Failed to cache payment notification for transaction {}: {}", transactionReference, e.getMessage());
        }

        messagingTemplate.convertAndSend(destination, notification);

        log.info("Broadcasted payment update for transaction {}: status={}", transactionReference, notification.getStatus());
    }

    @Override
    public void notifySubscriber(String roomId, String transactionReference) {
        var cacheKey = PAYMENT_STATUS_CACHE_PREFIX + transactionReference;
        var json = redisTemplate.opsForValue().get(cacheKey);

        if (json == null)
            return;
        try {
            var notification = objectMapper.readValue(json, PaymentNotification.class);
            sendPaymentNotification(roomId, notification);
            log.info("Sent cached payment status to subscriber room: {} for transaction: {}", roomId, transactionReference);
        } catch (JsonProcessingException e) {
            log.error("Failed to parse cached payment notification for transaction {}: {}", transactionReference, e.getMessage());
        }
    }
}
