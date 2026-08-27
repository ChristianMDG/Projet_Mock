import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVoyages,
  getVoyageDetail,
  getVoyageDetails,
  getFilteredVoyages,
  getGroupedVoyages,
  getScheduledVoyagesByGare,
  updateVoyageStatus,
  type VoyageFilterParams,
} from '@/api/voyage.api';
import type { Voyage, VoyageStatusEnum } from '@/types/voyage.types';

export const voyageKeys = {
  all: ['voyages'] as const,
  lists: () => [...voyageKeys.all, 'list'] as const,
  list: (page: number) => [...voyageKeys.lists(), page] as const,
  filtered: (params: VoyageFilterParams) => [...voyageKeys.all, 'filtered', params] as const,
  grouped: (params: VoyageFilterParams) => [...voyageKeys.all, 'grouped', params] as const,
  details: () => [...voyageKeys.all, 'detail'] as const,
  detail: (id: number) => [...voyageKeys.details(), id] as const,
  rich: (id: number) => [...voyageKeys.all, 'rich', id] as const,
  byGare: (gareId: number) => [...voyageKeys.all, 'gare', gareId] as const,
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

export const useVoyageDetails = (id: number | null) => {
  const safeId = id ?? 0;
  return useQuery({
    queryKey: voyageKeys.rich(safeId),
    queryFn: () => getVoyageDetails(safeId),
    enabled: safeId > 0,
  });
};

export const useFilteredVoyages = (params: VoyageFilterParams, enabled = true) => {
  return useQuery({
    queryKey: voyageKeys.filtered(params),
    queryFn: () => getFilteredVoyages(params),
    staleTime: 1000 * 60,
    enabled,
  });
};

export const useGroupedVoyages = (params: VoyageFilterParams, enabled = true) => {
  return useQuery({
    queryKey: voyageKeys.grouped(params),
    queryFn: () => getGroupedVoyages(params),
    staleTime: 1000 * 60,
    enabled,
  });
};

export const useScheduledVoyagesByGare = (gareId: number | null) => {
  const safeId = gareId ?? 0;
  return useQuery({
    queryKey: voyageKeys.byGare(safeId),
    queryFn: () => getScheduledVoyagesByGare(safeId),
    enabled: safeId > 0,
    staleTime: 1000 * 60,
  });
};

export const useUpdateVoyageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ voyage, status }: { voyage: Voyage; status: VoyageStatusEnum }) =>
      updateVoyageStatus(voyage.id, status, voyage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voyageKeys.all });
    },
  });
};
