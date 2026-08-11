import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createGuichet,
  deleteGuichet,
  getGuichetByGareAndKoperative,
  getGuichetDestinations,
  updateGuichet,
  updateGuichetDestinations,
} from '@/api/guichet.api';
import { Guichet } from '@/models/Guichet';
import { Gare } from '@/models/Gare';

export function useCreateGuichet(koperativeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guichet: Partial<Guichet>) => createGuichet({ ...guichet, koperative: { id: koperativeId } }),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: ['koperative', koperativeId] });
      await queryClient.invalidateQueries({ queryKey: ['koperative', koperativeId, 'guichets'] });
      await queryClient.invalidateQueries({ queryKey: ['gare', data?.gare?.id] });
    },
  });
}

export function useUpdateGuichet(koperativeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, guichet }: { id: number; guichet: Partial<Guichet> }) => updateGuichet(id, guichet),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: ['koperative', koperativeId] });
      await queryClient.invalidateQueries({ queryKey: ['koperative', koperativeId, 'guichets'] });
      await queryClient.invalidateQueries({ queryKey: ['gare', data?.gare?.id] });
    },
  });
}

export function useDeleteGuichet(koperativeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guichet: Guichet) => deleteGuichet(guichet.id!),
    onSuccess: async (_, guichet) => {
      await queryClient.invalidateQueries({ queryKey: ['koperative', koperativeId] });
      await queryClient.invalidateQueries({ queryKey: ['koperative', koperativeId, 'guichets'] });
      await queryClient.invalidateQueries({ queryKey: ['gare', guichet?.gare?.id] });
    },
  });
}

export const useGuichetByGareAndKoperative = (gareId?: number, koperativeId?: number) => {
  return useQuery({
    queryKey: ['guichet', 'gare', gareId, 'koperative', koperativeId],
    queryFn: () => getGuichetByGareAndKoperative(gareId!, koperativeId!),
    enabled: !!gareId && !!koperativeId,
    staleTime: 360 * 1000,
  });
};

export const useGuichetDestinations = (guichetId?: number) => {
  return useQuery({
    queryKey: ['guichet', guichetId, 'destinations'],
    queryFn: () => getGuichetDestinations(guichetId!),
    enabled: !!guichetId,
    staleTime: 360 * 1000,
  });
};

export const useUpdateGuichetDestinations = (guichetId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (destinations: Gare[]) => updateGuichetDestinations(guichetId, destinations),
    onSuccess: async () => {
      // Invalidate destinations query to refetch updated list
      await queryClient.invalidateQueries({ queryKey: ['guichet', guichetId, 'destinations'] });
      // Invalidate guichet queries for cache consistency
      await queryClient.invalidateQueries({ queryKey: ['guichet'] });
      await queryClient.invalidateQueries({ queryKey: ['koperative'] });
    },
  });
};
