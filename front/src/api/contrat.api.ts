import axios from './axios';
import { Contrat } from '@/models/Contrat';

export const getContrats = async () => {
  const { data } = await axios.get<Contrat[]>('/contrats');
  return data;
};

export const getContrat = async (id: number) => {
  const { data } = await axios.get<Contrat>(`/contrats/${id}`);
  return data;
};

export const createContrat = async (contrat: Partial<Contrat>) => {
  const { data } = await axios.post<Contrat>('/contrats', contrat);
  return data;
};

export const updateContrat = async (id: number, contrat: Partial<Contrat>) => {
  const { data } = await axios.put<Contrat>(`/contrats/${id}`, contrat);
  return data;
};

export const deleteContrat = async (id: number) => {
  await axios.delete(`/contrats/${id}`);
};
