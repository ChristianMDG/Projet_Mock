package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.config.WhatsAppApiConfig;
import mg.taxibrousse.entities.MessageEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.MessageType;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.IWhatsAppNotificationService;
import mg.taxibrousse.services.IWhatsAppService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.text.MessageFormat;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Currency;
import java.util.Locale;
import java.util.Objects;

@Slf4j
@Service
@ConditionalOnProperty(name = "whatsapp.enabled", havingValue = "true")
@RequiredArgsConstructor
public class WhatsAppNotificationService implements IWhatsAppNotificationService {

    private final IWhatsAppService whatsAppService;
    private final WhatsAppApiConfig whatsAppConfig;
    private final IPaymentTransactionRepository paymentTransactionRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final NumberFormat CURRENCY_FORMATTER = NumberFormat.getCurrencyInstance(Locale.FRANCE);

    static {
        CURRENCY_FORMATTER.setCurrency(Currency.getInstance("MGA"));
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    @Override
    public boolean sendReservationConfirmation(ReservationEntity reservation) {
        String phone = getTargetPhone(reservation);
        if (StringUtils.hasText(phone)) {
            ReservationContext ctx = ReservationContext.of(reservation);
            String firstName = reservation.getVoyageur() != null ? reservation.getVoyageur().getFirstName() : "Voyageur";
            return sendSafely("reservation confirmation", phone, () -> whatsAppService.sendTextMessage(phone, buildReservationConfirmationMessage(ctx, firstName)));
        }
        log.warn("Cannot send WhatsApp notification: missing phone number for reservation {}", reservation.getId());
        return false;
    }

    @Override
    public boolean sendReservationReminder(ReservationEntity reservation) {
        String phone = getTargetPhone(reservation);
        if (StringUtils.hasText(phone)) {
            ReservationContext ctx = ReservationContext.of(reservation);
            return sendSafely("reservation reminder", phone, () -> whatsAppService.sendTextMessage(phone, buildReservationReminderMessage(ctx)));
        }
        return false;
    }

    @Override
    public boolean sendReservationCancellation(ReservationEntity reservation) {
        String phone = getTargetPhone(reservation);
        if (StringUtils.hasText(phone)) {
            ReservationContext ctx = ReservationContext.of(reservation);
            return sendSafely("reservation cancellation", phone, () -> whatsAppService.sendTextMessage(phone, buildReservationCancellationMessage(ctx)));
        }
        return false;
    }

    @Override
    public boolean sendPaymentReminder(String phoneNumber, Double amount, String reference) {
        String message = String.format("""
                🔔 *Rappel de paiement*

                Votre paiement de *%s* est en attente.

                Référence: %s

                Payez maintenant pour confirmer votre réservation.

                Merci de voyager avec Taxibrousse! 🚌""", CURRENCY_FORMATTER.format(amount), reference);
        return sendSafely("payment reminder", phoneNumber, () -> whatsAppService.sendTextMessage(phoneNumber, message));
    }

    @Override
    public boolean sendPaymentConfirmation(String phoneNumber, Double amount, String reference) {
        String message = String.format("""
                ✅ *Paiement confirmé*

                Votre paiement de *%s* a été reçu avec succès.

                Référence: %s

                Merci pour votre confiance! 🙏""", CURRENCY_FORMATTER.format(amount), reference);
        return sendSafely("payment confirmation", phoneNumber, () -> whatsAppService.sendTextMessage(phoneNumber, message));
    }

    @Override
    public boolean sendOrderConfirmation(OrderEntity order) {
        if (hasNoPhone(order)) {
            log.warn("Cannot send WhatsApp notification: missing phone number for order {}", order.getId());
            return false;
        }
        String phone = order.getCustomerPhone();
        return sendSafely("order confirmation", phone, () -> whatsAppService.sendTextMessage(phone, buildOrderConfirmationMessage(order)));
    }

    @Override
    public boolean sendOrderShipmentNotification(OrderEntity order, String trackingNumber) {
        if (hasNoPhone(order)) {
            return false;
        }
        String phone = order.getCustomerPhone();
        String message = String.format("""
                📦 *Commande expédiée*

                Votre commande #%s a été expédiée!

                Numéro de suivi: *%s*

                Vous recevrez votre colis sous peu.

                Merci de votre achat! 🛍️""", order.getOrderNumber(), trackingNumber);
        return sendSafely("shipment notification", phone, () -> whatsAppService.sendTextMessage(phone, message));
    }

    @Override
    public boolean sendOrderDeliveryNotification(OrderEntity order) {
        if (hasNoPhone(order)) {
            return false;
        }
        String phone = order.getCustomerPhone();
        String message = String.format("""
                ✅ *Commande livrée*

                Votre commande #%s a été livrée avec succès!

                Nous espérons que vous êtes satisfait(e) de votre achat.

                N'hésitez pas à laisser un avis! ⭐

                À bientôt sur Taxibrousse! 🙏""", order.getOrderNumber());
        return sendSafely("delivery notification", phone, () -> whatsAppService.sendTextMessage(phone, message));
    }

    @Override
    public boolean sendDepartureLocation(String phoneNumber, String gareName, Double latitude, Double longitude, String address) {
        return sendSafely("departure location", phoneNumber, () -> whatsAppService.sendLocationMessage(phoneNumber, latitude, longitude, gareName, address));
    }

    @Override
    @Async
    public void sendNewChatMessageNotificationToAdmin(MessageEntity message) {
        boolean skipMessage = message == null || message.getType() == MessageType.SYSTEM || "system".equals(message.getSenderId()) || "admin".equals(message.getSenderId());
        if (skipMessage) {
            return;
        }

        String adminPhone = whatsAppConfig.getAdminPhoneNumber();
        boolean adminPhoneConfigured = StringUtils.hasText(adminPhone) && !adminPhone.equals("+261340000000");
        if (!adminPhoneConfigured) {
            log.debug("Admin WhatsApp notification skipped: no valid admin phone configured");
            return;
        }

        String notification = String.format("""
                💬 *Nouveau message chat*

                De: *%s*
                Salon: *%s*

                Message:
                %s

                ---
                Pour répondre: ROOM:%s <votre message>""", message.getSenderName(), message.getRoomId(), truncateMessage(message.getContent()), message.getRoomId());

        sendSafely("admin chat notification", adminPhone, () -> whatsAppService.sendTextMessage(adminPhone, notification));
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private boolean sendSafely(String label, String phone, Runnable sendAction) {
        try {
            sendAction.run();
            log.info("Sent {} via WhatsApp to {}", label, phone);
            return true;
        } catch (Exception e) {
            log.error("Failed to send {} via WhatsApp: {}", label, e.getMessage(), e);
            return false;
        }
    }

    private String getTargetPhone(ReservationEntity reservation) {
        String transactionPhone = paymentTransactionRepository.findByReservationIdOrderByInitiatedAtDesc(reservation.getId())
                .stream()
                .map(PaymentTransactionEntity::getPhoneNumber)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse(null);

        if (StringUtils.hasText(transactionPhone)) {
            return transactionPhone;
        }

        if (reservation.getVoyageur() == null) {
            return null;
        }
        return reservation.getVoyageur().getPhone();
    }

    private boolean hasNoPhone(OrderEntity order) {
        return order.getUserAccount() == null || !StringUtils.hasText(order.getCustomerPhone());
    }

    private String truncateMessage(String content) {
        String text = Objects.requireNonNullElse(content, "");
        return text.length() <= 200 ? text : text.substring(0, 200) + "...";
    }

    // -------------------------------------------------------------------------
    // Message builders
    // -------------------------------------------------------------------------

    private String buildReservationConfirmationMessage(ReservationContext ctx, String voyageurName) {
        return String.format("""
                🎉 *Réservation confirmée*

                Bonjour *%s*,

                Votre réservation est confirmée!

                📍 Trajet: *%s → %s*
                📅 Date: *%s*
                🕐 Heure: *%s*
                🎫 Réservation: *%s*
                💺 Place(s): *%s*

                Bon voyage avec Taxibrousse! 🚌""", voyageurName, ctx.departure(), ctx.arrival(), ctx.date(), ctx.time(), ctx.bookingRef(), ctx.seats());
    }

    private String buildReservationReminderMessage(ReservationContext ctx) {
        return String.format("""
                ⏰ *Rappel de départ*

                Votre voyage *%s → %s* est prévu demain à *%s*.

                🎫 Réservation: *%s*
                💺 Place(s): *%s*

                Veuillez arriver 15 minutes avant le départ.

                Bon voyage! 🚌""", ctx.departure(), ctx.arrival(), ctx.time(), ctx.bookingRef(), ctx.seats());
    }

    private String buildReservationCancellationMessage(ReservationContext ctx) {
        return String.format("""
                ❌ *Réservation annulée*

                Votre réservation *%s* pour le trajet *%s → %s* a été annulée.

                Si vous avez des questions, contactez-nous.

                À bientôt sur Taxibrousse! 🙏""", ctx.bookingRef(), ctx.departure(), ctx.arrival());
    }

    private String buildOrderConfirmationMessage(OrderEntity order) {
        return String.format("""
                🛍️ *Commande confirmée*

                Bonjour *%s*,

                Votre commande a été confirmée!

                📦 Commande: *%s*
                💰 Total: *%s*

                Nous préparons votre colis avec soin.

                Merci pour votre achat! 🙏""", order.getCustomerName(), order.getOrderNumber(), CURRENCY_FORMATTER.format(order.getTotal().doubleValue()));
    }

    // -------------------------------------------------------------------------
    // Inner record — shared reservation data extracted once, reused by all builders
    // -------------------------------------------------------------------------

    private record ReservationContext(String departure, String arrival, String date, String time, String bookingRef, String seats) {

        static ReservationContext of(ReservationEntity reservation) {
            VoyageEntity voyage = reservation.getVoyage();
            String seats = CollectionUtils.isEmpty(reservation.getSeats())
                    ? "N/A"
                    : reservation.getSeats().stream().map(seat -> String.valueOf(seat.getSeatNumber())).reduce((a, b) -> MessageFormat.format("{0}, {1}", a, b)).orElse("N/A");
            return new ReservationContext(voyage.getDepartureGare().getName(), voyage.getArrivalGare().getName(), voyage.getDepartureTime().toLocalDate().format(DATE_FORMATTER), voyage
                    .getDepartureTime()
                    .toLocalTime()
                    .format(TIME_FORMATTER), reservation.getBookingReference(), seats);
        }
    }
}
