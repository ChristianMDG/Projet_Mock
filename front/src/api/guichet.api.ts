import axios from './axios';
import { Guichet } from '@/models/Guichet';
import { Gare } from '@/models/Gare';

const API_URL = '/guichets';

export const createGuichet = async (guichet: Partial<Guichet>) => {
  const { data } = await axios.post<Guichet>(API_URL, guichet);
  return data;
};

export const updateGuichet = async (id: number, guichet: Partial<Guichet>) => {
  const { data } = await axios.put<Guichet>(`${API_URL}/${id}`, guichet);
  return data;
};

export const deleteGuichet = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};

export const getGuichetByGareAndKoperative = async (gareId: number, koperativeId: number) => {
  try {
    const { data } = await axios.get<Guichet>(`${API_URL}/gare/${gareId}/koperative/${koperativeId}`);
    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getGuichetDestinations = async (id: number) => {
  const { data } = await axios.get<Gare[]>(`${API_URL}/${id}/destinations`);
  return data;
};

export const updateGuichetDestinations = async (id: number, destinations: Gare[]) => {
  // Send only { id } objects to avoid circular references and large payloads
  const payload = destinations.map(d => ({ id: d.id }));
  const { data } = await axios.put<Guichet>(`${API_URL}/${id}/destinations`, payload);
  return data;
};
