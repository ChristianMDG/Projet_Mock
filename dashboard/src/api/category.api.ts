import api from './axios';
import type { Category, CategoryPayload } from '@/types/shop.types';

export const listCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/categories');
  return data;
};

export const getCategoryTree = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/categories/tree');
  return data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const { data } = await api.get<Category>(`/categories/${id}`);
  return data;
};

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
  const { data } = await api.post<Category>('/categories', payload);
  return data;
};

export const updateCategory = async (id: number, payload: CategoryPayload): Promise<Category> => {
  const { data } = await api.put<Category>(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
