import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOrUpdateRoute,
  deleteRoute,
  getAvailableDestinations,
  getRouteById,
  getRoutesActive,
  getRoutesByConnectedGare,
  getRoutesByDepartureVilleId,
} from '@/api/route.api';
import { getTopVilles } from '@/api/ville.api';
import { Route } from '@/models/Route';

// Query keys
const ROUTE_KEYS = {
  all: ['routes'] as const,
  byConnectedGare: (gareId: number) => [...ROUTE_KEYS.all, 'connected', gareId] as const,
  availableDestinations: (gareId: number) => [...ROUTE_KEYS.all, 'available', gareId] as const,
  detail: (id: number) => [...ROUTE_KEYS.all, 'detail', id] as const,
  top5: (gareId: number) => [...ROUTE_KEYS.all, 'top5', gareId] as const,
};

/**
 * Get all active routes
 */
export const useRoutes = () => {
  return useQuery({
    queryKey: ROUTE_KEYS.all,
    queryFn: getRoutesActive,
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Get routes connected to a gare (either as departure or arrival)
 */
export const useRoutesByConnectedGare = (gareId: number) => {
  return useQuery({
    queryKey: ROUTE_KEYS.byConnectedGare(gareId),
    queryFn: () => getRoutesByConnectedGare(gareId),
    enabled: !!gareId,
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Get available destination gares for a departure gare
 */
export const useAvailableDestinations = (gareId: number) => {
  return useQuery({
    queryKey: ROUTE_KEYS.availableDestinations(gareId),
    queryFn: () => getAvailableDestinations(gareId),
    enabled: !!gareId,
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Get a specific route by ID
 */
export const useRouteById = (id: number) => {
  return useQuery({
    queryKey: ROUTE_KEYS.detail(id),
    queryFn: () => getRouteById(id),
    enabled: !!id,
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Create or update a route
 */
export const useCreateOrUpdateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (route: Partial<Route>) => createOrUpdateRoute(route),
    onSuccess: async newRoute => {
      // Invalidate and refetch route queries
      await queryClient.invalidateQueries({ queryKey: ROUTE_KEYS.all });
      if (newRoute.departureGare?.id) {
        await queryClient.invalidateQueries({
          queryKey: ROUTE_KEYS.byConnectedGare(newRoute.departureGare.id),
        });
        await queryClient.invalidateQueries({
          queryKey: ROUTE_KEYS.availableDestinations(newRoute.departureGare.id),
        });
      }
      if (newRoute.arrivalGare?.id) {
        await queryClient.invalidateQueries({
          queryKey: ROUTE_KEYS.byConnectedGare(newRoute.arrivalGare.id),
        });
      }
    },
  });
};

/**
 * Delete a route
 */
export const useDeleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRoute(id),
    onSuccess: async () => {
      // Invalidate and refetch all route queries
      await queryClient.invalidateQueries({ queryKey: ROUTE_KEYS.all });
    },
  });
};

/**
 * Get top active villes by frequency
 */
export const useTopVilles = () => {
  return useQuery({
    queryKey: ['villes', 'top'],
    queryFn: getTopVilles,
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Get routes by departure ville ID
 */
export const useRoutesByDepartureVilleId = (villeId?: number, date?: string) => {
  return useQuery({
    queryKey: ['routes', 'byDepartureVille', villeId, date],
    queryFn: () => getRoutesByDepartureVilleId(villeId!, date!),
    enabled: !!villeId && !!date,
    retry: 2,
    retryDelay: 1000,
  });
};
