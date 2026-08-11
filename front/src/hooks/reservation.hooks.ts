import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Reservation, ReservationStatusEnum } from '@/types';
import { PaymentRequest, PaymentResponse } from '@/models/Payment';
import { SEAT_ENTITY_KEYS } from '@/hooks/seat.hooks';
import { useAuth } from '@/context/AuthContext';

import {
  cancelReservation,
  cancelReservationByOperator,
  cancelReservationByUser,
  createReservation,
  deleteReservation,
  getReservation,
  getReservationsByVoyageId,
  getReservationsNotCanceledByVoyageId,
  getReservationsByVoyageurId,
  getGuestReservations,
  processPayment,
  updateReservation,
} from '@/api/reservation.api';
import { Voyageur } from '@/models/Voyageur';

// Query Keys
export const reservationKeys = {
  all: ['reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...reservationKeys.lists(), filters] as const,
  details: () => [...reservationKeys.all, 'detail'] as const,
  detail: (id: number) => [...reservationKeys.details(), id] as const,
  byVoyage: (voyageId: number) => [...reservationKeys.all, 'voyage', voyageId] as const,
  byVoyageActive: (voyageId: number) => [...reservationKeys.all, 'voyage', voyageId, 'active'] as const,
  byVoyageur: (voyageurId: number) => [...reservationKeys.all, 'voyageur', voyageurId] as const,
  guest: (phoneNumber?: string, idNumber?: string) =>
    [...reservationKeys.all, 'guest', phoneNumber ?? '', idNumber ?? ''] as const,
  payments: () => [...reservationKeys.all, 'payments'] as const,
  payment: (reservationId: number) => [...reservationKeys.payments(), reservationId] as const,
};

// Hooks for fetching data
export const useReservationsByVoyageId = (voyageId: number) => {
  return useQuery<Reservation[]>({
    queryKey: reservationKeys.byVoyage(voyageId),
    queryFn: () => getReservationsByVoyageId(voyageId),
    enabled: !!voyageId,
  });
};

export const useReservationById = (reservationId: number) => {
  return useQuery<Reservation>({
    queryKey: reservationKeys.detail(reservationId),
    queryFn: () => getReservation(reservationId),
    enabled: !!reservationId,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (reservation: Partial<Reservation>) => {
      if (user?.id) {
        reservation.voyageur = { id: user.id } as Voyageur;
      }
      return createReservation(reservation);
    },
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: reservationKeys.all });
      if (data.voyage?.id) {
        await queryClient.invalidateQueries({ queryKey: reservationKeys.byVoyage(data.voyage.id) });
      }
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Reservation> }) => updateReservation(id, data),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: reservationKeys.all });
      if (data.id) {
        await queryClient.invalidateQueries({ queryKey: reservationKeys.detail(data.id) });
      }
      if (data.voyage?.id) {
        await queryClient.invalidateQueries({ queryKey: reservationKeys.byVoyage(data.voyage.id) });
      }
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReservation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
};

const invalidateReservationCache = async (queryClient: QueryClient, data: Reservation) => {
  await queryClient.invalidateQueries({ queryKey: reservationKeys.all });

  if (data.id) {
    await queryClient.invalidateQueries({ queryKey: reservationKeys.detail(data.id) });
  }

  if (data.voyage?.id) {
    await queryClient.invalidateQueries({ queryKey: reservationKeys.byVoyage(data.voyage.id) });
    await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.byVoyage(data.voyage.id) });
    await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.available(data.voyage.id) });
    await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.reserved(data.voyage.id) });
    await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.count(data.voyage.id) });
  }

  await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.all });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ReservationStatusEnum }) => cancelReservation(id, status),
    onSuccess: async data => await invalidateReservationCache(queryClient, data),
  });
};

export const useCancelReservationByUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReservationByUser,
    onSuccess: async data => await invalidateReservationCache(queryClient, data),
  });
};

export const useCancelReservationByOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReservationByOperator,
    onSuccess: async data => await invalidateReservationCache(queryClient, data),
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<PaymentResponse, Error, PaymentRequest>({
    mutationFn: processPayment,
    onSuccess: async (data, variables) => {
      // Invalidate payment-specific queries
      await queryClient.invalidateQueries({ queryKey: reservationKeys.payments() });
      await queryClient.invalidateQueries({ queryKey: reservationKeys.payment(variables.reservationId) });

      // Invalidate and refetch reservations
      await queryClient.invalidateQueries({ queryKey: reservationKeys.all });

      if (data.reservation?.voyage?.id) {
        await queryClient.invalidateQueries({
          queryKey: reservationKeys.byVoyage(data.reservation.voyage.id),
        });
      }

      if (data.reservation?.id) {
        await queryClient.invalidateQueries({
          queryKey: reservationKeys.detail(data.reservation.id),
        });
      }
    },
    onError: (error: Error) => {
      console.error('Payment processing failed:', error.message);
    },
  });
};

// Hook for handling reservation success operations
export const useReservationSuccess = () => {
  const queryClient = useQueryClient();

  const handleReservationSuccess = async (reservation: Reservation) => {
    if (reservation.voyage?.id) {
      await queryClient.invalidateQueries({
        queryKey: reservationKeys.byVoyage(reservation.voyage.id),
      });
    }

    await queryClient.invalidateQueries({ queryKey: reservationKeys.all });

    return reservation;
  };

  return { handleReservationSuccess };
};

// hooks for reservation by traveller Id
export const useReservationsByVoyageurId = (voyageurId: number) => {
  return useQuery<Reservation[]>({
    queryKey: reservationKeys.byVoyageur(voyageurId),
    queryFn: () => getReservationsByVoyageurId(voyageurId),
    enabled: !!voyageurId,
  });
};

// Hook for guest reservations (by phone number)
export const useGuestReservations = (phoneNumber?: string, idNumber?: string) => {
  return useQuery<Reservation[]>({
    queryKey: reservationKeys.guest(phoneNumber, idNumber),
    queryFn: () => getGuestReservations(phoneNumber, idNumber),
    enabled: Boolean(phoneNumber) || Boolean(idNumber),
  });
};

export const useReservationsNotCanceledByVoyageId = (voyageId: number) => {
  return useQuery<Reservation[]>({
    queryKey: reservationKeys.byVoyageActive(voyageId),
    queryFn: () => getReservationsNotCanceledByVoyageId(voyageId),
    enabled: !!voyageId,
  });
};
