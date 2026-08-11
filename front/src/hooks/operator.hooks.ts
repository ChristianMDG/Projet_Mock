import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOperator,
  deleteOperator,
  getOperatorById,
  getOperators,
  getOperatorsByKoperative,
  OperatorFilter,
  updateOperator,
} from '@/api/operator.api';
import { UserOperator } from '@/models/UserOperator';

export function useOperators(filter?: Partial<OperatorFilter>) {
  return useQuery<UserOperator[], Error>({
    queryKey: ['operators', filter],
    queryFn: () => getOperators(filter),
  });
}

export function useOperatorById(id?: number) {
  return useQuery<UserOperator, Error>({
    queryKey: ['operator', id],
    queryFn: () => getOperatorById(id!),
    enabled: !!id,
  });
}

export function useOperatorsByKoperative(koperativeId?: number) {
  return useQuery<UserOperator[], Error>({
    queryKey: ['operators', 'koperative', koperativeId],
    queryFn: () => getOperatorsByKoperative(koperativeId!),
    enabled: !!koperativeId,
  });
}

export function useCreateOperator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (operator: Partial<UserOperator>) => createOperator(operator),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: ['operators'] });
      await queryClient.invalidateQueries({ queryKey: ['koperative', data.koperative?.id, 'guichets'] });
    },
  });
}

export function useUpdateOperator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, operator }: { id: number; operator: Partial<UserOperator> }) => updateOperator(id, operator),
    onSuccess: async _data => {
      await queryClient.invalidateQueries({ queryKey: ['operators'] });
      await queryClient.invalidateQueries({ queryKey: ['koperative', _data.koperative?.id, 'guichets'] });
    },
  });
}

export function useDeleteOperator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOperator(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['operators'],
      });
    },
  });
}
