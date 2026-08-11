import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Voyageur } from '@/models/Voyageur';
import type { UserFormData } from '@/types/user.type';
import { createVoyageur, updateVoyageur } from '@/api/voyageur.api';

// Query Keys
export const voyageurKeys = {
  all: ['voyageurs'] as const,
  lists: () => [...voyageurKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...voyageurKeys.lists(), filters] as const,
  details: () => [...voyageurKeys.all, 'detail'] as const,
  detail: (id: number) => [...voyageurKeys.details(), id] as const,
  search: (phone?: string, idNumber?: string) => [...voyageurKeys.all, 'search', { phone, idNumber }] as const,
};

// Mutations
export const useCreateVoyageur = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserFormData) => createVoyageur(data),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: voyageurKeys.all });
      if (data.id) {
        queryClient.setQueryData(voyageurKeys.detail(data.id), data);
      }
    },
  });
};

export const useUpdateVoyageur = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserFormData> }) => updateVoyageur(id, data),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: voyageurKeys.all });
      if (data.id) {
        queryClient.setQueryData(voyageurKeys.detail(data.id), data);
      }
    },
  });
};

// Convenience hook that handles both create and update
export const useUpsertVoyageur = () => {
  const createMutation = useCreateVoyageur();
  const updateMutation = useUpdateVoyageur();

  return {
    mutate: async (userForm: UserFormData): Promise<Voyageur> => {
      if (userForm.id) {
        return updateMutation.mutateAsync({ id: userForm.id, data: userForm });
      }
      return createMutation.mutateAsync(userForm);
    },
    isLoading: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error ?? updateMutation.error,
  };
};
