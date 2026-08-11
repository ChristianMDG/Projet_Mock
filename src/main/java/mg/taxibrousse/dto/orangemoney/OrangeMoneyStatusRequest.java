package mg.taxibrousse.dto.orangemoney;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * Orange Money transaction status check request.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrangeMoneyStatusRequest {

    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("amount")
    private String amount;

    @JsonProperty("pay_token")
    private String payToken;
}
