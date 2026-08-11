import axios from './axios';
import { Ville } from '@/models/Ville';

const API_URL = '/villes';

export const getVilles = async () => {
  const { data } = await axios.get<Ville[]>(API_URL);
  return data;
};

export const createVille = async (ville: Partial<Ville>) => {
  const { data } = await axios.post<Ville>(API_URL, ville);
  return data;
};

export const getTopVilles = async () => {
  const { data } = await axios.get<Ville[]>(`${API_URL}/top`);
  return data;
};

export const updateVille = async (id: number, ville: Partial<Ville>) => {
  const { data } = await axios.put<Ville>(`${API_URL}/${id}`, ville);
  return data;
};

export const deleteVille = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};

export const getVilleByKeyword = async (keyword: string) => {
  const { data } = await axios.get<Ville[]>(`${API_URL}/search`, { params: { keyword } });
  return data;
};
