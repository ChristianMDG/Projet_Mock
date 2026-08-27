import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPromotion, deletePromotion, listPromotions, updatePromotion } from '@/api/promotion.api';
import type { PromotionPayload } from '@/types/shop.types';

export const promotionKeys = {
  all: ['shop', 'promotions'] as const,
  list: () => [...promotionKeys.all, 'list'] as const,
};

export const usePromotions = () => useQuery({ queryKey: promotionKeys.list(), queryFn: listPromotions });

export const useCreatePromotion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PromotionPayload) => createPromotion(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: promotionKeys.all }),
  });
};

export const useUpdatePromotion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PromotionPayload }) => updatePromotion(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: promotionKeys.all }),
  });
};

export const useDeletePromotion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePromotion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: promotionKeys.all }),
  });
};
