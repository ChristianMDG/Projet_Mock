import { useQuery } from '@tanstack/react-query';
import { getClasses, getClassesByKoperative } from '@/api/classe.api';

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
    staleTime: 10 * 60 * 1000,
  });
}

export function useClassesByKoperative(koperativeId?: number) {
  return useQuery({
    queryKey: ['classes', 'koperative', koperativeId],
    queryFn: () => getClassesByKoperative(koperativeId!),
    enabled: !!koperativeId,
    staleTime: 10 * 60 * 1000,
  });
}
