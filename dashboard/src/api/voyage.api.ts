import api from './axios';
import type { Voyage } from '@/types/voyage.types';

const BASE = '/voyages';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getVoyages = async (page = 0, size = 20): Promise<PageResponse<Voyage>> => {
  const { data } = await api.get<PageResponse<Voyage>>(BASE, {
    params: { page, size },
  });
  return data;
};

export const getVoyageDetail = async (id: number): Promise<Voyage> => {
  const { data } = await api.get<Voyage>(`${BASE}/${id}`);
  return data;
};
