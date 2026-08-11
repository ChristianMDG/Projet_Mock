import axios from './axios';
import { Gare } from '@/models/Gare';
import { GareFilter } from '@/types/type.util';

const API_URL = '/gares';

export const getGares = async (filter?: Partial<GareFilter>) => {
  const params: Record<string, string> = {};
  if (filter?.name) params.name = filter.name;
  if (filter?.ville && filter.ville.length > 0) params.villeIds = filter.ville.map(v => v.id).join(',');
  if (filter?.koperativeName) params.koperativeName = filter.koperativeName;
  if (filter?.isClosed !== undefined) params.isClosed = String(filter.isClosed);
  const { data } = await axios.get<Gare[]>(API_URL, { params });
  return data;
};

export const createGare = async (gare: Partial<Gare>) => {
  const { data } = await axios.post<Gare>(API_URL, gare);
  return data;
};

export const updateGare = async (id: number, gare: Partial<Gare>) => {
  const { data } = await axios.put<Gare>(`${API_URL}/${id}`, gare);
  return data;
};

export const deleteGare = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};

export const getGareById = async (id: number) => {
  const { data } = await axios.get<Gare>(`${API_URL}/${id}`);
  return data;
};

export const getGaresByVille = async (villeId: number) => {
  const { data } = await axios.get<Gare[]>(`${API_URL}/ville/${villeId}`);
  return data;
};
