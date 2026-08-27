package mg.taxibrousse.dto.shop;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidatePromotionRequest {

    @NotBlank
    private String code;

    private Long cartId;

    private String sessionToken;
}
