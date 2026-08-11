import api from './axios';
import type { Gare } from '@/models';

const BASE = '/gares';

export const getGares = async (): Promise<Gare[]> => {
  const { data } = await api.get<Gare[]>(BASE);
  return data;
};

export const getGareById = async (id: number): Promise<Gare> => {
  const { data } = await api.get<Gare>(`${BASE}/${id}`);
  return data;
};

export const getGaresByVille = async (villeId: number): Promise<Gare[]> => {
  const { data } = await api.get<Gare[]>(`${BASE}/ville/${villeId}`);
  return data;
};
