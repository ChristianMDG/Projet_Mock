package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.config.WhatsAppApiConfig;
import mg.taxibrousse.dto.messaging.SendMessageRequest;
import mg.taxibrousse.dto.whatsapp.WhatsAppWebhookPayload;
import mg.taxibrousse.services.IMessageService;
import mg.taxibrousse.services.IWhatsAppReplyService;
import mg.taxibrousse.utils.PhoneUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppReplyService implements IWhatsAppReplyService {

    private final IMessageService messageService;
    private final WhatsAppApiConfig whatsAppConfig;

    // Pattern to extract room ID: ROOM:room-123 or #room-123
    private static final Pattern ROOM_PATTERN = Pattern.compile("(?:ROOM:|#)([a-zA-Z0-9-]+)");

    @Override
    public void processAdminReply(WhatsAppWebhookPayload.WhatsAppIncomingMessage message, String fromNumber) {
        boolean isAdmin = isAdminNumber(fromNumber);
        if (!isAdmin) {
            log.debug("Ignoring message from non-admin number: {}", fromNumber);
            return;
        }

        boolean isTextMessage = "text".equals(message.getType()) && message.getText() != null;
        if (!isTextMessage) {
            log.debug("Ignoring non-text message from admin");
            return;
        }

        String messageContent = message.getText().getBody();
        String roomId = extractRoomId(messageContent);

        boolean roomIdFound = roomId != null;
        if (!roomIdFound) {
            log.warn("Could not extract room ID from admin message: {}", messageContent);
            return;
        }

        String cleanMessage = removeRoomPrefix(messageContent);

        boolean messageNotEmpty = !cleanMessage.isBlank();
        if (!messageNotEmpty) {
            log.warn("Empty message after removing room prefix");
            return;
        }

        sendToChatRoom(roomId, cleanMessage);
    }

    @Override
    public String extractRoomId(String messageContent) {
        boolean hasContent = StringUtils.hasText(messageContent);
        if (hasContent) {
            Matcher matcher = ROOM_PATTERN.matcher(messageContent);
            return matcher.find() ? matcher.group(1) : null;
        }

        return null;
    }

    private boolean isAdminNumber(String phoneNumber) {
        String adminPhone = whatsAppConfig.getAdminPhoneNumber();
        boolean bothPresent = adminPhone != null && phoneNumber != null;
        if (!bothPresent) {
            return false;
        }
        return PhoneUtils.normalizePhone(adminPhone).equals(PhoneUtils.normalizePhone(phoneNumber));
    }

    private String removeRoomPrefix(String message) {
        Matcher matcher = ROOM_PATTERN.matcher(message);
        return matcher.find() ? message.substring(matcher.end()).trim() : message;
    }

    private void sendToChatRoom(String roomId, String messageContent) {
        try {
            SendMessageRequest request = new SendMessageRequest();
            request.setRoomId(roomId);
            request.setContent(messageContent);

            messageService.sendMessage(request, "admin", "Admin (via WhatsApp)");
            log.info("Admin reply sent to room {} via WhatsApp", roomId);

        } catch (Exception e) {
            log.error("Failed to send admin reply to room {}: {}", roomId, e.getMessage(), e);
        }
    }
}
