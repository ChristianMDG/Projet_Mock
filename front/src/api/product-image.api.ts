import axios from './axios';
import type { ProductImage } from '@/types/shop-admin.types';

const buildUrl = (productId: number) => `/products/${productId}/images`;

export const listProductImages = async (productId: number): Promise<ProductImage[]> => {
  const { data } = await axios.get<ProductImage[]>(buildUrl(productId));
  return data;
};

export const addProductImage = async (productId: number, payload: Partial<ProductImage>): Promise<ProductImage> => {
  const { data } = await axios.post<ProductImage>(buildUrl(productId), payload);
  return data;
};

export const setProductImagePrimary = async (productId: number, imageId: number): Promise<ProductImage> => {
  const { data } = await axios.put<ProductImage>(`${buildUrl(productId)}/${imageId}/primary`);
  return data;
};

export const deleteProductImage = async (productId: number, imageId: number): Promise<void> => {
  await axios.delete(`${buildUrl(productId)}/${imageId}`);
};
