import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  searchReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservationByOperator,
  confirmReservation,
} from '@/api/reservation.api';
import type { ReservationStatusEnum, ReservationFilters } from '@/types/reservation.types';
import { useReservationStore } from '@/stores/reservation.store';

// Query keys
export const reservationKeys = {
  all: ['reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (filters: ReservationFilters, page: number) => [...reservationKeys.lists(), { filters, page }] as const,
  details: () => [...reservationKeys.all, 'detail'] as const,
  detail: (id: number) => [...reservationKeys.details(), id] as const,
};

// Fetch reservations with server-side filtering (keeps previous data while fetching)
export const useReservations = (page = 0, size = 15) => {
  const { filters } = useReservationStore();

  return useQuery({
    queryKey: reservationKeys.list(filters, page),
    queryFn: () => searchReservations(filters, page, size),
    staleTime: 30000,
    placeholderData: keepPreviousData,
  });
};

// Fetch single reservation
export const useReservation = (id: number) => {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => getReservationById(id),
    enabled: id > 0,
  });
};

// Update reservation status mutation
export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ReservationStatusEnum }) => updateReservationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
};

// Cancel reservation mutation
export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelReservationByOperator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
};

// Confirm reservation mutation
export const useConfirmReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => confirmReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
};
