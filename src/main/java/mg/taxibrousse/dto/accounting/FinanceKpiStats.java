package mg.taxibrousse.dto.accounting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceKpiStats {
    private Double commissionNette;
    private Boolean commissionIsPositive;
    private Double totalAmountCollected;
    private Long totalTransactions;
    private Long successfulTransactions;
    private Double successRate;
    private Long totalPassagers;
}
