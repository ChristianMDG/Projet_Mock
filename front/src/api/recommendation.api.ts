import axios from './axios';
import type { Product } from '@/models/Shop';

export const getRelatedProducts = async (productId: number, limit = 8): Promise<Product[]> => {
  const { data } = await axios.get<Product[]>(`/products/${productId}/related`, {
    params: { limit },
  });
  return data;
};

export const getFrequentlyBoughtTogether = async (productId: number, limit = 6): Promise<Product[]> => {
  const { data } = await axios.get<Product[]>(`/products/${productId}/frequently-bought-together`, {
    params: { limit },
  });
  return data;
};

export const getPersonalizedRecommendations = async (limit = 12): Promise<Product[]> => {
  const { data } = await axios.get<Product[]>('/recommendations/personalized', {
    params: { limit },
  });
  return data;
};
