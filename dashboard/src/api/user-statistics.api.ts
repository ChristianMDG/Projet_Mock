import api from './axios';
import type { Voyageur } from '@/types/voyageur.types';

export interface UserStatistics {
  totalVoyageurs: number;
  activeVoyageurs: number;
  inactiveVoyageurs: number;
  connectedWebSocketUsers: number;
  connectedUsernames: string[];
  connectedGuichetUsers: number;
  connectedGuichetUsernames: string[];
  totalSessions: number;
}

export interface DailyConnectionStats {
  date: string;
  uniqueSenderIds: number;
  totalConnections: number;
  uniqueGuichetConnections: number;
  totalGuichetConnections: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const fetchUserStatistics = async (): Promise<UserStatistics> => {
  const { data } = await api.get<UserStatistics>('/user-statistics');
  return data;
};

export const fetchVoyageurs = async (
  page = 0,
  size = 20,
  search?: string,
  isActive?: boolean
): Promise<PageResponse<Voyageur>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (search) params.append('search', search);
  if (isActive !== undefined) params.append('isActive', isActive.toString());

  const { data } = await api.get<PageResponse<Voyageur>>(`/user-statistics/voyageurs?${params.toString()}`);
  return data;
};

export const toggleVoyageurStatus = async (id: number): Promise<Voyageur> => {
  const { data } = await api.put<Voyageur>(`/user-statistics/voyageurs/${id}/toggle-status`);
  return data;
};

export const fetchDailyConnections = async (days: number): Promise<DailyConnectionStats[]> => {
  const { data } = await api.get<DailyConnectionStats[]>(`/user-statistics/daily-connections?days=${days}`);
  return data;
};
