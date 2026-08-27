import api from './axios';
import type { Promotion, PromotionPayload } from '@/types/shop.types';

export const listPromotions = async (): Promise<Promotion[]> => {
  const { data } = await api.get<Promotion[]>('/promotions');
  return data;
};

export const createPromotion = async (payload: PromotionPayload): Promise<Promotion> => {
  const { data } = await api.post<Promotion>('/promotions', payload);
  return data;
};

export const updatePromotion = async (id: number, payload: PromotionPayload): Promise<Promotion> => {
  const { data } = await api.put<Promotion>(`/promotions/${id}`, payload);
  return data;
};

export const deletePromotion = async (id: number): Promise<void> => {
  await api.delete(`/promotions/${id}`);
};
