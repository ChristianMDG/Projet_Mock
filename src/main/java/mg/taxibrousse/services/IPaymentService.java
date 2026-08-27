package mg.taxibrousse.services;

import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.shop.OrderPaymentRequest;
import mg.taxibrousse.dto.shop.PaymentInitiationResponse;
import mg.taxibrousse.exceptions.PaymentConfirmationException;
import mg.taxibrousse.exceptions.PaymentFailureException;
import mg.taxibrousse.exceptions.PaymentInitiationException;
import mg.taxibrousse.exceptions.PaymentStatusCheckException;
import mg.taxibrousse.models.PaymentTransaction;

import java.io.IOException;

/**
 * Service interface for payment operations.
 *
 * <p>
 * Supports three mobile money operators:
 * <ul>
 * <li>MVola - Phone prefix 034</li>
 * <li>Airtel Money - Phone prefix 033</li>
 * <li>Orange Money - Phone prefix 032</li>
 * </ul>
 *
 * <p>
 * Payment flow:
 * <ol>
 * <li>Initiate payment via {@link #initiateOrderPayment(Long, OrderPaymentRequest)}</li>
 * <li>Poll status via {@link #checkPaymentStatus(String)}</li>
 * <li>Confirm or fail via {@link #confirmPayment(String)} or {@link #failPayment(String, String)}</li>
 * </ol>
 */
public interface IPaymentService {

    /**
     * Initiates a generic payment transaction.
     *
     * @param request payment request with payable details
     * @return payment transaction with status and reference
     * @throws IOException if network communication fails
     * @throws InterruptedException if operation is interrupted
     */
    PaymentTransaction initPayment(PaymentRequest request) throws IOException, InterruptedException;

    /**
     * Retrieves payment transaction status without updating it.
     *
     * @param transactionReference unique transaction identifier
     * @return current payment transaction state
     */
    PaymentTransaction getPaymentStatus(String transactionReference);

    /**
     * Checks payment status with payment operator and updates transaction.
     *
     * @param transactionReference unique transaction identifier
     * @return updated payment transaction
     * @throws IOException if network communication fails
     * @throws InterruptedException if operation is interrupted
     */
    PaymentTransaction checkAndUpdateTransactionStatus(String transactionReference) throws IOException, InterruptedException;

    /**
     * Initiates payment for a shop order.
     *
     * <p>
     * Dispatches to appropriate operator based on phone number prefix:
     * <ul>
     * <li>034 → MVola</li>
     * <li>033 → Airtel Money</li>
     * <li>032 → Orange Money</li>
     * </ul>
     *
     * <p>
     * Returns {@link PaymentInitiationResponse} with:
     * <ul>
     * <li>{@code transactionReference} - Always present for status tracking</li>
     * <li>{@code paymentUrl} - Optional redirect URL for external payment flows</li>
     * <li>{@code status} - Initial payment status (INITIATED, PENDING, etc.)</li>
     * <li>{@code operatorName} - Payment operator name for UI branding</li>
     * </ul>
     *
     * @param orderId shop order ID to initiate payment for
     * @param request payment request with phone number and payment method
     * @return payment initiation response with transaction reference and optional payment URL
     * @throws PaymentInitiationException if payment initiation fails
     * @throws IOException if network communication fails
     * @throws InterruptedException if operation is interrupted
     */
    PaymentInitiationResponse initiateOrderPayment(Long orderId, OrderPaymentRequest request) throws PaymentInitiationException, IOException, InterruptedException;

    /**
     * Checks payment status for real-time tracking.
     *
     * <p>
     * Frontend polls this endpoint every 3 seconds during payment status tracking.
     * Updates transaction status based on payment operator response.
     *
     * @param transactionReference unique transaction identifier
     * @return updated payment transaction with current status
     * @throws PaymentStatusCheckException if status check fails
     * @throws IOException if network communication fails
     * @throws InterruptedException if operation is interrupted
     */
    PaymentTransaction checkPaymentStatus(String transactionReference) throws PaymentStatusCheckException, IOException, InterruptedException;

    /**
     * Confirms a successful payment transaction.
     *
     * <p>
     * Transitions transaction to COMPLETED status and triggers:
     * <ul>
     * <li>Order status update to CONFIRMED</li>
     * <li>Inventory deduction for order items</li>
     * <li>Payment notification broadcast via WebSocket</li>
     * </ul>
     *
     * @param transactionReference unique transaction identifier
     * @throws PaymentConfirmationException if confirmation fails or transaction already terminal
     */
    void confirmPayment(String transactionReference) throws PaymentConfirmationException;

    /**
     * Marks a payment transaction as failed.
     *
     * <p>
     * Transitions transaction to FAILED status and triggers:
     * <ul>
     * <li>Order status update to PAYMENT_FAILED</li>
     * <li>Failure reason storage for audit trail</li>
     * <li>Payment notification broadcast via WebSocket</li>
     * </ul>
     *
     * @param transactionReference unique transaction identifier
     * @param reason optional failure reason (e.g., "Insufficient balance", "User cancelled")
     * @throws PaymentFailureException if failure marking fails or transaction already terminal
     */
    void failPayment(String transactionReference, String reason) throws PaymentFailureException;
}
