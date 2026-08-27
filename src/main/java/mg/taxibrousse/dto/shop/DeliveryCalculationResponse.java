package mg.taxibrousse.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryCalculationResponse {

    private Long zoneId;
    private String zoneName;
    private DeliveryMethodEnum method;
    private BigDecimal baseFee;
    private BigDecimal perKgFee;
    private BigDecimal totalFee;
    private Integer estimatedDaysMin;
    private Integer estimatedDaysMax;
}
