import axios from './axios';
import { Authority } from '@/models/Authority';

const API_URL = '/authorities';

export const getAuthorities = async (): Promise<Authority[]> => {
  const { data } = await axios.get<Authority[]>(API_URL);
  return data;
};

export const getAuthority = async (id: number): Promise<Authority> => {
  const { data } = await axios.get<Authority>(`${API_URL}/${id}`);
  return data;
};

export const createAuthority = async (authority: Partial<Authority>): Promise<Authority> => {
  const { data } = await axios.post<Authority>(API_URL, authority);
  return data;
};

export const updateAuthority = async (id: number, authority: Partial<Authority>): Promise<Authority> => {
  const { data } = await axios.put<Authority>(`${API_URL}/${id}`, authority);
  return data;
};

export const deleteAuthority = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
