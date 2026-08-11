import axios from './axios';
import { Voyageur } from '@/models/Voyageur';

const API_URL = '/voyageurs';

export const searchVoyageur = async (phone?: string, idNumber?: string) => {
  const params = new URLSearchParams();
  if (phone) params.append('phone', phone);
  if (idNumber) params.append('idNumber', idNumber);

  const url = `${API_URL}/search?${params.toString()}`;

  try {
    const { data } = await axios.get<Voyageur>(url);
    return data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 404) {
        return null;
      }
    }
    throw error;
  }
};

export const createVoyageur = async (voyageur: Partial<Voyageur>) => {
  const { data } = await axios.post<Voyageur>(API_URL, voyageur);
  return data;
};

export const updateVoyageur = async (id: number, voyageur: Partial<Voyageur>) => {
  await axios.put(`${API_URL}/${id}`, voyageur);
  return { ...voyageur, id } as Voyageur;
};

export const getVoyageur = async (id: number) => {
  const { data } = await axios.get<Voyageur>(`${API_URL}/${id}`);
  return data;
};
