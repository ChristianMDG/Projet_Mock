package mg.taxibrousse.dto.shop;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PickupVerificationRequest {

    @NotBlank
    @Pattern(regexp = "\\d{6}", message = "Pickup code must be exactly 6 digits")
    private String code;
}