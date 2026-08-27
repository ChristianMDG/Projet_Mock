import { useQuery } from '@tanstack/react-query';
import {
  getFinanceKpi,
  getCommissionBreakdown,
  getFinanceTrend,
  getFinanceCharts,
  getFinanceSummary,
  type FinanceStatsParams,
} from '@/api/finance.api';

export const financeKeys = {
  all: ['finance'] as const,
  kpi: (params: FinanceStatsParams) => [...financeKeys.all, 'kpi', params] as const,
  commissionBreakdown: (params: FinanceStatsParams) => [...financeKeys.all, 'commissionBreakdown', params] as const,
  trend: (params: FinanceStatsParams) => [...financeKeys.all, 'trend', params] as const,
  charts: (params: FinanceStatsParams) => [...financeKeys.all, 'charts', params] as const,
  summary: (params: FinanceStatsParams) => [...financeKeys.all, 'summary', params] as const,
};

export const useFinanceKpi = (params: FinanceStatsParams) =>
  useQuery({
    queryKey: financeKeys.kpi(params),
    queryFn: () => getFinanceKpi(params),
  });

export const useCommissionBreakdown = (params: FinanceStatsParams) =>
  useQuery({
    queryKey: financeKeys.commissionBreakdown(params),
    queryFn: () => getCommissionBreakdown(params),
  });

export const useFinanceTrend = (params: FinanceStatsParams) =>
  useQuery({
    queryKey: financeKeys.trend(params),
    queryFn: () => getFinanceTrend(params),
  });

export const useFinanceCharts = (params: FinanceStatsParams) =>
  useQuery({
    queryKey: financeKeys.charts(params),
    queryFn: () => getFinanceCharts(params),
  });

export const useFinanceSummary = (params: FinanceStatsParams) =>
  useQuery({
    queryKey: financeKeys.summary(params),
    queryFn: () => getFinanceSummary(params),
  });
