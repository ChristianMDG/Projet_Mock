import axiosInstance from './axios';
import { UserOperator } from '@/models/UserOperator';

export interface OperatorFilter {
  koperativeId?: number;
  isActive?: boolean;
  gareId?: number;
}

export const getOperators = async (filter?: Partial<OperatorFilter>) => {
  const params = new URLSearchParams();
  if (filter?.koperativeId) params.append('koperativeId', filter.koperativeId.toString());
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.gareId) params.append('gareId', filter.gareId.toString());

  const response = await axiosInstance.get(`/users/operators?${params.toString()}`);
  return response.data;
};

export const getOperatorById = async (id: number) => {
  const response = await axiosInstance.get(`/users/operators/${id}`);
  return response.data;
};

export const getOperatorsByKoperative = async (koperativeId: number) => {
  const response = await axiosInstance.get(`/users/operators/koperative/${koperativeId}`);
  return response.data;
};

export const createOperator = async (operator: Partial<UserOperator>) => {
  const response = await axiosInstance.post('/users/operators', operator);
  return response.data;
};

export const updateOperator = async (id: number, operator: Partial<UserOperator>) => {
  const response = await axiosInstance.put(`/users/operators/${id}`, operator);
  return response.data;
};

export const deleteOperator = async (id: number) => {
  await axiosInstance.delete(`/users/operators/${id}`);
};
