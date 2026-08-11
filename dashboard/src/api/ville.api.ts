import api from './axios';

export interface Ville {
  id: number;
  name: string;
  region: string;
  province: string;
  code: string;
  isActive: boolean;
  rn?: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllVilles = async (): Promise<Ville[]> => {
  const response = await api.get<Ville[]>('/villes');
  return response.data;
};
