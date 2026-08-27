import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AppVersion, getAppVersion } from '@/api/front.api';

const APP_VERSION_KEY = ['app-version'] as const;

export function useAppVersion(enabled = false): UseQueryResult<AppVersion, Error> {
  return useQuery({
    queryKey: APP_VERSION_KEY,
    queryFn: getAppVersion,
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
