import axios from './axios';
import { Chauffeur } from '@/models/Chauffeur';

const API_URL = '/chauffeurs';

export const getChauffeurs = async () => {
  const { data } = await axios.get<Chauffeur[]>(API_URL);
  return data;
};

export const getChauffeursByKoperative = async (koperativeId: number) => {
  const { data } = await axios.get<Chauffeur[]>(`/koperatives/${koperativeId}/chauffeurs`);
  return data;
};

export const createChauffeur = async (chauffeur: Partial<Chauffeur>) => {
  const { data } = await axios.post<Chauffeur>(API_URL, chauffeur);
  return data;
};

export const updateChauffeur = async (id: number, chauffeur: Partial<Chauffeur>) => {
  const { data } = await axios.put<Chauffeur>(`${API_URL}/${id}`, chauffeur);
  return data;
};

export const deleteChauffeur = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
