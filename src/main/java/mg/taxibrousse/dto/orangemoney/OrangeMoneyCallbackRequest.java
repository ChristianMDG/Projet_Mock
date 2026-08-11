package mg.taxibrousse.dto.orangemoney;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Orange Money WebPay callback/notification DTO.
 * <p>
 * Received on notif_url when payment reaches terminal status (SUCCESS, FAILED, EXPIRED).
 * The notifToken must be verified against the stored value to ensure authenticity.
 * </p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrangeMoneyCallbackRequest {

    @NotBlank(message = "Status is required")
    private String status;

    @JsonProperty("txnid")
    private String txnId;

    private boolean success;

    private boolean failed;

    @NotBlank(message = "Notification token is required")
    @JsonProperty("notif_token")
    private String notifToken;

    /**
     * Check if notification is for successful payment.
     *
     * @return true if status contains SUCCESS
     */
    public boolean isSuccess() {
        return "SUCCESS".equals(status);
    }

    /**
     * Check if notification is for failed payment.
     *
     * @return true if status contains FAILED or EXPIRED
     */
    public boolean isFailed() {
        return "FAILED".equals(status) || "EXPIRED".equals(status);
    }
}
