package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IFinanceController;
import mg.taxibrousse.dto.accounting.CommissionBreakdownStats;
import mg.taxibrousse.dto.accounting.FinanceChartsStats;
import mg.taxibrousse.dto.accounting.FinanceKpiStats;
import mg.taxibrousse.dto.accounting.FinanceStatsRequest;
import mg.taxibrousse.dto.accounting.FinanceSummaryStats;
import mg.taxibrousse.dto.accounting.MonthlyFinanceTrend;
import mg.taxibrousse.services.IFinanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FinanceController implements IFinanceController {

    private final IFinanceService financeService;

    @Override
    public ResponseEntity<FinanceKpiStats> getFinanceKpi(FinanceStatsRequest request) {
        return ResponseEntity.ok(financeService.getFinanceKpi(request));
    }

    @Override
    public ResponseEntity<CommissionBreakdownStats> getCommissionBreakdown(FinanceStatsRequest request) {
        return ResponseEntity.ok(financeService.getCommissionBreakdown(request));
    }

    @Override
    public ResponseEntity<List<MonthlyFinanceTrend>> getFinanceTrend(FinanceStatsRequest request) {
        return ResponseEntity.ok(financeService.getFinanceTrend(request));
    }

    @Override
    public ResponseEntity<FinanceChartsStats> getFinanceCharts(FinanceStatsRequest request) {
        return ResponseEntity.ok(financeService.getFinanceCharts(request));
    }

    @Override
    public ResponseEntity<FinanceSummaryStats> getFinanceSummary(FinanceStatsRequest request) {
        return ResponseEntity.ok(financeService.getFinanceSummary(request));
    }
}
