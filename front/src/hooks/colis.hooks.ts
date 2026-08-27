import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createColis,
  updateColis,
  deleteColis,
  getColisList,
  getColis,
  getColisByKoperative,
  getColisByVoyage,
  findFilteredColis,
} from '@/api/colis.api';
import { Colis } from '@/types';

const CACHE_TIMES = {
  COLIS_LIST: 5 * 60 * 1000,
  COLIS_FILTER: 3 * 60 * 1000,
} as const;

export const colisKeys = {
  all: ['colis'] as const,
  lists: () => [...colisKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...colisKeys.lists(), filters] as const,
  details: () => [...colisKeys.all, 'detail'] as const,
  detail: (id: number) => [...colisKeys.details(), id] as const,
  koperative: (id: number) => [...colisKeys.all, 'koperative', id] as const,
  voyage: (id: number) => [...colisKeys.all, 'voyage', id] as const,
  filtered: (filters: Record<string, unknown>) => [...colisKeys.all, 'filtered', filters] as const,
};

// Fetch paginated colis
export function useColis(page = 0, size = 20) {
  return useQuery<
    {
      content: Colis[];
      totalElements: number;
      totalPages: number;
    },
    Error
  >({
    queryKey: colisKeys.list({ page, size }),
    queryFn: () => getColisList(page, size),
    staleTime: CACHE_TIMES.COLIS_LIST,
  });
}

// Fetch colis by koperative
export function useColisByKoperative(koperativeId: number) {
  return useQuery<Colis[], Error>({
    queryKey: colisKeys.koperative(koperativeId),
    queryFn: () => getColisByKoperative(koperativeId),
    enabled: !!koperativeId,
    staleTime: CACHE_TIMES.COLIS_LIST,
  });
}

// Fetch colis by voyage
export function useColisByVoyage(voyageId: number) {
  return useQuery<Colis[], Error>({
    queryKey: colisKeys.voyage(voyageId),
    queryFn: () => getColisByVoyage(voyageId),
    enabled: !!voyageId,
    staleTime: CACHE_TIMES.COLIS_LIST,
  });
}

// Fetch single colis by ID
export function useColisDetail(id: number) {
  return useQuery<Colis, Error>({
    queryKey: colisKeys.detail(id),
    queryFn: () => getColis(id),
    enabled: !!id,
    staleTime: CACHE_TIMES.COLIS_LIST,
  });
}

// Filtered colis
export function useFilteredColis(filters: Record<string, unknown>) {
  return useQuery<Colis[], Error>({
    queryKey: colisKeys.filtered(filters),
    queryFn: () => findFilteredColis(filters),
    enabled: Object.keys(filters).length > 0,
    staleTime: CACHE_TIMES.COLIS_FILTER,
    placeholderData: keepPreviousData,
  });
}

// Create Colis
export function useCreateColis() {
  const queryClient = useQueryClient();
  return useMutation<Colis, Error, Partial<Colis>>({
    mutationFn: createColis,
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: colisKeys.all });
      if (data.crafter?.id) {
        await queryClient.invalidateQueries({
          queryKey: colisKeys.koperative(data.crafter.id),
        });
      }
      queryClient.setQueryData(colisKeys.detail(data.id!), data);
    },
    onError: error => {
      console.error('❌ Error creating colis:', error);
    },
  });
}

// Update Colis
export function useUpdateColis() {
  const queryClient = useQueryClient();
  return useMutation<Colis, Error, { id: number; colis: Partial<Colis> }>({
    mutationFn: ({ id, colis }) => updateColis(id, colis),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: colisKeys.all });
      queryClient.setQueryData(colisKeys.detail(data.id!), data);
      if (data.crafter?.id) {
        await queryClient.invalidateQueries({
          queryKey: colisKeys.koperative(data.crafter.id),
        });
      }
    },
    onError: error => {
      console.error('❌ Error updating colis:', error);
    },
  });
}

// Delete Colis
export function useDeleteColis() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteColis,
    onSuccess: async (_, colisId) => {
      queryClient.removeQueries({ queryKey: colisKeys.detail(colisId) });
      await queryClient.invalidateQueries({ queryKey: colisKeys.lists() });
    },
    onError: error => {
      console.error('❌ Error deleting colis:', error);
    },
  });
}
