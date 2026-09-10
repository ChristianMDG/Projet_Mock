import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchGlobalSearch, GlobalSearchResponse } from '@/api/global-search.api';

export const GLOBAL_SEARCH_KEY = ['global-search'] as const;

export function useGlobalSearch(
  query: string,
  limit = 8,
  options?: { enabled?: boolean },
): UseQueryResult<GlobalSearchResponse, Error> {
  return useQuery({
    queryKey: [...GLOBAL_SEARCH_KEY, query, limit],
    queryFn: () => fetchGlobalSearch(query, limit),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}
