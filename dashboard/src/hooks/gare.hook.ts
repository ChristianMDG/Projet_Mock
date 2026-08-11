import { useQuery } from '@tanstack/react-query';
import { getGares, getGareById, getGaresByVille } from '@/api/gare.api';

export const gareKeys = {
  all: ['gares'] as const,
  list: () => [...gareKeys.all, 'list'] as const,
  detail: (id: number) => [...gareKeys.all, 'detail', id] as const,
  byVille: (villeId: number) => [...gareKeys.all, 'ville', villeId] as const,
};

export const useGares = () => {
  return useQuery({
    queryKey: gareKeys.list(),
    queryFn: getGares,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGareDetail = (id: number) => {
  return useQuery({
    queryKey: gareKeys.detail(id),
    queryFn: () => getGareById(id),
    enabled: id > 0,
  });
};

export const useGaresByVille = (villeId: number) => {
  return useQuery({
    queryKey: gareKeys.byVille(villeId),
    queryFn: () => getGaresByVille(villeId),
    enabled: villeId > 0,
  });
};
