package mg.taxibrousse.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionValidationResponse {

    private boolean eligible;
    private String code;
    private String errorCode;
    private BigDecimal discountAmount;
    private BigDecimal newSubtotal;
}
