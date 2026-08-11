import { useQuery } from '@tanstack/react-query';
import { getVoyages, getVoyageDetail } from '@/api/voyage.api';

export const voyageKeys = {
  all: ['voyages'] as const,
  lists: () => [...voyageKeys.all, 'list'] as const,
  list: (page: number) => [...voyageKeys.lists(), page] as const,
  details: () => [...voyageKeys.all, 'detail'] as const,
  detail: (id: number) => [...voyageKeys.details(), id] as const,
};

export const useVoyages = (page = 0, size = 20) => {
  return useQuery({
    queryKey: voyageKeys.list(page),
    queryFn: () => getVoyages(page, size),
    staleTime: 1000 * 60 * 2,
  });
};

export const useVoyageDetail = (id: number) => {
  return useQuery({
    queryKey: voyageKeys.detail(id),
    queryFn: () => getVoyageDetail(id),
    enabled: id > 0,
  });
};
