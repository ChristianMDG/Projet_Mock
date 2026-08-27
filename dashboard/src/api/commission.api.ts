import api from './axios';
import type { Commission } from '@/models';

const BASE = '/commissions';

export interface PageResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export const getCommissions = async (koperativeId?: number, page = 0, size = 15): Promise<PageResponse<Commission>> => {
  const params: Record<string, unknown> = { page, size };
  if (koperativeId) {
    params.koperativeId = koperativeId;
  }
  const { data } = await api.get<PageResponse<Commission>>(BASE, { params });
  return data;
};

export const getCommissionById = async (id: number): Promise<Commission> => {
  const { data } = await api.get<Commission>(`${BASE}/${id}`);
  return data;
};

export interface CreateCommissionPayload {
  minAmount: number;
  maxAmount: number;
  frais: number;
  koperativeId?: number;
}

export interface UpdateCommissionPayload {
  minAmount?: number;
  maxAmount?: number;
  frais?: number;
  koperativeId?: number;
}

export const createCommission = async (payload: CreateCommissionPayload): Promise<Commission> => {
  const { data } = await api.post<Commission>(BASE, payload);
  return data;
};

export const updateCommission = async (id: number, payload: UpdateCommissionPayload): Promise<Commission> => {
  const { data } = await api.put<Commission>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteCommission = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
