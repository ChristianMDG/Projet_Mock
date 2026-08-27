import axios from './axios';
import { Colis } from '@/types';

const API_URL = '/colis';

// GET all colis (paginated)
export const getColisList = async (
  page = 0,
  size = 20,
): Promise<{
  content: Colis[];
  totalElements: number;
  totalPages: number;
}> => {
  const { data } = await axios.get(`${API_URL}?page=${page}&size=${size}`);
  return data;
};

// GET single colis by id
export const getColis = async (id: number): Promise<Colis> => {
  const { data } = await axios.get<Colis>(`${API_URL}/${id}`);
  return data;
};

// GET all colis by koperative
export const getColisByKoperative = async (koperativeId: number): Promise<Colis[]> => {
  const { data } = await axios.get<Colis[]>(`${API_URL}/koperative/${koperativeId}`);
  return data;
};

// GET all colis by voyage
export const getColisByVoyage = async (voyageId: number): Promise<Colis[]> => {
  const { data } = await axios.get<Colis[]>(`${API_URL}/voyage/${voyageId}`);
  return data;
};

// CREATE new colis
export const createColis = async (colis: Partial<Colis>): Promise<Colis> => {
  const { data } = await axios.post<Colis>(API_URL, colis);
  return data;
};

// UPDATE colis
export const updateColis = async (id: number, colis: Partial<Colis>): Promise<Colis> => {
  const { data } = await axios.put<Colis>(`${API_URL}/${id}`, colis);
  return data;
};

// DELETE colis
export const deleteColis = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// FILTER colis (optional, if you have search/filter endpoint)
export const findFilteredColis = async (filters: Record<string, unknown>): Promise<Colis[]> => {
  const { data } = await axios.get<Colis[]>(`${API_URL}/filtered`, {
    params: filters,
  });
  return data;
};
