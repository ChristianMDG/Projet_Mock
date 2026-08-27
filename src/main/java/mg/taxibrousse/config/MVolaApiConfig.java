package mg.taxibrousse.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.Base64;

@Getter
@Configuration
public class MVolaApiConfig {

    @Value("${mvola.client-id}")
    private String clientId;

    @Value("${mvola.client-secret}")
    private String clientSecret;

    @Value("${mvola.mvola-base-url}")
    private String baseUrl;

    @Value("${mvola.partner-name}")
    private String partnerName;

    @Value("${mvola.callback-url}")
    private String callbackUrl;

    @Value("${mvola.user-account-msisdn}")
    private String userAccountMsisdn;

    @Value("${mvola.credit-party-msisdn}")
    private String creditPartyMsisdn;

    public String getBasicAuthHeader() {
        return Base64.getEncoder().encodeToString("%s:%s".formatted(clientId, clientSecret).getBytes());
    }

    public String getTokenUrl() {
        return "%s/token".formatted(baseUrl);
    }

    public String getPaymentUrl() {
        return "%s/mvola/mm/transactions/type/merchantpay/1.0.0/".formatted(baseUrl);
    }

    public String getStatusUrl(String correlationId) {
        return "%s/mvola/mm/transactions/type/merchantpay/1.0.0/status/%s".formatted(baseUrl, correlationId);
    }

    public String getUserAccountIdentifier() {
        return "msisdn;%s".formatted(userAccountMsisdn);
    }
}
