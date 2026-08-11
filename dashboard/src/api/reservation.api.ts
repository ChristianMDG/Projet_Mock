import api from './axios';
import type { Reservation, ReservationStatusEnum, ReservationFilters } from '@/types/reservation.types';

const API_URL = '/reservations';

// Paginated response from Spring Data
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
}

export const getAllReservations = async (): Promise<Reservation[]> => {
  const { data } = await api.get<Reservation[]>(API_URL);
  return data;
};

// Server-side filtered and paginated reservations using POST
export const searchReservations = async (
  filters: ReservationFilters,
  page = 0,
  size = 15
): Promise<PageResponse<Reservation>> => {
  const { data } = await api.post<PageResponse<Reservation>>(`${API_URL}/search`, {
    status: filters.status,
    phoneNumber: filters.phoneNumber,
    bookingReference: filters.bookingReference,
    page,
    size,
  });
  return data;
};

export const getReservationById = async (id: number): Promise<Reservation> => {
  const { data } = await api.get<Reservation>(`${API_URL}/${id}`);
  return data;
};

export const getReservationsByVoyageId = async (voyageId: number): Promise<Reservation[]> => {
  const { data } = await api.get<Reservation[]>(`${API_URL}/voyage/${voyageId}`);
  return data;
};

export const updateReservationStatus = async (id: number, status: ReservationStatusEnum): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(`${API_URL}/${id}/status`, { status });
  return data;
};

export const cancelReservation = async (id: number, status: ReservationStatusEnum): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(`${API_URL}/${id}/cancel?status=${status}`);
  return data;
};

export const confirmReservation = async (id: number): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(`${API_URL}/${id}/confirm`);
  return data;
};

export const cancelReservationByOperator = async (id: number): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(`${API_URL}/${id}/cancel?status=CANCELLED_BY_OPERATOR`);
  return data;
};

export default {
  getAllReservations,
  getReservationById,
  getReservationsByVoyageId,
  updateReservationStatus,
  cancelReservation,
  cancelReservationByOperator,
};
