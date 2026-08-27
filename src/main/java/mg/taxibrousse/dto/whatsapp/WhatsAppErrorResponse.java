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
public class WhatsAppErrorResponse {

    @JsonProperty("error")
    private WhatsAppError error;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppError {

        @JsonProperty("message")
        private String message;

        @JsonProperty("type")
        private String type;

        @JsonProperty("code")
        private Integer code;

        @JsonProperty("error_data")
        private WhatsAppErrorData errorData;

        @JsonProperty("fbtrace_id")
        private String fbtraceId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppErrorData {

        @JsonProperty("details")
        private String details;
    }
}
