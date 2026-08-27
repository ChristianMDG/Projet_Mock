import api from './axios';
import { Route } from '@/models/Route';
import { Gare } from '@/models/Gare';

/**
 * Get all active routes
 */
export const getRoutes = async () => {
  const response = await api.get<Route[]>('/routes');
  return response.data;
};

/**
 * Get all active routes
 */
export const getRoutesActive = async () => {
  const response = await api.get<Route[]>('/routes/active');
  return response.data;
};

/**
 * Get routes connected to a gare (either as departure or arrival)
 */
export const getRoutesByConnectedGare = async (gareId: number) => {
  const response = await api.get<Route[]>(`/routes/connected-gare/${gareId}`);
  return response.data;
};

/**
 * Get a specific route by ID
 */
export const getRouteById = async (id: number) => {
  const response = await api.get<Route>(`/routes/${id}`);
  return response.data;
};

/**
 * Create or update a route
 */
export const createOrUpdateRoute = async (route: Partial<Route>) => {
  const response = await api.post<Route>('/routes', route);
  return response.data;
};

/**
 * Get available destination gares for a departure gare
 */
export const getAvailableDestinations = async (gareId: number) => {
  const response = await api.get<Gare[]>(`/routes/connected-gare/${gareId}/available-destinations`);
  return response.data;
};

/**
 * Delete a route (soft delete)
 */
export const deleteRoute = async (id: number) => {
  await api.delete(`/routes/${id}`);
};
/**
 * Get active routes by departure gare ID (Top frequency)
 */
export const getRoutesByDepartureGareId = async (gareId: number) => {
  const response = await api.get<Route[]>(`/routes/by-departure-gare/${gareId}`);
  return response.data;
};

/**
 * Get top active routes by departure ville ID
 */
export const getRoutesByDepartureVilleId = async (villeId: number, date: string) => {
  const response = await api.get<Route[]>(`/routes/by-departure-ville/${villeId}`, {
    params: { date },
  });
  return response.data;
};
