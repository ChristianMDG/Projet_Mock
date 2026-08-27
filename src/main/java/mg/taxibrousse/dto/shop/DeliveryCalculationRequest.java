package mg.taxibrousse.dto.shop;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;

import java.math.BigDecimal;

@Getter
@Setter
public class DeliveryCalculationRequest {

    private Long villeId;

    private Long fokotanyId;

    @NotNull
    @PositiveOrZero
    private BigDecimal weight;

    @NotNull
    private DeliveryMethodEnum method;
}
