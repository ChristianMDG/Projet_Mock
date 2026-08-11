import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserStatistics, fetchVoyageurs, toggleVoyageurStatus } from '@/api/user-statistics.api';

export const userStatisticsKeys = {
  all: ['user-statistics'] as const,
  stats: () => [...userStatisticsKeys.all, 'stats'] as const,
  voyageurs: (page: number, size: number, search?: string, isActive?: boolean) =>
    [...userStatisticsKeys.all, 'voyageurs', page, size, search, isActive] as const,
};

export const useUserStatistics = () => {
  return useQuery({
    queryKey: userStatisticsKeys.stats(),
    queryFn: fetchUserStatistics,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time data
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
