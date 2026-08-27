import api from './axios';
import type { Seat, SeatStatusEnum } from '@/types/voyage.types';

const BASE = '/seats';

export const getSeatsByVoyage = async (voyageId: number): Promise<Seat[]> => {
  const { data } = await api.get<Seat[]>(`${BASE}/voyage/${voyageId}`);
  return data;
};

export const getReservedSeatsByVoyage = async (voyageId: number): Promise<Seat[]> => {
  const { data } = await api.get<Seat[]>(`${BASE}/voyage/${voyageId}/reserved`);
  return data;
};

export const getAvailableSeatsByVoyage = async (voyageId: number): Promise<Seat[]> => {
  const { data } = await api.get<Seat[]>(`${BASE}/voyage/${voyageId}/available`);
  return data;
};

export const countAvailableSeatsByVoyage = async (voyageId: number): Promise<number> => {
  const { data } = await api.get<number>(`${BASE}/voyage/${voyageId}/count-available`);
  return data;
};

export const updateSeatStatus = async (seatId: number, status: SeatStatusEnum): Promise<Seat> => {
  const { data } = await api.put<Seat>(`${BASE}/${seatId}/status`, null, {
    params: { status },
  });
  return data;
};

export const getSeatsByVoyageAndReservation = async (voyageId: number, reservationId: number): Promise<Seat[]> => {
  const { data } = await api.get<Seat[]>(`${BASE}/voyage/${voyageId}/reservation/${reservationId}`);
  return data;
};
