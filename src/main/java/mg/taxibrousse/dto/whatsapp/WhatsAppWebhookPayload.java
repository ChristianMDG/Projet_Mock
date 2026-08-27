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
public class WhatsAppWebhookPayload {

    @JsonProperty("object")
    private String object;

    @JsonProperty("entry")
    private List<WhatsAppEntry> entry;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppEntry {

        @JsonProperty("id")
        private String id;

        @JsonProperty("changes")
        private List<WhatsAppChange> changes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppChange {

        @JsonProperty("value")
        private WhatsAppValue value;

        @JsonProperty("field")
        private String field;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppValue {

        @JsonProperty("messaging_product")
        private String messagingProduct;

        @JsonProperty("metadata")
        private WhatsAppMetadata metadata;

        @JsonProperty("contacts")
        private List<WhatsAppWebhookContact> contacts;

        @JsonProperty("messages")
        private List<WhatsAppIncomingMessage> messages;

        @JsonProperty("statuses")
        private List<WhatsAppStatusUpdate> statuses;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppMetadata {

        @JsonProperty("display_phone_number")
        private String displayPhoneNumber;

        @JsonProperty("phone_number_id")
        private String phoneNumberId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppWebhookContact {

        @JsonProperty("profile")
        private WhatsAppProfile profile;

        @JsonProperty("wa_id")
        private String waId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppProfile {

        @JsonProperty("name")
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppIncomingMessage {

        @JsonProperty("from")
        private String from;

        @JsonProperty("id")
        private String id;

        @JsonProperty("timestamp")
        private String timestamp;

        @JsonProperty("type")
        private String type;

        @JsonProperty("text")
        private WhatsAppTextContent text;

        @JsonProperty("image")
        private WhatsAppMediaContent image;

        @JsonProperty("document")
        private WhatsAppMediaContent document;

        @JsonProperty("audio")
        private WhatsAppMediaContent audio;

        @JsonProperty("video")
        private WhatsAppMediaContent video;

        @JsonProperty("location")
        private WhatsAppLocationContent location;

        @JsonProperty("interactive")
        private WhatsAppInteractiveContent interactive;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppTextContent {

        @JsonProperty("body")
        private String body;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppMediaContent {

        @JsonProperty("caption")
        private String caption;

        @JsonProperty("filename")
        private String filename;

        @JsonProperty("sha256")
        private String sha256;

        @JsonProperty("id")
        private String id;

        @JsonProperty("mime_type")
        private String mimeType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppLocationContent {

        @JsonProperty("latitude")
        private Double latitude;

        @JsonProperty("longitude")
        private Double longitude;

        @JsonProperty("name")
        private String name;

        @JsonProperty("address")
        private String address;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppInteractiveContent {

        @JsonProperty("type")
        private String type;

        @JsonProperty("button_reply")
        private WhatsAppButtonReplyContent buttonReply;

        @JsonProperty("list_reply")
        private WhatsAppListReplyContent listReply;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppButtonReplyContent {

        @JsonProperty("id")
        private String id;

        @JsonProperty("title")
        private String title;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppListReplyContent {

        @JsonProperty("id")
        private String id;

        @JsonProperty("title")
        private String title;

        @JsonProperty("description")
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppStatusUpdate {

        @JsonProperty("id")
        private String id;

        @JsonProperty("status")
        private String status;

        @JsonProperty("timestamp")
        private String timestamp;

        @JsonProperty("recipient_id")
        private String recipientId;

        @JsonProperty("conversation")
        private WhatsAppConversation conversation;

        @JsonProperty("pricing")
        private WhatsAppPricing pricing;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppConversation {

        @JsonProperty("id")
        private String id;

        @JsonProperty("origin")
        private WhatsAppConversationOrigin origin;

        @JsonProperty("expiration_timestamp")
        private String expirationTimestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppConversationOrigin {

        @JsonProperty("type")
        private String type;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppPricing {

        @JsonProperty("billable")
        private Boolean billable;

        @JsonProperty("pricing_model")
        private String pricingModel;

        @JsonProperty("category")
        private String category;
    }
}
