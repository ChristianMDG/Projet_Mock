import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createGare, deleteGare, getGareById, getGares, updateGare } from '@/api/gare.api';
import { Gare } from '@/models/Gare';
import { GareFilter } from '@/types/type.util';

export function useGares(filter?: Partial<GareFilter>, fetchAll = true) {
  return useQuery<Gare[], Error>({
    queryKey: ['gares', filter],
    queryFn: () => getGares(filter),
    enabled: fetchAll || Boolean(filter?.name) || (filter?.ville && filter.ville.length > 0),
  });
}

export function useCreateGare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gare: Partial<Gare>) => createGare(gare),
    onSuccess: async _ => {
      await queryClient.invalidateQueries({
        queryKey: ['gares'],
      });
    },
  });
}

export function useUpdateGare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, gare }: { id: number; gare: Partial<Gare> }) => updateGare(id, gare),
    onSuccess: async (_data, updatedGare) => {
      if (updatedGare?.id) {
        await queryClient.invalidateQueries({ queryKey: ['gares'] });
        await queryClient.invalidateQueries({ queryKey: ['gare', updatedGare.id] });
      }
    },
  });
}

export function useDeleteGare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteGare(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['gares'],
      });
    },
  });
}

export function useGareById(id?: number) {
  return useQuery<Gare, Error>({
    queryKey: ['gare', id],
    queryFn: () => getGareById(id!),
    enabled: !!id,
  });
}
