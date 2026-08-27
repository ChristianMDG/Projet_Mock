package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.dto.accounting.CommissionBreakdownStats;
import mg.taxibrousse.dto.accounting.FinanceChartsStats;
import mg.taxibrousse.dto.accounting.FinanceKpiStats;
import mg.taxibrousse.dto.accounting.FinanceSummaryStats;
import mg.taxibrousse.dto.accounting.MonthlyFinanceTrend;
import mg.taxibrousse.dto.accounting.FinanceStatsRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IFinanceController {

    @GetMapping("/stats/kpi")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<FinanceKpiStats> getFinanceKpi(@Valid @ModelAttribute FinanceStatsRequest request);

    @GetMapping("/stats/commission-breakdown")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<CommissionBreakdownStats> getCommissionBreakdown(@Valid @ModelAttribute FinanceStatsRequest request);

    @GetMapping("/stats/trend")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<List<MonthlyFinanceTrend>> getFinanceTrend(@Valid @ModelAttribute FinanceStatsRequest request);

    @GetMapping("/stats/charts")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<FinanceChartsStats> getFinanceCharts(@Valid @ModelAttribute FinanceStatsRequest request);

    @GetMapping("/stats/summary")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<FinanceSummaryStats> getFinanceSummary(@Valid @ModelAttribute FinanceStatsRequest request);
}
