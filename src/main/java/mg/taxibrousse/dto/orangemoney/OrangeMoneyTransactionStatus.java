package mg.taxibrousse.dto.orangemoney;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * Orange Money transaction status response.
 * <p>
 * Contains current status and details of a payment transaction.
 * </p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrangeMoneyTransactionStatus {

    @JsonProperty("status")
    private String status;

    @JsonProperty("txnid")
    private String txnId;

    @JsonProperty("amount")
    private String amount;

    @JsonProperty("currency")
    private String currency;

    @JsonProperty("customer_msisdn")
    private String customerMsisdn;

    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;

    @JsonProperty("message")
    private String message;

    /**
     * Check if transaction is pending.
     *
     * @return true if status is PENDING or INITIATED
     */
    public boolean isPending() {
        return "PENDING".equalsIgnoreCase(status) || "INITIATED".equalsIgnoreCase(status);
    }

    /**
     * Check if transaction is successful.
     *
     * @return true if status is SUCCESS or COMPLETED
     */
    public boolean isSuccess() {
        return "SUCCESS".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status);
    }

    /**
     * Check if transaction failed.
     *
     * @return true if status is FAILED
     */
    public boolean isFailed() {
        return "FAILED".equalsIgnoreCase(status);
    }

    /**
     * Check if transaction was cancelled.
     *
     * @return true if status is CANCELLED
     */
    public boolean isCancelled() {
        return "CANCELLED".equalsIgnoreCase(status);
    }

    /**
     * Check if transaction expired.
     *
     * @return true if status is EXPIRED
     */
    public boolean isExpired() {
        return "EXPIRED".equalsIgnoreCase(status);
    }

    /**
     * Check if transaction reached a terminal state.
     *
     * @return true if transaction is complete, failed, cancelled, or expired
     */
    public boolean isTerminal() {
        return isSuccess() || isFailed() || isCancelled() || isExpired();
    }
}
