package mg.taxibrousse.dto.shop;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;

/**
 * Body for {@code POST /api/orders/{id}/payment/initiate}.
 *
 * <p>
 * Used to dispatch the payment to the right provider:
 * <ul>
 * <li>{@link PaymentMethodEnum#MOBILE_MONEY} + {@code phoneNumber} → MVola/Airtel/Orange</li>
 * </ul>
 *
 * <p>
 * Phone number must match mobile money format: 03[2-9]XXXXXXX
 * <ul>
 * <li>MVola: 034 prefix</li>
 * <li>Airtel Money: 033 prefix</li>
 * <li>Orange Money: 032 prefix</li>
 * </ul>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentRequest {

    /**
     * Mobile money phone number.
     * Must match format: 03[2-9]XXXXXXX (10 digits, starting with 032, 033, or 034).
     */
    @NotBlank(message = "{shop_phone_number_required}")
    @Pattern(regexp = "^03[2-9]\\d{7}$", message = "{shop_phone_number_invalid_format}")
    private String phoneNumber;

    /**
     * Payment method selection.
     * Currently supports MOBILE_MONEY only.
     */
    @NotNull(message = "{shop_payment_method_required}")
    private PaymentMethodEnum paymentMethod;
}
