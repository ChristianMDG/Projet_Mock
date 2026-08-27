import axios from './axios';
import { AxiosError } from 'axios';
import { Reservation } from '@/models/Reservation';
import { PaymentRequest, PaymentResponse } from '@/models/Payment';
import { ReservationStatusEnum } from '@/models/enums';

const API_URL = '/reservations';

export const getReservationsByVoyageId = async (voyageId: number) => {
  const { data } = await axios.get<Reservation[]>(`${API_URL}/voyage/${voyageId}`);
  return data;
};

export const createReservation = async (reservation: Partial<Reservation>) => {
  const { data } = await axios.post<Reservation>(API_URL, reservation);
  return data;
};

export const getReservation = async (id: number) => {
  const { data } = await axios.get<Reservation>(`${API_URL}/${id}`);
  return data;
};

export const updateReservation = async (id: number, reservation: Partial<Reservation>) => {
  const { data } = await axios.put<Reservation>(`${API_URL}/${id}`, reservation);
  return data;
};

export const deleteReservation = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const cancelReservation = async (id: number, status: ReservationStatusEnum) => {
  const { data } = await axios.patch<Reservation>(`${API_URL}/${id}/cancel?status=${status}`);
  return data;
};

export const cancelReservationByUser = async (id: number) => {
  return cancelReservation(id, ReservationStatusEnum.CANCELLED_BY_USER);
};

export const cancelReservationByOperator = async (id: number) => {
  return cancelReservation(id, ReservationStatusEnum.CANCELLED_BY_OPERATOR);
};

export const processPayment = async (paymentData: PaymentRequest) => {
  try {
    const { data } = await axios.post<PaymentResponse>(`${API_URL}/${paymentData.payableId}/payment`, paymentData);
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Payment failed');
  }
};

// get reservation by traveller
export const getReservationsByVoyageurId = async (voyageurId: number) => {
  const { data } = await axios.get<Reservation[]>(`${API_URL}/voyageur/${voyageurId}`);
  return data;
};

// get reservations by phone and ID number (for guest users)
export const getGuestReservations = async (phoneNumber?: string, idNumber?: string) => {
  const params: Record<string, string> = {};
  if (phoneNumber) params.phoneNumber = phoneNumber;
  if (idNumber) params.idNumber = idNumber;

  const { data } = await axios.get<Reservation[]>(`${API_URL}/guest`, { params });
  return data;
};

export const getReservationsNotCanceledByVoyageId = async (voyageId: number) => {
  const { data } = await axios.get<Reservation[]>(`${API_URL}/voyage/${voyageId}/active`);
  return data;
};

// Confirm reservation without voyageur (for OPERATOR/ADMIN)
export interface ReservationWithoutVoyageurRequest {
  voyageId: number;
  classeId?: number | null;
  crafterId?: number | null;
  seatNumbers: string[];
  notes?: string;
}

export const confirmReservationWithoutVoyageur = async (request: ReservationWithoutVoyageurRequest) => {
  try {
    const { data } = await axios.post<Reservation>(`${API_URL}/confirm-without-voyageur`, request);
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Confirmation failed');
  }
};

export const attachVoyageurToReservation = async (reservationId: number, voyageurId: number) => {
  const { data } = await axios.patch<Reservation>(`${API_URL}/${reservationId}/voyageur`, null, {
    params: { voyageurId },
  });
  return data;
};

export default {
  getReservationsByVoyageId,
  createReservation,
  getReservation,
  updateReservation,
  deleteReservation,
  cancelReservation,
  cancelReservationByUser,
  cancelReservationByOperator,
  processPayment,
  getReservationsByVoyageurId,
  confirmReservationWithoutVoyageur,
  getReservationsNotCanceledByVoyageId,
};
