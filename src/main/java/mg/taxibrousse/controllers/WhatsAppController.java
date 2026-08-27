package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.config.WhatsAppApiConfig;
import mg.taxibrousse.controllers.interfaces.IWhatsAppController;
import mg.taxibrousse.dto.whatsapp.WhatsAppMessageRequest;
import mg.taxibrousse.dto.whatsapp.WhatsAppMessageResponse;
import mg.taxibrousse.dto.whatsapp.WhatsAppWebhookPayload;
import mg.taxibrousse.services.IWhatsAppReplyService;
import mg.taxibrousse.services.IWhatsAppService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class WhatsAppController implements IWhatsAppController {

    private final IWhatsAppService whatsAppService;
    private final WhatsAppApiConfig config;
    private final IWhatsAppReplyService whatsAppReplyService;

    @Override
    public ResponseEntity<WhatsAppMessageResponse> sendTextMessage(String phoneNumber, String message) {
        try {
            log.info("Controller: Sending text message to {}", phoneNumber);
            WhatsAppMessageResponse response = whatsAppService.sendTextMessage(phoneNumber, message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending text message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<WhatsAppMessageResponse> sendTemplateMessage(String phoneNumber, String templateName, String languageCode, String[] parameters) {
        try {
            log.info("Controller: Sending template message '{}' to {}", templateName, phoneNumber);
            String[] params = parameters != null ? parameters : new String[0];
            WhatsAppMessageResponse response = whatsAppService.sendTemplateMessage(phoneNumber, templateName, languageCode, params);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending template message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<WhatsAppMessageResponse> sendImageMessage(String phoneNumber, String imageUrl, String caption) {
        try {
            log.info("Controller: Sending image message to {}", phoneNumber);
            WhatsAppMessageResponse response = whatsAppService.sendImageMessage(phoneNumber, imageUrl, caption);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending image message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<WhatsAppMessageResponse> sendDocumentMessage(String phoneNumber, String documentUrl, String filename, String caption) {
        try {
            log.info("Controller: Sending document message to {}", phoneNumber);
            WhatsAppMessageResponse response = whatsAppService.sendDocumentMessage(phoneNumber, documentUrl, filename, caption);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending document message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<WhatsAppMessageResponse> sendLocationMessage(String phoneNumber, Double latitude, Double longitude, String name, String address) {
        try {
            log.info("Controller: Sending location message to {}", phoneNumber);
            WhatsAppMessageResponse response = whatsAppService.sendLocationMessage(phoneNumber, latitude, longitude, name, address);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending location message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<WhatsAppMessageResponse> sendCustomMessage(WhatsAppMessageRequest messageRequest) {
        try {
            log.info("Controller: Sending custom message to {}", messageRequest.getTo());
            WhatsAppMessageResponse response = whatsAppService.sendCustomMessage(messageRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending custom message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<String> verifyWebhook(String mode, String token, String challenge) {
        log.info("Webhook verification request - mode: {}, token: {}", mode, token);

        if ("subscribe".equals(mode) && config.getWebhookVerifyToken().equals(token)) {
            log.info("Webhook verified successfully");
            return ResponseEntity.ok(challenge);
        } else {
            log.warn("Webhook verification failed - invalid token or mode");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification failed");
        }
    }

    @Override
    public ResponseEntity<Map<String, String>> handleWebhook(WhatsAppWebhookPayload payload) {
        try {
            log.info("Received WhatsApp webhook payload: {}", payload);

            if (payload == null || payload.getEntry() == null || payload.getEntry().isEmpty()) {
                log.warn("Empty webhook payload received");
                return ResponseEntity.ok(Map.of("status", "received"));
            }

            for (WhatsAppWebhookPayload.WhatsAppEntry entry : payload.getEntry()) {
                for (WhatsAppWebhookPayload.WhatsAppChange change : entry.getChanges()) {
                    WhatsAppWebhookPayload.WhatsAppValue value = change.getValue();

                    if (value.getMessages() != null) {
                        for (WhatsAppWebhookPayload.WhatsAppIncomingMessage message : value.getMessages()) {
                            handleIncomingMessage(message, value);
                        }
                    }

                    if (value.getStatuses() != null) {
                        for (WhatsAppWebhookPayload.WhatsAppStatusUpdate status : value.getStatuses()) {
                            handleStatusUpdate(status);
                        }
                    }
                }
            }

            return ResponseEntity.ok(Map.of("status", "received"));

        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    private void handleIncomingMessage(WhatsAppWebhookPayload.WhatsAppIncomingMessage message, WhatsAppWebhookPayload.WhatsAppValue value) {
        log.info("Incoming message from {}: type={}, id={}", message.getFrom(), message.getType(), message.getId());

        // Process admin reply (will forward to chat if applicable)
        whatsAppReplyService.processAdminReply(message, message.getFrom());

        switch (message.getType()) {
            case "text" :
                if (message.getText() != null) {
                    log.info("Text message: {}", message.getText().getBody());
                }
                break;
            case "image" :
                if (message.getImage() != null) {
                    log.info("Image message: id={}, caption={}", message.getImage().getId(), message.getImage().getCaption());
                }
                break;
            case "document" :
                if (message.getDocument() != null) {
                    log.info("Document message: id={}, filename={}", message.getDocument().getId(), message.getDocument().getFilename());
                }
                break;
            case "interactive" :
                if (message.getInteractive() != null) {
                    log.info("Interactive message: type={}", message.getInteractive().getType());
                }
                break;
            default :
                log.info("Other message type: {}", message.getType());
        }
    }

    private void handleStatusUpdate(WhatsAppWebhookPayload.WhatsAppStatusUpdate status) {
        log.info("Status update for message {}: status={}, recipient={}", status.getId(), status.getStatus(), status.getRecipientId());

        // TODO: Implement your business logic here
        // For example: update message delivery status in database
    }
}
