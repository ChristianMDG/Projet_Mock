import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getHealth, getHealthInfo, HealthInfo, HealthStatus } from '@/api/health.api';

const HEALTH_KEY = ['health'] as const;
const HEALTH_INFO_KEY = ['health', 'info'] as const;

export function useHealth(): UseQueryResult<HealthStatus, Error> {
  return useQuery({
    queryKey: HEALTH_KEY,
    queryFn: getHealth,
    staleTime: 60 * 1000,
  });
}

export function useHealthInfo(): UseQueryResult<HealthInfo, Error> {
  return useQuery({
    queryKey: HEALTH_INFO_KEY,
    queryFn: getHealthInfo,
    staleTime: 5 * 60 * 1000,
  });
}
