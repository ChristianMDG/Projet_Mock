package mg.taxibrousse.dto.shop;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request DTO for creating a new order.
 *
 * <p>
 * Used by {@code POST /api/orders} endpoint to create orders with multiple items.
 *
 * <p>
 * Contains:
 * <ul>
 * <li>Customer information (name, phone, delivery address)</li>
 * <li>Delivery destination (ville/city ID)</li>
 * <li>Order items with product details and quantities</li>
 * <li>Financial calculations (subtotal, shipping, tax, total)</li>
 * <li>Payment and delivery method selections</li>
 * </ul>
 *
 * <p>
 * All fields are validated using JSR-303 annotations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    /**
     * Customer full name.
     * Required, max 150 characters.
     */
    @NotBlank(message = "{shop_customer_name_required}")
    private String customerName;

    /**
     * Customer phone number.
     * Required, should follow Madagascar phone format.
     */
    @NotBlank(message = "{shop_customer_phone_required}")
    @Pattern(regexp = "^0[3-9]\\d{8}$", message = "{shop_phone_number_invalid_format}")
    private String customerPhone;

    /**
     * Customer email address (optional).
     * Used for order confirmation notifications.
     */
    private String customerEmail;

    /**
     * Delivery address text.
     * Required, can be detailed street address or pickup location.
     */
    @NotBlank(message = "{shop_delivery_address_required}")
    private String deliveryAddress;

    /**
     * Delivery destination city ID.
     * Required for calculating shipping costs.
     */
    @NotNull(message = "{shop_ville_id_required}")
    private Long villeId;

    /**
     * Optional fokotany (neighborhood) ID for more precise delivery location.
     */
    private Long fokotanyId;

    /**
     * Payment method selection.
     * Required. Currently supports MOBILE_MONEY.
     */
    @NotNull(message = "{shop_payment_method_required}")
    private PaymentMethodEnum paymentMethod;

    /**
     * Delivery method selection.
     * Required. Options: STANDARD, EXPRESS, PICKUP.
     */
    @NotNull(message = "{shop_delivery_method_required}")
    private DeliveryMethodEnum deliveryMethod;

    /**
     * List of order items.
     * Required, must contain at least one item.
     */
    @NotEmpty(message = "{shop_order_items_required}")
    @Valid
    private List<OrderItemRequest> items;

    /**
     * Order subtotal (sum of all line items before shipping and tax).
     * Required, must be positive.
     */
    @NotNull(message = "{shop_subtotal_required}")
    @DecimalMin(value = "0.01", message = "{shop_subtotal_must_be_positive}")
    private BigDecimal subtotal;

    /**
     * Shipping/delivery fee.
     * Required, can be zero for pickup or free shipping promotions.
     */
    @NotNull(message = "{shop_shipping_cost_required}")
    @DecimalMin(value = "0.00", message = "{shop_shipping_cost_must_be_non_negative}")
    private BigDecimal shipping;

    /**
     * Tax amount (if applicable).
     * Optional, defaults to zero if not provided.
     */
    @DecimalMin(value = "0.00", message = "{shop_tax_must_be_non_negative}")
    private BigDecimal tax;

    /**
     * Order total (subtotal + shipping + tax - discount).
     * Required, must be positive.
     */
    @NotNull(message = "{shop_total_required}")
    @DecimalMin(value = "0.01", message = "{shop_total_must_be_positive}")
    private BigDecimal total;

    /**
     * Currency code (e.g., "MGA" for Malagasy Ariary).
     * Optional, defaults to "MGA" if not provided.
     */
    private String currency;

    /**
     * Promotion/discount code applied (optional).
     */
    private String promotionCode;

    /**
     * Discount amount from promotion (optional).
     */
    @DecimalMin(value = "0.00", message = "{shop_discount_amount_must_be_non_negative}")
    private BigDecimal discountAmount;

    /**
     * Order notes or special instructions (optional).
     */
    private String notes;
}
