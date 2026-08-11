import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/api/dashboard.api';

export const dashboardKeys = {
  stats: ['dashboard', 'stats'] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
