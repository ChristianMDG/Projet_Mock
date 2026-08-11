import { useQuery } from '@tanstack/react-query';
import { getAllVilles, Ville } from '@/api/ville.api';

export function useVilles() {
  return useQuery<Ville[]>({
    queryKey: ['villes'],
    queryFn: getAllVilles,
  });
}
