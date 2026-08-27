import api from './axios';

export interface FinanceStatsParams {
  from?: string;
  to?: string;
}

export interface FinanceKpiStats {
  commissionNette: number;
  commissionIsPositive: boolean;
  totalAmountCollected: number;
  totalTransactions: number;
  successfulTransactions: number;
  successRate: number;
  totalPassagers: number;
}

export interface CommissionBreakdownStats {
  totalFraisTotal: number;
  commissionNette: number;
  commissionIsPositive: boolean;
  totalFraisTransaction: number;
  totalFraisKoperative: number;
  totalFraisRetrait: number;
  totalFraisTransfert: number;
  totalCommissionSeats: number;
  totalCommissionFee: number;
  totalCosts: number;
}

export interface MonthlyFinanceTrend {
  period: string; // e.g. "Aug 2026"
  totalAmountCollected: number;
  commissionBrute: number;
  totalCosts: number;
  commissionNette: number;
  totalTransactions: number;
}

export interface FinanceChartsStats {
  operatorBreakdown: Record<string, number>;
  paymentStatusDistribution: Record<string, number>;
}

export interface FinanceSummaryStats {
  totalAmountCollected: number;
  totalFraisTotal: number;
  commissionNette: number;
  commissionIsPositive: boolean;
  totalFraisTransaction: number;
  totalFraisKoperative: number;
  totalFraisRetrait: number;
  totalFraisTransfert: number;
  totalCommissionSeats: number;
  totalCommissionFee: number;
  totalCosts: number;
  totalTransactions: number;
  successfulTransactions: number;
  successRate: number;
  totalPassagers: number;
  monthlyTrend: MonthlyFinanceTrend[];
}

export const getFinanceKpi = async (params?: FinanceStatsParams): Promise<FinanceKpiStats> => {
  const { data } = await api.get<FinanceKpiStats>('/finance/stats/kpi', { params });
  return data;
};

export const getCommissionBreakdown = async (params?: FinanceStatsParams): Promise<CommissionBreakdownStats> => {
  const { data } = await api.get<CommissionBreakdownStats>('/finance/stats/commission-breakdown', { params });
  return data;
};

export const getFinanceTrend = async (params?: FinanceStatsParams): Promise<MonthlyFinanceTrend[]> => {
  const { data } = await api.get<MonthlyFinanceTrend[]>('/finance/stats/trend', { params });
  return data;
};

export const getFinanceCharts = async (params?: FinanceStatsParams): Promise<FinanceChartsStats> => {
  const { data } = await api.get<FinanceChartsStats>('/finance/stats/charts', { params });
  return data;
};

export const getFinanceSummary = async (params?: FinanceStatsParams): Promise<FinanceSummaryStats> => {
  const { data } = await api.get<FinanceSummaryStats>('/finance/stats/summary', { params });
  return data;
};
