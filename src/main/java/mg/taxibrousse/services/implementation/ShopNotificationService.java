package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.services.IShopNotificationService;
import mg.taxibrousse.services.ISmsService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Sends shop order confirmation notifications asynchronously.
 * - SMS is sent via the existing {@link ISmsService} (Orange).
 * - Email is currently logged only because no backend email/mail sender is configured yet.
 * Wire a real {@code JavaMailSender} / transactional email provider here when available.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ShopNotificationService implements IShopNotificationService {

    private final ISmsService smsService;

    @Override
    @Async
    public void sendOrderConfirmation(OrderEntity order) {
        if (order == null) {
            return;
        }
        sendSms(order);
        sendEmail(order);
    }

    private void sendSms(OrderEntity order) {
        String phone = order.getCustomerPhone();
        boolean hasPhone = StringUtils.hasText(phone);
        if (hasPhone) {
            deliverSms(order, phone);
            return;
        }
        log.warn("No phone on order {} - skipping SMS", order.getOrderNumber());
    }

    private void deliverSms(OrderEntity order, String phone) {
        try {
            String message = buildSmsMessage(order);
            smsService.sendSms(phone, message);
            log.info("Order confirmation SMS sent for order {}", order.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to send order confirmation SMS for order {}: {}", order.getOrderNumber(), e.getMessage());
        }
    }

    private void sendEmail(OrderEntity order) {
        String email = order.getCustomerEmail();
        boolean hasEmail = StringUtils.hasText(email);
        if (hasEmail) {
            // TODO: integrate with a real email provider when one is configured.
            log.info("[order.confirmation][EMAIL_STUB] to={} order={} total={}", email, order.getOrderNumber(), order.getTotal());
        }
    }

    private String buildSmsMessage(OrderEntity order) {
        return String.format("Taxibrousse Shop: commande %s confirmee. Total: %s %s.",
                order.getOrderNumber(),
                order.getTotal() != null ? order.getTotal().toPlainString() : "0",
                order.getCurrency() != null ? order.getCurrency() : "MGA");
    }

    @Override
    @Async
    public void notifyStatusChange(OrderEntity order, OrderStatusEnum previousStatus) {
        if (order == null || order.getStatus() == null) {
            return;
        }
        String phone = order.getCustomerPhone();
        boolean hasPhone = StringUtils.hasText(phone);
        String message = buildStatusChangeSms(order, previousStatus);
        if (hasPhone) {
            try {
                smsService.sendSms(phone, message);
                log.info("Status change SMS sent for order {} ({} -> {})", order.getOrderNumber(), previousStatus, order.getStatus());
            } catch (Exception e) {
                log.error("Failed to send status change SMS for order {}: {}", order.getOrderNumber(), e.getMessage());
            }
        }
        String email = order.getCustomerEmail();
        boolean hasEmail = StringUtils.hasText(email);
        if (hasEmail) {
            log.info("[order.statusChange][EMAIL_STUB] to={} order={} {} -> {}", email, order.getOrderNumber(), previousStatus, order.getStatus());
        }
    }

    private String buildStatusChangeSms(OrderEntity order, OrderStatusEnum previousStatus) {
        return String.format("Taxibrousse Shop: commande %s - statut: %s.", order.getOrderNumber(), order.getStatus().name());
    }
}
