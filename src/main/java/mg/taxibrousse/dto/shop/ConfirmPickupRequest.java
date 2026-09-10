package mg.taxibrousse.dto.shop;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ConfirmPickupRequest(
        @NotBlank(message = "error_pickup_code_required")
        @Pattern(regexp = "^\\d{6}$", message = "error_invalid_pickup_code_format")
        String code
) {
}
