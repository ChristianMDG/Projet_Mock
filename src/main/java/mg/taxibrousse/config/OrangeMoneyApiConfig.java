package mg.taxibrousse.config;

import lombok.Getter;
import lombok.Setter;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import static java.text.MessageFormat.format;

@Getter
@Setter
@Configuration
public class OrangeMoneyApiConfig {

    @Value("${orangemoney.client-id:}")
    private String clientId;

    @Value("${orangemoney.client-secret:}")
    private String clientSecret;

    @Value("${orangemoney.base-url:https://api.orange.com}")
    private String baseUrl;

    @Value("${orangemoney.merchant-key:}")
    private String merchantKey;

    @Value("${orangemoney.merchant-name:TaxiBrousse}")
    private String merchantName;

    @Value("${orangemoney.country-code:MG}")
    private String countryCode;

    @Value("${orangemoney.currency:OUV}")
    private String currency;

    @Value("${orangemoney.payment.timeout.minutes:10}")
    private int paymentTimeoutMinutes;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public String getTokenUrl() {
        return format("{0}/oauth/v3/token", baseUrl);
    }

    public String getWebPaymentUrl() {
        return format("{0}/orange-money-webpay/{1}/v1/webpayment", baseUrl, countryCode);
    }

    public String getTransactionStatusUrl() {
        return format("{0}/orange-money-webpay/{1}/v1/transactionstatus", baseUrl, countryCode);
    }

    public String getNotificationUrl() {
        return format("{0}/api/payments/orangemoney/callback", frontendUrl);
    }

    public String getStatusUrl(String path, PaymentTransactionStatusEnum status) {
        if (status == null)
            return format("{0}{1}", frontendUrl, path);

        return format("{0}{1}?status={2}", frontendUrl, path, status);
    }
}
