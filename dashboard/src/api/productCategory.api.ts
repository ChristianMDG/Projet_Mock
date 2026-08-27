import api from './axios';
import type { ProductCategory, ProductCategoryPayload, ProductCategoryReorderItem } from '@/types/shop.types';

export const listProductCategories = async (): Promise<ProductCategory[]> => {
  const { data } = await api.get<ProductCategory[]>('/product-categories');
  return data;
};

export const listProductCategoriesByCategory = async (categoryId: number): Promise<ProductCategory[]> => {
  const { data } = await api.get<ProductCategory[]>(`/product-categories/by-category/${categoryId}`);
  return data;
};

export const getProductCategory = async (id: number): Promise<ProductCategory> => {
  const { data } = await api.get<ProductCategory>(`/product-categories/${id}`);
  return data;
};

export const createProductCategory = async (payload: ProductCategoryPayload): Promise<ProductCategory> => {
  const { data } = await api.post<ProductCategory>('/product-categories', payload);
  return data;
};

export const updateProductCategory = async (id: number, payload: ProductCategoryPayload): Promise<ProductCategory> => {
  const { data } = await api.put<ProductCategory>(`/product-categories/${id}`, payload);
  return data;
};

export const deleteProductCategory = async (id: number): Promise<void> => {
  await api.delete(`/product-categories/${id}`);
};

export const reorderProductCategories = async (items: ProductCategoryReorderItem[]): Promise<void> => {
  await api.put('/product-categories/reorder', { items });
};
