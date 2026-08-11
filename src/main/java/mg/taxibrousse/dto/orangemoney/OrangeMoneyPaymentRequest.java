package mg.taxibrousse.dto.orangemoney;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import mg.taxibrousse.config.OrangeMoneyApiConfig;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;

import java.text.MessageFormat;

/**
 * Orange Money WebPay payment initiation request.
 * <p>
 * Used to create a payment session and obtain a payment URL.
 * </p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrangeMoneyPaymentRequest {

    @JsonProperty("merchant_key")
    private String merchantKey;

    @JsonProperty("amount")
    private String amount;

    @Builder.Default
    @JsonProperty("currency")
    private String currency = "MGA";

    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("return_url")
    private String returnUrl;

    @JsonProperty("cancel_url")
    private String cancelUrl;

    @JsonProperty("notif_url")
    private String notifUrl;

    @JsonProperty("reference")
    private String reference;

    public static OrangeMoneyPaymentRequest fromPayment(PaymentRequest request, OrangeMoneyApiConfig config, String orderId) {
        String notifUrl = MessageFormat.format("{0}?order_id={1}", config.getNotificationUrl(), orderId);
        String reference = MessageFormat.format("{0} - Reservation {1}", config.getMerchantName(), request.getReservationId());
        String returnUrl = config.getStatusUrl(request.getReturnUrl(), null);
        String cancelUrl = config.getStatusUrl(request.getReturnUrl(), PaymentTransactionStatusEnum.CANCELLED);

        return OrangeMoneyPaymentRequest.builder()
                .merchantKey(config.getMerchantKey())
                .amount(request.getAmount().stripTrailingZeros().toPlainString())
                .currency(config.getCurrency())
                .orderId(orderId)
                .notifUrl(notifUrl)
                .returnUrl(returnUrl)
                .cancelUrl(cancelUrl)
                .reference(reference)
                .build();
    }
}
