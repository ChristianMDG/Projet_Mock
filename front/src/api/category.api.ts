import axios from './axios';
import type { Category } from '@/types/category.types';

const API_URL = '/categories';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>(API_URL);
  return data;
};

export const getCategoryTree = async (): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>(`${API_URL}/tree`);
  return data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const { data } = await axios.get<Category>(`${API_URL}/${id}`);
  return data;
};

export const createCategory = async (payload: Partial<Category>): Promise<Category> => {
  const { data } = await axios.post<Category>(API_URL, payload);
  return data;
};

export const updateCategory = async (id: number, payload: Partial<Category>): Promise<Category> => {
  const { data } = await axios.put<Category>(`${API_URL}/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
