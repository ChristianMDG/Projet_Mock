import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserStatistics,
  fetchVoyageurs,
  toggleVoyageurStatus,
  fetchDailyConnections,
} from '@/api/user-statistics.api';

export const userStatisticsKeys = {
  all: ['user-statistics'] as const,
  stats: () => [...userStatisticsKeys.all, 'stats'] as const,
  voyageurs: (page: number, size: number, search?: string, isActive?: boolean) =>
    [...userStatisticsKeys.all, 'voyageurs', page, size, search, isActive] as const,
  dailyConnections: (days: number) => [...userStatisticsKeys.all, 'daily-connections', days] as const,
};

export const useUserStatistics = () => {
  return useQuery({
    queryKey: userStatisticsKeys.stats(),
    queryFn: fetchUserStatistics,
    refetchInterval: 5000,
  });
};

export const useVoyageurs = (page = 0, size = 20, search?: string, isActive?: boolean) => {
  return useQuery({
    queryKey: userStatisticsKeys.voyageurs(page, size, search, isActive),
    queryFn: () => fetchVoyageurs(page, size, search, isActive),
    staleTime: 30000,
    retry: 1,
  });
};

export const useToggleVoyageurStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleVoyageurStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userStatisticsKeys.all });
    },
  });
};

export const useDailyConnections = (days: number) => {
  return useQuery({
    queryKey: userStatisticsKeys.dailyConnections(days),
    queryFn: () => fetchDailyConnections(days),
    staleTime: 60_000,
  });
};
