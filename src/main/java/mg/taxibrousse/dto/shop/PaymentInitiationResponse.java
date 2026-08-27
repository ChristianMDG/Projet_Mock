package mg.taxibrousse.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;

/**
 * Response DTO for payment initiation operations.
 *
 * <p>
 * Returned by {@code POST /api/orders/{id}/payment/initiate} and similar endpoints.
 *
 * <p>
 * Contains:
 * <ul>
 * <li>{@code transactionReference} - Unique identifier for tracking payment status</li>
 * <li>{@code paymentUrl} - Optional redirect URL for external payment flows (e.g., PayPal)</li>
 * <li>{@code status} - Current status of the payment transaction</li>
 * <li>{@code operatorName} - Name of the payment operator (MVola, Airtel, Orange, etc.)</li>
 * </ul>
 *
 * <p>
 * Three mobile money operators are supported:
 * <ul>
 * <li>MVola - Phone prefix 034</li>
 * <li>Airtel Money - Phone prefix 033</li>
 * <li>Orange Money - Phone prefix 032</li>
 * </ul>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInitiationResponse {

    /**
     * Unique transaction reference for status tracking.
     * Used by frontend to poll payment status via {@code GET /api/payments/status/{transactionReference}}.
     */
    private String transactionReference;

    /**
     * Optional payment URL for external payment flows.
     * When present, frontend should redirect to this URL.
     * When null, frontend should display payment status tracker component.
     */
    private String paymentUrl;

    /**
     * Current payment transaction status.
     * Initial status is typically INITIATED or PENDING.
     */
    private PaymentTransactionStatusEnum status;

    /**
     * Payment operator name (e.g., "MVola", "Airtel Money", "Orange Money").
     * Used by frontend to display operator-specific branding and colors.
     */
    private String operatorName;
}
