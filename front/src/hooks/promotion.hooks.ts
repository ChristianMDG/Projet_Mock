import { useMutation, useQuery, useQueryClient, UseQueryResult, skipToken } from '@tanstack/react-query';
import {
  createPromotion,
  deletePromotion,
  getPromotion,
  listActivePromotions,
  updatePromotion,
  validatePromotion,
} from '@/api/promotion.api';
import type { Promotion, PromotionValidationResponse, ValidatePromotionRequest } from '@/types/promotion.types';

const PROMOTIONS_KEY = ['promotions'] as const;

export function useActivePromotions(): UseQueryResult<Promotion[], Error> {
  return useQuery({ queryKey: PROMOTIONS_KEY, queryFn: listActivePromotions });
}

export function usePromotion(id?: number): UseQueryResult<Promotion, Error> {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: id === undefined ? skipToken : () => getPromotion(id),
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Promotion>) => createPromotion(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEY });
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Promotion> }) => updatePromotion(id, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEY });
      await queryClient.invalidateQueries({ queryKey: ['promotion', variables.id] });
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePromotion(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEY });
    },
  });
}

export function useValidatePromotion() {
  return useMutation<PromotionValidationResponse, Error, ValidatePromotionRequest>({
    mutationFn: request => validatePromotion(request),
  });
}
