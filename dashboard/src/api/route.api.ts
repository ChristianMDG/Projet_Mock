import api from './axios';

export interface Gare {
  id: number;
  name: string;
  address?: string;
  description?: string;
  isClosed: boolean;
  ville?: any; // Avoiding circular dependency for now, or use simple object
}

export interface Route {
  id: number;
  name: string;
  departureGare: Gare;
  arrivalGare: Gare;
  estimatedDurationHours: number;
  distanceKm: number;
  fraisTaxibrousse: number;
  fraisKoperative: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getRoutesByVille = async (villeId: number): Promise<Route[]> => {
  const response = await api.get<Route[]>(`/routes/ville/${villeId}`);
  return response.data;
};

export const createOrUpdateRoute = async (route: Partial<Route>): Promise<Route> => {
  const response = await api.post<Route>('/routes', route);
  return response.data;
};

export const deleteRoute = async (id: number): Promise<void> => {
  await api.delete(`/routes/${id}`);
};
