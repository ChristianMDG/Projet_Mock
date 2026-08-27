import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { searchOperateurs, updateOperateur } from '@/api/operateur.api';
import type { UserOperator, OperateurFilters } from '@/types/operateur.types';
import { useOperateurStore } from '@/stores/operateur.store';

export const operateurKeys = {
  all: ['operateurs'] as const,
  lists: () => [...operateurKeys.all, 'list'] as const,
  list: (filters: OperateurFilters, page: number, size: number) =>
    [...operateurKeys.lists(), { filters, page, size }] as const,
};

export const useOperateurs = (page = 0, size = 15) => {
  const { filters } = useOperateurStore();

  return useQuery({
    queryKey: operateurKeys.list(filters, page, size),
    queryFn: () => searchOperateurs(filters, page, size),
    staleTime: 30000,
    placeholderData: keepPreviousData,
  });
};

export const useUpdateOperateur = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, operator }: { id: number; operator: UserOperator }) => updateOperateur(id, operator),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operateurKeys.all });
    },
  });
};
