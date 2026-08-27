import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSeatsByVoyage,
  getReservedSeatsByVoyage,
  getAvailableSeatsByVoyage,
  countAvailableSeatsByVoyage,
  updateSeatStatus,
  getSeatsByVoyageAndReservation,
} from '@/api/seat.api';
import type { SeatStatusEnum } from '@/types/voyage.types';

export const seatKeys = {
  all: ['seats'] as const,
  byVoyage: (voyageId: number) => [...seatKeys.all, 'voyage', voyageId] as const,
  reserved: (voyageId: number) => [...seatKeys.all, 'voyage', voyageId, 'reserved'] as const,
  available: (voyageId: number) => [...seatKeys.all, 'voyage', voyageId, 'available'] as const,
  count: (voyageId: number) => [...seatKeys.all, 'voyage', voyageId, 'count'] as const,
};

export const useVoyageSeats = (voyageId: number | null) => {
  const safeId = voyageId ?? 0;
  return useQuery({
    queryKey: seatKeys.byVoyage(safeId),
    queryFn: () => getSeatsByVoyage(safeId),
    enabled: safeId > 0,
    staleTime: 5000,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
};

export const useReservedSeats = (voyageId: number | null) => {
  const safeId = voyageId ?? 0;
  return useQuery({
    queryKey: seatKeys.reserved(safeId),
    queryFn: () => getReservedSeatsByVoyage(safeId),
    enabled: safeId > 0,
    staleTime: 5000,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
};

export const useAvailableSeats = (voyageId: number | null) => {
  const safeId = voyageId ?? 0;
  return useQuery({
    queryKey: seatKeys.available(safeId),
    queryFn: () => getAvailableSeatsByVoyage(safeId),
    enabled: safeId > 0,
    staleTime: 5000,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
};

export const useAvailableSeatCount = (voyageId: number | null) => {
  const safeId = voyageId ?? 0;
  return useQuery({
    queryKey: seatKeys.count(safeId),
    queryFn: () => countAvailableSeatsByVoyage(safeId),
    enabled: safeId > 0,
    staleTime: 5000,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
};

export const useUpdateSeatStatus = (voyageId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ seatId, status }: { seatId: number; status: SeatStatusEnum }) => updateSeatStatus(seatId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seatKeys.byVoyage(voyageId) });
      queryClient.invalidateQueries({ queryKey: seatKeys.reserved(voyageId) });
      queryClient.invalidateQueries({ queryKey: seatKeys.available(voyageId) });
      queryClient.invalidateQueries({ queryKey: seatKeys.count(voyageId) });
      queryClient.invalidateQueries({ queryKey: ['voyages'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

export const useSeatsByVoyageAndReservation = (voyageId?: number, reservationId?: number) => {
  const safeVoyageId = voyageId ?? 0;
  const safeReservationId = reservationId ?? 0;
  return useQuery({
    queryKey: [...seatKeys.all, 'voyage', safeVoyageId, 'reservation', safeReservationId],
    queryFn: () => getSeatsByVoyageAndReservation(safeVoyageId, safeReservationId),
    enabled: safeVoyageId > 0 && safeReservationId > 0,
    staleTime: 1000 * 30,
  });
};
