package mg.taxibrousse.dto.shop;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;

/**
 * Body for {@code POST /api/orders/buy-now}.
 *
 * <p>
 * Creates a single-item order without touching the cart, then immediately initiates
 * payment using the same dispatch as {@code /payment/initiate}. Authenticated users only.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyNowRequest {

    @NotNull(message = "error_product_id_required")
    private Long productId;

    private Long variantId;

    @NotNull(message = "error_quantity_required")
    @Min(value = 1, message = "error_quantity_invalid")
    private Integer quantity;

    @NotNull(message = "error_payment_method_required")
    private PaymentMethodEnum paymentMethod;

    /** Required for MOBILE_MONEY. */
    private String phoneNumber;

    private String deliveryAddress;
    private Long villeId;

    private String customerName;
    private String customerPhone;

    private DeliveryMethodEnum deliveryMethod;
}
