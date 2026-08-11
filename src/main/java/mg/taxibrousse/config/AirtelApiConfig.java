package mg.taxibrousse.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import static java.text.MessageFormat.format;

@Getter
@Configuration
public class AirtelApiConfig {
    @Value("${airtelmoney.client-id}")
    private String clientId;

    @Value("${airtelmoney.client-secret}")
    private String clientSecret;

    @Value("${airtelmoney.base-url}")
    private String baseUrl;

    @Value("${airtelmoney.callback-url}")
    private String callbackUrl;

    public String getTokenUrl() {
        return format("{0}/auth/oauth2/token", baseUrl);
    }

    public String getPaymentUrl() {
        return format("{0}/merchant/v1/payments/", baseUrl);
    }

    public String getStatusUrl(String transactionId) {
        return format("{0}/standard/v1/payments/{1}", baseUrl, transactionId);
    }
}
