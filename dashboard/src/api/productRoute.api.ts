import api from './axios';
import type { ProductRoute, ProductRoutePayload } from '@/types/shop.types';

export const getProductRoutes = async (productId: number): Promise<ProductRoute[]> => {
  const { data } = await api.get<ProductRoute[]>(`/products/${productId}/routes`);
  return data;
};

export const addProductRoute = async (productId: number, payload: ProductRoutePayload): Promise<ProductRoute> => {
  const { data } = await api.post<ProductRoute>(`/products/${productId}/routes`, payload);
  return data;
};

export const removeProductRoute = async (productId: number, routeId: number): Promise<void> => {
  await api.delete(`/products/${productId}/routes/${routeId}`);
};
