import { useQuery } from '@tanstack/react-query';
import { getVilleDetails, getVilleDetailById, getVilleDetailByVilleId } from '@/api/cms.api';

export const useVilleDetails = () => {
  return useQuery({
    queryKey: ['ville-details'],
    queryFn: getVilleDetails,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useVilleDetailById = (id: number) => {
  return useQuery({
    queryKey: ['ville-detail', id],
    queryFn: () => getVilleDetailById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useVilleDetailByVilleId = (villeId: number) => {
  return useQuery({
    queryKey: ['ville-detail-by-ville', villeId],
    queryFn: () => getVilleDetailByVilleId(villeId),
    select: res => ({
      data: res.data?.[0] ?? null,
      meta: res.meta,
    }),
    enabled: !!villeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
