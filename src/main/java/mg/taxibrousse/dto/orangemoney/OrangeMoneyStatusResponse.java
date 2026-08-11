package mg.taxibrousse.dto.orangemoney;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * Orange Money transaction status check response.
 * <p>
 * Possible status values:
 * <ul>
 *   <li>INITIATED - waiting for user entry</li>
 *   <li>PENDING - user has clicked "Confirmer", transaction in progress</li>
 *   <li>EXPIRED - user clicked "Confirmer" too late (after token validity)</li>
 *   <li>SUCCESS - payment is done</li>
 *   <li>FAILED - payment has failed</li>
 * </ul>
 * </p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrangeMoneyStatusResponse {

    @JsonProperty("status")
    private String status;

    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("txnid")
    private String txnId;

    /**
     * Check if payment is successful.
     */
    public boolean isSuccess() {
        return "SUCCESS".equalsIgnoreCase(status);
    }

    /**
     * Check if payment is in terminal state.
     */
    public boolean isTerminal() {
        if (status == null)
            return false;
        String upperStatus = status.toUpperCase();
        return upperStatus.equals("SUCCESS") || upperStatus.equals("FAILED") || upperStatus.equals("EXPIRED");
    }

    /**
     * Check if payment is still pending.
     */
    public boolean isPending() {
        if (status == null) return false;
        String upperStatus = status.toUpperCase();
        return upperStatus.equals("INITIATED") || upperStatus.equals("PENDING");
    }
}
