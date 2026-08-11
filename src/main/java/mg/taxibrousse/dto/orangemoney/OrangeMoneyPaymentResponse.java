package mg.taxibrousse.dto.orangemoney;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.http.HttpStatus;

/**
 * Orange Money WebPay payment initiation response.
 * <p>
 * Contains payment URL and tokens for tracking the transaction.
 * </p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrangeMoneyPaymentResponse {

    @JsonProperty("status")
    private int status;

    @JsonProperty("message")
    private String message;

    @JsonProperty("payment_url")
    private String paymentUrl;

    @JsonProperty("pay_token")
    private String payToken;

    @JsonProperty("txn_id")
    private String txnId;

    @JsonProperty("notif_token")
    private String notifToken;

    @JsonProperty("error_code")
    private String errorCode;

    public boolean isCreated() {
        return status == HttpStatus.CREATED.value();
    }
}
