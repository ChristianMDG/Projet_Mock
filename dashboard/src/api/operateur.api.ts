import api from './axios';
import type { Koperative } from '@/types/koperative.types';
import type { Gare } from '@/models';

const BASE = '/operators';

export interface OperateurGuichet {
  id: number;
  name?: string;
  gare?: { id: number; name: string };
}

export interface UserOperator {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  username?: string;
  isActive?: boolean;
  koperative?: Koperative;
  guichets?: OperateurGuichet[];
  assignedKoperatives?: Koperative[];
  departureGare?: Gare;
}

export interface OperatorFilters {
  search?: string;
  koperativeId?: number;
  isActive?: boolean;
  gareId?: number;
}

export const getOperators = async (filters?: OperatorFilters): Promise<UserOperator[]> => {
  const { data } = await api.get<UserOperator[]>(BASE, { params: filters });
  return data;
};

export const getOperatorById = async (id: number): Promise<UserOperator> => {
  const { data } = await api.get<UserOperator>(`${BASE}/${id}`);
  return data;
};

export const assignGareToOperator = async (
  operatorId: number,
  gareId: number,
  koperativeId?: number
): Promise<UserOperator> => {
  const { data } = await api.put<UserOperator>(`${BASE}/${operatorId}/assign-gare`, {
    gareId,
    ...(koperativeId ? { koperativeId } : {}),
  });
  return data;
};

export const assignKoperativesToOperator = async (
  operatorId: number,
  koperativeIds: number[]
): Promise<UserOperator> => {
  const { data } = await api.put<UserOperator>(`${BASE}/${operatorId}/assign-koperatives`, { koperativeIds });
  return data;
};
