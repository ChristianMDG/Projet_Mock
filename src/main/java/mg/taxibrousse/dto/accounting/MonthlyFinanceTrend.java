package mg.taxibrousse.dto.accounting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyFinanceTrend {
    private String period;
    private Double totalAmountCollected;
    private Double commissionBrute;
    private Double totalCosts;
    private Double commissionNette;
    private Long totalTransactions;
}
