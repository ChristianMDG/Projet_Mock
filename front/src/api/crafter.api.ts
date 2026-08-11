import axios from './axios';
import { Crafter } from '@/models/Crafter';
import { CrafterConfig } from '@/types/type.props';

const API_URL = '/crafters';

export const getCrafter = async (id: number) => {
  const { data } = await axios.get<Crafter>(`${API_URL}/${id}`);
  return data;
};

export const getCraftersByKoperative = async (koperativeId: number) => {
  const { data } = await axios.get<Crafter[]>(`${API_URL}/koperative/${koperativeId}`);
  return data;
};

export const getActiveCrafters = async () => {
  const { data } = await axios.get<Crafter[]>(`${API_URL}/active`);
  return data;
};

export const getInactiveCrafters = async () => {
  const { data } = await axios.get<Crafter[]>(`${API_URL}/inactive`);
  return data;
};

export const createCrafter = async (crafter: Partial<Crafter>) => {
  const { data } = await axios.post<Crafter>(API_URL, crafter);
  return data;
};

export const updateCrafter = async (id: number, crafter: Partial<Crafter>) => {
  const { data } = await axios.put<Crafter>(`${API_URL}/${id}`, crafter);
  return data;
};

export const deleteCrafter = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const getCrafterSeatConfig = async (id: number) => {
  const { data } = await axios.get<CrafterConfig | null>(`${API_URL}/${id}/seat-config`);
  return data;
};
