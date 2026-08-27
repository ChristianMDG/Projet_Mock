package mg.taxibrousse.services;

import mg.taxibrousse.dto.whatsapp.WhatsAppWebhookPayload;

/**
 * Service for handling WhatsApp replies from admin and routing them to chat rooms
 */
public interface IWhatsAppReplyService {

    /**
     * Process incoming WhatsApp message from admin and send to appropriate chat room
     *
     * @param message incoming WhatsApp message
     * @param fromNumber sender's phone number
     */
    void processAdminReply(WhatsAppWebhookPayload.WhatsAppIncomingMessage message, String fromNumber);

    /**
     * Extract room ID from message content
     * Expected format: "ROOM:room-id-123 Your message here"
     *
     * @param messageContent message text
     * @return room ID or null if not found
     */
    String extractRoomId(String messageContent);
}
