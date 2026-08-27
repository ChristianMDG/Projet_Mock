import { RentalPaymentInitiateRequest } from '@/types/rental.types';
import { useQuery, useMutation } from '@tanstack/react-query';

import { createReservation, getReservation, initiateRentalPayment } from '../api/reservation.api';

export const useCreateReservation = () => {
  return useMutation({
    mutationFn: createReservation,
  });
};

export const useReservation = (id: number | null) => {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: () => getReservation(id!),
    enabled: !!id,
    retry: false,
  });
};

export const useInitiateRentalPayment = (id: number) => {
  return useMutation({
    mutationFn: (request: RentalPaymentInitiateRequest) => initiateRentalPayment(id, request),
  });
};
