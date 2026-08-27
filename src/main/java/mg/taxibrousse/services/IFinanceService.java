package mg.taxibrousse.services;

import mg.taxibrousse.dto.accounting.CommissionBreakdownStats;
import mg.taxibrousse.dto.accounting.FinanceChartsStats;
import mg.taxibrousse.dto.accounting.FinanceKpiStats;
import mg.taxibrousse.dto.accounting.FinanceStatsRequest;
import mg.taxibrousse.dto.accounting.FinanceSummaryStats;
import mg.taxibrousse.dto.accounting.MonthlyFinanceTrend;

import java.util.List;

public interface IFinanceService {

    FinanceKpiStats getFinanceKpi(FinanceStatsRequest request);

    CommissionBreakdownStats getCommissionBreakdown(FinanceStatsRequest request);

    List<MonthlyFinanceTrend> getFinanceTrend(FinanceStatsRequest request);

    FinanceChartsStats getFinanceCharts(FinanceStatsRequest request);

    FinanceSummaryStats getFinanceSummary(FinanceStatsRequest request);
}
