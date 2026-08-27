import api from './axios';
import type { UserOperator, OperateurFilters } from '@/types/operateur.types';

const API_URL = '/operators';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const searchOperateurs = async (
  filters: OperateurFilters,
  page = 0,
  size = 15
): Promise<PageResponse<UserOperator>> => {
  const { data } = await api.post<PageResponse<UserOperator>>(`${API_URL}/search`, {
    search: filters.search || undefined,
    isActive: filters.isActive,
    koperativeId: filters.koperativeId,
    gareId: filters.gareId,
    page,
    size,
  });
  return data;
};

export const getOperateurById = async (id: number): Promise<UserOperator> => {
  const { data } = await api.get<UserOperator>(`${API_URL}/${id}`);
  return data;
};

export const updateOperateur = async (id: number, operator: UserOperator): Promise<string> => {
  const { data } = await api.put<string>(`/users/operators/${id}`, operator);
  return data;
};
