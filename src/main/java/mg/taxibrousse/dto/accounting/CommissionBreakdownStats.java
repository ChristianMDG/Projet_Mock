package mg.taxibrousse.dto.accounting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionBreakdownStats {
    private Double totalFraisTotal;
    private Double commissionNette;
    private Boolean commissionIsPositive;
    private Double totalFraisTransaction;
    private Double totalFraisKoperative;
    private Double totalFraisRetrait;
    private Double totalFraisTransfert;
    private Double totalCommissionSeats;
    private Double totalCommissionFee;
    private Double totalCosts;
}
