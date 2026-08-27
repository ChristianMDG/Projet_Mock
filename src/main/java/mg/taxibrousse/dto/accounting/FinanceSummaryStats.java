package mg.taxibrousse.dto.accounting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceSummaryStats {
    private Double totalAmountCollected;
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
    private Long totalTransactions;
    private Long successfulTransactions;
    private Double successRate;
    private Long totalPassagers;
    private List<MonthlyFinanceTrend> monthlyTrend;
}
