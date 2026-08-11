import api from './axios';
import type { Classe } from '@/models';

const BASE = '/classes';

export const getClasses = async (): Promise<Classe[]> => {
  const { data } = await api.get<Classe[]>(BASE);
  return data;
};

export const getClassesByKoperative = async (koperativeId: number): Promise<Classe[]> => {
  const { data } = await api.get<Classe[]>(`${BASE}/koperative/${koperativeId}`);
  return data;
};

export interface CreateClassePayload {
  name: string;
  description?: string;
  koperativeId: number;
}

export interface UpdateClassePayload {
  name?: string;
  description?: string;
  koperativeId?: number;
}

export const createClasse = async (payload: CreateClassePayload): Promise<Classe> => {
  const { data } = await api.post<Classe>(BASE, payload);
  return data;
};

export const updateClasse = async (id: number, payload: UpdateClassePayload): Promise<Classe> => {
  const { data } = await api.put<Classe>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteClasse = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
