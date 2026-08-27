import axios from './axios';
import type { ProductCategory, CategoryReorderRequest } from '@/types/category.types';

const API_URL = '/product-categories';

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const { data } = await axios.get<ProductCategory[]>(API_URL);
  return data;
};

export const getProductCategoriesByCategory = async (categoryId: number): Promise<ProductCategory[]> => {
  const { data } = await axios.get<ProductCategory[]>(`${API_URL}/by-category/${categoryId}`);
  return data;
};

export const getProductCategory = async (id: number): Promise<ProductCategory> => {
  const { data } = await axios.get<ProductCategory>(`${API_URL}/${id}`);
  return data;
};

export const createProductCategory = async (payload: Partial<ProductCategory>): Promise<ProductCategory> => {
  const { data } = await axios.post<ProductCategory>(API_URL, payload);
  return data;
};

export const updateProductCategory = async (
  id: number,
  payload: Partial<ProductCategory>,
): Promise<ProductCategory> => {
  const { data } = await axios.put<ProductCategory>(`${API_URL}/${id}`, payload);
  return data;
};

export const reorderProductCategories = async (request: CategoryReorderRequest): Promise<void> => {
  await axios.put(`${API_URL}/reorder`, request);
};

export const deleteProductCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
