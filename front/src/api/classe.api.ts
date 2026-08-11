import axios from './axios';
import { Classe } from '@/models/Classe';

const API_URL = '/classes';

export const getClasses = async () => {
  const { data } = await axios.get<Classe[]>(API_URL);
  return data;
};

export const getClassesByKoperative = async (koperativeId: number) => {
  const { data } = await axios.get<Classe[]>(`${API_URL}/koperative/${koperativeId}`);
  return data;
};
