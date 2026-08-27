package mg.taxibrousse.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class WhatsAppApiConfig {

    @Value("${whatsapp.access-token}")
    private String accessToken;

    @Value("${whatsapp.phone-number-id}")
    private String phoneNumberId;

    @Value("${whatsapp.business-account-id}")
    private String businessAccountId;

    @Value("${whatsapp.base-url}")
    private String baseUrl;

    @Value("${whatsapp.api-version}")
    private String apiVersion;

    @Value("${whatsapp.webhook-verify-token}")
    private String webhookVerifyToken;

    @Value("${whatsapp.admin-phone-number}")
    private String adminPhoneNumber;

    public String getMessagesUrl() {
        return "%s/%s/%s/messages".formatted(baseUrl, apiVersion, phoneNumberId);
    }

    public String getMediaUrl() {
        return "%s/%s/%s/media".formatted(baseUrl, apiVersion, phoneNumberId);
    }

    public String getMediaDownloadUrl(String mediaId) {
        return "%s/%s/%s".formatted(baseUrl, apiVersion, mediaId);
    }

    public String getAuthHeader() {
        return "Bearer %s".formatted(accessToken);
    }
}
