import axiosInstance from './axios';
import {
  RentalReservationCreateRequest,
  RentalReservation,
  RentalPaymentInitiateRequest,
  RentalPaymentInitiationResponse,
} from '@/types/rental.types';

export const createReservation = async (request: RentalReservationCreateRequest): Promise<RentalReservation> => {
  const { data } = await axiosInstance.post<RentalReservation>('/api/rental/reservations', request);
  return data;
};

export const getReservation = async (id: number): Promise<RentalReservation> => {
  const { data } = await axiosInstance.get<RentalReservation>(`/api/rental/reservations/${id}`);
  return data;
};

export const initiateRentalPayment = async (
  id: number,
  request: RentalPaymentInitiateRequest,
): Promise<RentalPaymentInitiationResponse> => {
  const { data } = await axiosInstance.post<RentalPaymentInitiationResponse>(
    `/api/rental/reservations/${id}/payment/initiate`,
    request,
  );
  return data;
};
