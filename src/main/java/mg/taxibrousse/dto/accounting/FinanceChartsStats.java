package mg.taxibrousse.dto.accounting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceChartsStats {
    private Map<String, Double> operatorBreakdown;
    private Map<String, Long> paymentStatusDistribution;
}
