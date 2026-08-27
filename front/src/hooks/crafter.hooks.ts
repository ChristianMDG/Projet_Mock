import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCrafter,
  deleteCrafter,
  getActiveCrafters,
  getCrafter,
  getCraftersByKoperative,
  getCrafterSeatConfig,
  getInactiveCrafters,
  updateCrafter,
} from '@/api/crafter.api';
import { Crafter } from '@/models/Crafter';
import { CrafterConfig } from '@/types/type.props';
import config10places from '@/10places.json';
import config18places from '@/18places.json';
import config22places from '@/22places.json';
import { getConfigNameByCapacity } from '@/utils/seat.utils';

// Query Keys
export const crafterKeys = {
  all: ['crafters'] as const,
  lists: () => [...crafterKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...crafterKeys.lists(), filters] as const,
  details: () => [...crafterKeys.all, 'detail'] as const,
  detail: (id: number) => [...crafterKeys.details(), id] as const,
  byKoperative: (koperativeId: number) => [...crafterKeys.all, 'koperative', koperativeId] as const,

  active: () => [...crafterKeys.all, 'active'] as const,
  inactive: () => [...crafterKeys.all, 'inactive'] as const,
  seatConfig: (id: number) => [...crafterKeys.all, 'seat-config', id] as const,
};

// Hooks for fetching data
export function useGetCrafter(id: number) {
  return useQuery({
    queryKey: crafterKeys.detail(id),
    queryFn: () => getCrafter(id),
    enabled: !!id,
  });
}

export function useGetCraftersByKoperative(koperativeId: number) {
  return useQuery<Crafter[]>({
    queryKey: crafterKeys.byKoperative(koperativeId),
    queryFn: () => getCraftersByKoperative(koperativeId),
    enabled: !!koperativeId,
  });
}

export function useGetActiveCrafters() {
  return useQuery({
    queryKey: crafterKeys.active(),
    queryFn: getActiveCrafters,
  });
}

export function useGetInactiveCrafters() {
  return useQuery({
    queryKey: crafterKeys.inactive(),
    queryFn: getInactiveCrafters,
  });
}

// Hooks for mutations
export function useCreateCrafter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCrafter,
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: crafterKeys.all });
      if (data.koperative?.id) {
        await queryClient.invalidateQueries({ queryKey: crafterKeys.byKoperative(data.koperative.id) });
        await queryClient.invalidateQueries({ queryKey: ['koperative', data.koperative.id] });
        await queryClient.invalidateQueries({ queryKey: ['koperative', data.koperative.id, 'crafters'] });
      }
    },
  });
}

export function useUpdateCrafter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Crafter> }) => updateCrafter(id, data),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: crafterKeys.all });
      if (data.id) {
        await queryClient.invalidateQueries({ queryKey: crafterKeys.detail(data.id) });
      }
      if (data.koperative?.id) {
        await queryClient.invalidateQueries({ queryKey: crafterKeys.byKoperative(data.koperative.id) });
        await queryClient.invalidateQueries({ queryKey: ['koperative', data.koperative.id] });
        await queryClient.invalidateQueries({ queryKey: ['koperative', data.koperative.id, 'crafters'] });
      }
    },
  });
}

export function useDeleteCrafter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCrafter,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: crafterKeys.all });
    },
  });
}

export function useDeleteCrafterByKoperative(koperativeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCrafter,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: crafterKeys.all });
      await queryClient.invalidateQueries({ queryKey: crafterKeys.byKoperative(koperativeId) });
      await queryClient.invalidateQueries({ queryKey: ['koperative', koperativeId] });
      await queryClient.invalidateQueries({ queryKey: ['koperative', koperativeId, 'crafters'] });
    },
  });
}

export function useCrafterConfig(crafter?: Crafter) {
  const configMap: Record<string, CrafterConfig> = {
    '10places.json': config10places as CrafterConfig,
    '18places.json': config18places as CrafterConfig,
    '22places.json': config22places as CrafterConfig,
  };

  const queryKey = crafter?.id
    ? ['crafter-config', crafter.id]
    : ['crafter-preview-config', crafter?.configName, crafter?.seatCapacity];

  return useQuery({
    queryKey,
    queryFn: async (): Promise<CrafterConfig> => {
      if (crafter?.id) {
        const apiConfig = await getCrafterSeatConfig(crafter.id);
        if (apiConfig) return apiConfig;
      }

      const fileName = getConfigNameByCapacity(crafter?.seatCapacity ?? 0);
      return configMap[fileName ?? '18places.json'];
    },
    enabled: Boolean(crafter),
  });
}
