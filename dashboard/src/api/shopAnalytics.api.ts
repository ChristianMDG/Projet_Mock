import api from './axios';
import type {
  AnalyticsGranularity,
  CustomerPattern,
  OrderStatusDistribution,
  RevenuePoint,
  TopProduct,
} from '@/types/shop.types';

export interface AnalyticsDateRange {
  from: string;
  to: string;
}

export const getRevenue = async (
  range: AnalyticsDateRange,
  granularity: AnalyticsGranularity
): Promise<RevenuePoint[]> => {
  const { data } = await api.get<RevenuePoint[]>('/analytics/revenue', {
    params: { from: range.from, to: range.to, granularity },
  });
  return data;
};

export const getTopProducts = async (range: AnalyticsDateRange): Promise<TopProduct[]> => {
  const { data } = await api.get<TopProduct[]>('/analytics/top-products', {
    params: { from: range.from, to: range.to },
  });
  return data;
};

export const getOrderStatusDistribution = async (range: AnalyticsDateRange): Promise<OrderStatusDistribution[]> => {
  const { data } = await api.get<OrderStatusDistribution[]>('/analytics/order-status-distribution', {
    params: { from: range.from, to: range.to },
  });
  return data;
};

export const getCustomerPatterns = async (range: AnalyticsDateRange): Promise<CustomerPattern[]> => {
  const { data } = await api.get<CustomerPattern[]>('/analytics/customer-patterns', {
    params: { from: range.from, to: range.to },
  });
  return data;
};
