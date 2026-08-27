import api from './axios';
import type { Guichet, Operateur } from '@/types/voyage.types';

const BASE = '/guichets';

export const getGuichetsByKoperative = async (koperativeId: number): Promise<Guichet[]> => {
  const { data } = await api.get<Guichet[]>(`${BASE}/koperative/${koperativeId}`);
  return data;
};

export const getGuichetsByGare = async (gareId: number): Promise<Guichet[]> => {
  const { data } = await api.get<Guichet[]>(`${BASE}/gare/${gareId}`);
  return data;
};

export const getGuichetByGareAndKoperative = async (gareId: number, koperativeId: number): Promise<Guichet | null> => {
  const { data } = await api.get<Guichet>(`${BASE}/gare/${gareId}/koperative/${koperativeId}`);
  return data;
};

export const getOperateursByKoperative = async (koperativeId: number): Promise<Operateur[]> => {
  const { data } = await api.get<Operateur[]>(`${BASE}/koperative/${koperativeId}/operateurs`);
  return data;
};
