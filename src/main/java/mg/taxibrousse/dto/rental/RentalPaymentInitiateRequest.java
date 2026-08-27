package mg.taxibrousse.dto.rental;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;

@Data
public class RentalPaymentInitiateRequest {

    @NotBlank(message = "{rental_phone_number_required}")
    @Pattern(regexp = "^03[2-9]\\d{7}$", message = "{rental_phone_number_invalid_format}")
    private String phoneNumber;

    @NotNull(message = "{rental_payment_method_required}")
    private PaymentMethodEnum paymentMethod;
}
