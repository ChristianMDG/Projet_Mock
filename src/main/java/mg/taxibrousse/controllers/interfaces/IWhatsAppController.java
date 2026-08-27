package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.dto.whatsapp.WhatsAppMessageRequest;
import mg.taxibrousse.dto.whatsapp.WhatsAppMessageResponse;
import mg.taxibrousse.dto.whatsapp.WhatsAppWebhookPayload;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp")
@CrossOrigin(origins = "*")
public interface IWhatsAppController {

    /**
     * Send a text message via WhatsApp
     */
    @PostMapping("/send/text")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'KOPERATIVE', 'GUICHET')")
    ResponseEntity<WhatsAppMessageResponse> sendTextMessage(@RequestParam String phoneNumber, @RequestParam String message);

    /**
     * Send a template message via WhatsApp
     */
    @PostMapping("/send/template")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'KOPERATIVE', 'GUICHET')")
    ResponseEntity<WhatsAppMessageResponse> sendTemplateMessage(@RequestParam String phoneNumber, @RequestParam String templateName, @RequestParam String languageCode,
            @RequestParam(required = false) String[] parameters);

    /**
     * Send an image via WhatsApp
     */
    @PostMapping("/send/image")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'KOPERATIVE', 'GUICHET')")
    ResponseEntity<WhatsAppMessageResponse> sendImageMessage(@RequestParam String phoneNumber, @RequestParam String imageUrl, @RequestParam(required = false) String caption);

    /**
     * Send a document via WhatsApp
     */
    @PostMapping("/send/document")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'KOPERATIVE', 'GUICHET')")
    ResponseEntity<WhatsAppMessageResponse> sendDocumentMessage(@RequestParam String phoneNumber, @RequestParam String documentUrl, @RequestParam String filename,
            @RequestParam(required = false) String caption);

    /**
     * Send a location via WhatsApp
     */
    @PostMapping("/send/location")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'KOPERATIVE', 'GUICHET')")
    ResponseEntity<WhatsAppMessageResponse> sendLocationMessage(@RequestParam String phoneNumber, @RequestParam Double latitude, @RequestParam Double longitude,
            @RequestParam(required = false) String name, @RequestParam(required = false) String address);

    /**
     * Send a custom message (full control)
     */
    @PostMapping("/send/custom")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'KOPERATIVE', 'GUICHET')")
    ResponseEntity<WhatsAppMessageResponse> sendCustomMessage(@RequestBody WhatsAppMessageRequest messageRequest);

    /**
     * Webhook verification endpoint (for Meta to verify the webhook)
     */
    @GetMapping("/webhook")
    ResponseEntity<String> verifyWebhook(@RequestParam("hub.mode") String mode, @RequestParam("hub.verify_token") String token, @RequestParam("hub.challenge") String challenge);

    /**
     * Webhook endpoint to receive WhatsApp events
     */
    @PostMapping("/webhook")
    ResponseEntity<Map<String, String>> handleWebhook(@RequestBody WhatsAppWebhookPayload payload);
}
