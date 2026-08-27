import axios from './axios';
import { cartSenderHeaders } from '@/utils/cartSession';
import type { Promotion, PromotionValidationResponse, ValidatePromotionRequest } from '@/types/promotion.types';

const API_URL = '/promotions';

export const listActivePromotions = async (): Promise<Promotion[]> => {
  const { data } = await axios.get<Promotion[]>(API_URL);
  return data;
};

export const getPromotion = async (id: number): Promise<Promotion> => {
  const { data } = await axios.get<Promotion>(`${API_URL}/${id}`);
  return data;
};

export const createPromotion = async (payload: Partial<Promotion>): Promise<Promotion> => {
  const { data } = await axios.post<Promotion>(API_URL, payload);
  return data;
};

export const updatePromotion = async (id: number, payload: Partial<Promotion>): Promise<Promotion> => {
  const { data } = await axios.put<Promotion>(`${API_URL}/${id}`, payload);
  return data;
};

export const deletePromotion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const validatePromotion = async (request: ValidatePromotionRequest): Promise<PromotionValidationResponse> => {
  const { data } = await axios.post<PromotionValidationResponse>(`${API_URL}/validate`, request, {
    headers: cartSenderHeaders(),
  });
  return data;
};
