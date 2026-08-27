package mg.taxibrousse.dto.whatsapp;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhatsAppMessageRequest {

    @JsonProperty("messaging_product")
    private String messagingProduct = "whatsapp";

    @JsonProperty("recipient_type")
    private String recipientType = "individual";

    @JsonProperty("to")
    private String to;

    @JsonProperty("type")
    private String type;

    @JsonProperty("text")
    private WhatsAppTextMessage text;

    @JsonProperty("template")
    private WhatsAppTemplateMessage template;

    @JsonProperty("image")
    private WhatsAppMediaMessage image;

    @JsonProperty("document")
    private WhatsAppMediaMessage document;

    @JsonProperty("audio")
    private WhatsAppMediaMessage audio;

    @JsonProperty("video")
    private WhatsAppMediaMessage video;

    @JsonProperty("location")
    private WhatsAppLocationMessage location;

    @JsonProperty("interactive")
    private WhatsAppInteractiveMessage interactive;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppTextMessage {

        @JsonProperty("preview_url")
        private Boolean previewUrl;

        @JsonProperty("body")
        private String body;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppTemplateMessage {

        @JsonProperty("name")
        private String name;

        @JsonProperty("language")
        private WhatsAppLanguage language;

        @JsonProperty("components")
        private java.util.List<WhatsAppTemplateComponent> components;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppLanguage {

        @JsonProperty("code")
        private String code;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppTemplateComponent {

        @JsonProperty("type")
        private String type;

        @JsonProperty("parameters")
        private java.util.List<WhatsAppTemplateParameter> parameters;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppTemplateParameter {

        @JsonProperty("type")
        private String type;

        @JsonProperty("text")
        private String text;

        @JsonProperty("image")
        private WhatsAppMediaObject image;

        @JsonProperty("document")
        private WhatsAppMediaObject document;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppMediaObject {

        @JsonProperty("link")
        private String link;

        @JsonProperty("id")
        private String id;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppMediaMessage {

        @JsonProperty("id")
        private String id;

        @JsonProperty("link")
        private String link;

        @JsonProperty("caption")
        private String caption;

        @JsonProperty("filename")
        private String filename;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppLocationMessage {

        @JsonProperty("longitude")
        private Double longitude;

        @JsonProperty("latitude")
        private Double latitude;

        @JsonProperty("name")
        private String name;

        @JsonProperty("address")
        private String address;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppInteractiveMessage {

        @JsonProperty("type")
        private String type;

        @JsonProperty("header")
        private WhatsAppInteractiveHeader header;

        @JsonProperty("body")
        private WhatsAppInteractiveBody body;

        @JsonProperty("footer")
        private WhatsAppInteractiveFooter footer;

        @JsonProperty("action")
        private WhatsAppInteractiveAction action;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppInteractiveHeader {

        @JsonProperty("type")
        private String type;

        @JsonProperty("text")
        private String text;

        @JsonProperty("video")
        private WhatsAppMediaObject video;

        @JsonProperty("image")
        private WhatsAppMediaObject image;

        @JsonProperty("document")
        private WhatsAppMediaObject document;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppInteractiveBody {

        @JsonProperty("text")
        private String text;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppInteractiveFooter {

        @JsonProperty("text")
        private String text;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppInteractiveAction {

        @JsonProperty("button")
        private String button;

        @JsonProperty("buttons")
        private java.util.List<WhatsAppButton> buttons;

        @JsonProperty("sections")
        private java.util.List<WhatsAppSection> sections;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppButton {

        @JsonProperty("type")
        private String type;

        @JsonProperty("reply")
        private WhatsAppButtonReply reply;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppButtonReply {

        @JsonProperty("id")
        private String id;

        @JsonProperty("title")
        private String title;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppSection {

        @JsonProperty("title")
        private String title;

        @JsonProperty("rows")
        private java.util.List<WhatsAppRow> rows;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppRow {

        @JsonProperty("id")
        private String id;

        @JsonProperty("title")
        private String title;

        @JsonProperty("description")
        private String description;
    }
}
