import { useQuery } from '@tanstack/react-query';
import { getReservationsByVoyageId } from '@/api/reservation.api';

export const voyageReservationKeys = {
  byVoyage: (voyageId: number) => ['voyage-reservations', voyageId] as const,
};

export const useReservationsByVoyage = (voyageId: number | null) => {
  const safeId = voyageId ?? 0;
  return useQuery({
    queryKey: voyageReservationKeys.byVoyage(safeId),
    queryFn: () => getReservationsByVoyageId(safeId),
    enabled: safeId > 0,
    staleTime: 1000 * 30,
  });
};
