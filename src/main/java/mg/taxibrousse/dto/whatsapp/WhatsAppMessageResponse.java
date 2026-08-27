package mg.taxibrousse.dto.whatsapp;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhatsAppMessageResponse {

    @JsonProperty("messaging_product")
    private String messagingProduct;

    @JsonProperty("contacts")
    private List<WhatsAppContact> contacts;

    @JsonProperty("messages")
    private List<WhatsAppMessageStatus> messages;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppContact {

        @JsonProperty("input")
        private String input;

        @JsonProperty("wa_id")
        private String waId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppMessageStatus {

        @JsonProperty("id")
        private String id;

        @JsonProperty("message_status")
        private String messageStatus;
    }
}
