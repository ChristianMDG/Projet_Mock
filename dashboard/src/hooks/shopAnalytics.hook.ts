import { useQuery } from '@tanstack/react-query';
import {
  getCustomerPatterns,
  getOrderStatusDistribution,
  getRevenue,
  getTopProducts,
  type AnalyticsDateRange,
} from '@/api/shopAnalytics.api';
import type { AnalyticsGranularity } from '@/types/shop.types';

export const shopAnalyticsKeys = {
  all: ['shop', 'analytics'] as const,
  revenue: (r: AnalyticsDateRange, g: AnalyticsGranularity) => [...shopAnalyticsKeys.all, 'revenue', r, g] as const,
  topProducts: (r: AnalyticsDateRange) => [...shopAnalyticsKeys.all, 'top-products', r] as const,
  orderStatus: (r: AnalyticsDateRange) => [...shopAnalyticsKeys.all, 'order-status', r] as const,
  customerPatterns: (r: AnalyticsDateRange) => [...shopAnalyticsKeys.all, 'customer-patterns', r] as const,
};

export const useRevenue = (range: AnalyticsDateRange, granularity: AnalyticsGranularity) =>
  useQuery({
    queryKey: shopAnalyticsKeys.revenue(range, granularity),
    queryFn: () => getRevenue(range, granularity),
    enabled: Boolean(range.from && range.to),
  });

export const useTopProducts = (range: AnalyticsDateRange) =>
  useQuery({
    queryKey: shopAnalyticsKeys.topProducts(range),
    queryFn: () => getTopProducts(range),
    enabled: Boolean(range.from && range.to),
  });

export const useOrderStatusDistribution = (range: AnalyticsDateRange) =>
  useQuery({
    queryKey: shopAnalyticsKeys.orderStatus(range),
    queryFn: () => getOrderStatusDistribution(range),
    enabled: Boolean(range.from && range.to),
  });

export const useCustomerPatterns = (range: AnalyticsDateRange) =>
  useQuery({
    queryKey: shopAnalyticsKeys.customerPatterns(range),
    queryFn: () => getCustomerPatterns(range),
    enabled: Boolean(range.from && range.to),
  });
