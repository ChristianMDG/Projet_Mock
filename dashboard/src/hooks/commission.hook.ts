import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCommissions,
  getCommissionById,
  createCommission,
  updateCommission,
  deleteCommission,
  type CreateCommissionPayload,
  type UpdateCommissionPayload,
} from '@/api/commission.api';

export const commissionKeys = {
  all: ['commissions'] as const,
  list: (koperativeId?: number, page = 0, size = 15) =>
    [...commissionKeys.all, 'list', koperativeId, page, size] as const,
  detail: (id: number) => [...commissionKeys.all, 'detail', id] as const,
};

export const useCommissions = (koperativeId?: number, page = 0, size = 15) => {
  return useQuery({
    queryKey: commissionKeys.list(koperativeId, page, size),
    queryFn: () => getCommissions(koperativeId, page, size),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCommission = (id: number) => {
  return useQuery({
    queryKey: commissionKeys.detail(id),
    queryFn: () => getCommissionById(id),
    enabled: Boolean(id),
  });
};

export const useCreateCommission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommissionPayload) => createCommission(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.all });
    },
  });
};

export const useUpdateCommission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCommissionPayload }) => updateCommission(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.all });
    },
  });
};

export const useDeleteCommission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCommission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.all });
    },
  });
};
