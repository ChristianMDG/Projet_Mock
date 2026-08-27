import axios from './axios';
import type { ProductVariant } from '@/types/shop-admin.types';

const buildUrl = (productId: number) => `/products/${productId}/variants`;

export const listProductVariants = async (productId: number): Promise<ProductVariant[]> => {
  const { data } = await axios.get<ProductVariant[]>(buildUrl(productId));
  return data;
};

export const createProductVariant = async (
  productId: number,
  payload: Partial<ProductVariant>,
): Promise<ProductVariant> => {
  const { data } = await axios.post<ProductVariant>(buildUrl(productId), payload);
  return data;
};

export const updateProductVariant = async (
  productId: number,
  variantId: number,
  payload: Partial<ProductVariant>,
): Promise<ProductVariant> => {
  const { data } = await axios.put<ProductVariant>(`${buildUrl(productId)}/${variantId}`, payload);
  return data;
};

export const deleteProductVariant = async (productId: number, variantId: number): Promise<void> => {
  await axios.delete(`${buildUrl(productId)}/${variantId}`);
};
