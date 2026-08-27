package mg.taxibrousse.interceptors;

import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.services.IPaymentNotificationService;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import static mg.taxibrousse.services.IPaymentNotificationService.*;

@Slf4j
@Component
public class StompSubscriptionInterceptor implements ChannelInterceptor {

    private final IPaymentNotificationService paymentNotificationService;

    public StompSubscriptionInterceptor(@Lazy IPaymentNotificationService paymentNotificationService) {
        this.paymentNotificationService = paymentNotificationService;
    }

    @Override
    public void postSend(@NonNull Message<?> message, @NonNull MessageChannel channel, boolean sent) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destination = accessor.getDestination();
            if (destination == null)
                return;

            if (destination.startsWith(PAYMENT_TOPIC_PREFIX)) {
                String transactionReference = destination.substring(PAYMENT_TOPIC_PREFIX.length());

                log.info("New subscription detected for session {} on topic {} - Identified by: {}", accessor.getSessionId(), destination, transactionReference);
                paymentNotificationService.notifySubscriber(transactionReference, transactionReference);
            }
        }
    }
}
