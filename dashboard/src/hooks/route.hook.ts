import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoutesByVille, createOrUpdateRoute, deleteRoute, Route } from '@/api/route.api';

export function useRoutesByVille(villeId: number | null) {
  return useQuery<Route[]>({
    queryKey: ['routes', villeId],
    queryFn: () => (villeId ? getRoutesByVille(villeId) : Promise.resolve([])),
    enabled: !!villeId,
  });
}

export function useUpdateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (route: Partial<Route>) => createOrUpdateRoute(route),
    onSuccess: () => {
      // Invalidate all `routes` queries (by ville) so lists refresh
      qc.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}

export function useDeleteRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRoute(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routes'] }),
  });
}
