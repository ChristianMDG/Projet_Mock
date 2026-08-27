package mg.taxibrousse.dto.shop;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request DTO for individual order items within an order.
 *
 * <p>
 * Represents a single product in the cart/order with:
 * <ul>
 * <li>Product reference (ID)</li>
 * <li>Product snapshot data (name, SKU) - preserved at purchase time</li>
 * <li>Quantity ordered</li>
 * <li>Pricing information (unit price and calculated line total)</li>
 * </ul>
 *
 * <p>
 * Product details are denormalized (stored separately) to preserve
 * the exact product state at time of purchase, even if the product
 * is later modified or deleted.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {

    /**
     * Product ID reference.
     * Required. Links to the ProductEntity.
     */
    @NotNull(message = "{shop_product_id_required}")
    private Long productId;

    /**
     * Optional product variant ID (for products with size, color, etc. variants).
     */
    private Long variantId;

    /**
     * Product name at time of purchase.
     * Required. Denormalized for historical accuracy.
     */
    @NotBlank(message = "{shop_product_name_required}")
    private String productName;

    /**
     * Product SKU (Stock Keeping Unit) at time of purchase.
     * Required. Denormalized for historical accuracy and inventory tracking.
     */
    @NotBlank(message = "{shop_product_sku_required}")
    private String productSku;

    /**
     * Quantity ordered.
     * Required, must be at least 1.
     */
    @NotNull(message = "{shop_quantity_required}")
    @Min(value = 1, message = "{shop_quantity_must_be_at_least_one}")
    private Integer quantity;

    /**
     * Unit price at time of purchase.
     * Required, must be positive.
     * Denormalized to preserve exact pricing at purchase time.
     */
    @NotNull(message = "{shop_unit_price_required}")
    @DecimalMin(value = "0.01", message = "{shop_unit_price_must_be_positive}")
    private BigDecimal unitPrice;

    /**
     * Line total (quantity × unit price).
     * Required, must be positive.
     * Should be calculated on client side and validated on server.
     */
    @NotNull(message = "{shop_line_total_required}")
    @DecimalMin(value = "0.01", message = "{shop_line_total_must_be_positive}")
    private BigDecimal lineTotal;

    /**
     * Optional notes specific to this item (e.g., "Gift wrap", "Extra packaging").
     */
    private String notes;
}
