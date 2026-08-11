import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOperators,
  getOperatorById,
  assignGareToOperator,
  assignKoperativesToOperator,
  type OperatorFilters,
} from '@/api/operateur.api';
import { getGuichetsByGare } from '@/api/koperative.api';
import type { GuichetWithKoperative } from '@/types/koperative.types';

export const operateurKeys = {
  all: ['operators'] as const,
  list: (filters?: OperatorFilters) => ['operators', 'list', filters] as const,
  detail: (id: number) => ['operators', id] as const,
};

export function useOperators(filters?: OperatorFilters) {
  return useQuery({
    queryKey: operateurKeys.list(filters),
    queryFn: () => getOperators(filters),
  });
}

export function useOperatorDetail(id: number) {
  return useQuery({
    queryKey: operateurKeys.detail(id),
    queryFn: () => getOperatorById(id),
    enabled: !!id,
  });
}

export function useAssignGareToOperator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ operatorId, gareId, koperativeId }: { operatorId: number; gareId: number; koperativeId?: number }) =>
      assignGareToOperator(operatorId, gareId, koperativeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operateurKeys.all });
    },
  });
}

export function useGuichetsByGare(gareId: number | null) {
  return useQuery<GuichetWithKoperative[]>({
    queryKey: ['guichets', 'gare', gareId],
    queryFn: () => getGuichetsByGare(gareId!),
    enabled: gareId != null,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAssignKoperativesToOperator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ operatorId, koperativeIds }: { operatorId: number; koperativeIds: number[] }) =>
      assignKoperativesToOperator(operatorId, koperativeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operateurKeys.all });
    },
  });
}
