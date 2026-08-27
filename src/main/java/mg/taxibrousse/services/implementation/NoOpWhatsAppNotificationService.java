package mg.taxibrousse.services.implementation;

import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.MessageEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.services.IWhatsAppNotificationService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * No-op implementation of {@link IWhatsAppNotificationService}.
 * Registered automatically when {@code whatsapp.enabled=false} (the default).
 * All methods silently return {@code false} without making any HTTP call.
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "whatsapp.enabled", havingValue = "false", matchIfMissing = true)
public class NoOpWhatsAppNotificationService implements IWhatsAppNotificationService {

    @Override
    public boolean sendReservationConfirmation(ReservationEntity reservation) {
        log.debug("WhatsApp disabled — skipping reservation confirmation for {}", reservation.getId());
        return false;
    }

    @Override
    public boolean sendReservationReminder(ReservationEntity reservation) {
        return false;
    }

    @Override
    public boolean sendReservationCancellation(ReservationEntity reservation) {
        return false;
    }

    @Override
    public boolean sendPaymentReminder(String phoneNumber, Double amount, String reference) {
        return false;
    }

    @Override
    public boolean sendPaymentConfirmation(String phoneNumber, Double amount, String reference) {
        return false;
    }

    @Override
    public boolean sendOrderConfirmation(OrderEntity order) {
        return false;
    }

    @Override
    public boolean sendOrderShipmentNotification(OrderEntity order, String trackingNumber) {
        return false;
    }

    @Override
    public boolean sendOrderDeliveryNotification(OrderEntity order) {
        return false;
    }

    @Override
    public boolean sendDepartureLocation(String phoneNumber, String gareName, Double latitude, Double longitude, String address) {
        return false;
    }

    @Override
    public void sendNewChatMessageNotificationToAdmin(MessageEntity message) {
        // no-op
    }
}
