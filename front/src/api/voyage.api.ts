import axios from './axios';
import { Voyage } from '@/types';
import {
  MonthlyVoyageFilter,
  VoyageFilter,
  VoyageClasses,
  VoyageMonthlyResponse,
  VoyageWeeklyResponse,
} from '@/types/type.util';
import { PaginatedResponse } from '@/types/api.types';

const API_URL = '/voyages';

export const getVoyages = async (page = 0, size = 20) => {
  const { data } = await axios.get<PaginatedResponse<Voyage>>(`${API_URL}?page=${page}&size=${size}`);
  return data;
};

export const getVoyage = async (id: number) => {
  const { data } = await axios.get<Voyage>(`${API_URL}/${id}/details`);
  return data;
};

export const getVoyagesByKoperative = async (koperativeId: number) => {
  const { data } = await axios.get<Voyage[]>(`${API_URL}/koperative/${koperativeId}`);
  return data;
};

export const createVoyage = async (voyage: Partial<Voyage>) => {
  const { data } = await axios.post<Voyage>(API_URL, voyage);
  return data;
};

export const updateVoyage = async (id: number, voyage: Partial<Voyage>) => {
  const { data } = await axios.put<Voyage>(`${API_URL}/${id}`, voyage);
  return data;
};

export const deleteVoyage = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const scheduleVoyage = async (scheduleData: unknown) => {
  const { data } = await axios.post<Voyage[]>(`${API_URL}/schedule`, scheduleData);
  return data;
};

export const findAvailableVoyages = async (departureGareId: number, arrivalGareId: number, departureDate: string) => {
  const { data } = await axios.get<Voyage[]>(`${API_URL}/available`, {
    params: { departureGareId, arrivalGareId, departureDate },
  });
  return data;
};

export const getVoyagesByDateRange = async (startDate: string, endDate: string) => {
  const { data } = await axios.get<Voyage[]>(`${API_URL}/date-range`, {
    params: { startDate, endDate },
  });
  return data;
};

export const checkResourceAvailability = async (
  crafterId?: number,
  chauffeurId?: number,
  departureTime?: string,
  estimatedArrivalTime?: string,
  excludeVoyageId?: number,
) => {
  const { data } = await axios.get<boolean>(`${API_URL}/resource-availability`, {
    params: { crafterId, chauffeurId, departureTime, estimatedArrivalTime, excludeVoyageId },
  });
  return data;
};

export const generateRecurringInstances = async (templateId: number, maxInstances = 100) => {
  const { data } = await axios.post<Voyage[]>(`${API_URL}/${templateId}/generate-instances`, null, {
    params: { maxInstances },
  });
  return data;
};

export const getScheduledVoyagesByGare = async (gareId: number) => {
  const { data } = await axios.get<Voyage[]>(`${API_URL}/scheduled/gare/${gareId}`);
  return data;
};

export const getScheduledVoyagesByGares = async (gareIds: number[]) => {
  const params = new URLSearchParams();
  for (const id of gareIds) {
    params.append('gareIds', id.toString());
  }
  const { data } = await axios.get<Voyage[]>(`${API_URL}/scheduled/gares?${params}`);
  return data;
};

export const findFilteredVoyages = async (filter: VoyageFilter) => {
  const { data } = await axios.get<Voyage[]>(`${API_URL}/filtered`, {
    params: filter,
  });
  return data;
};

export const getUserPreviousVoyages = async (voyageurId: number, page = 0, size = 10) => {
  const { data } = await axios.get<PaginatedResponse<Voyage>>(`${API_URL}/previous/${voyageurId}`, {
    params: { page, size },
  });
  return data;
};

export const getVoyageByReservationId = async (reservationId: number) => {
  const { data } = await axios.get<Voyage>(`${API_URL}/by-reservation/${reservationId}`);
  return data;
};

export const getWeeklyResults = async (filter: VoyageFilter) => {
  const { data } = await axios.get<VoyageWeeklyResponse>(`${API_URL}/weekly-results`, {
    params: { ...filter },
  });
  return data;
};

export const getMonthlyResults = async (filter: MonthlyVoyageFilter) => {
  const { data } = await axios.get<VoyageMonthlyResponse>(`${API_URL}/monthly-results`, {
    params: { ...filter },
  });
  return data;
};

export const findGroupedVoyages = async (filter: VoyageFilter) => {
  const { data } = await axios.get<VoyageClasses[]>(`${API_URL}/filtered/grouped`, { params: filter });
  return data;
};

export const findGroupedVoyagesByKoperative = async (filter: VoyageFilter) => {
  const { data } = await axios.get<VoyageClasses[]>(`${API_URL}/filtered/grouped/koperative`, { params: filter });
  return data;
};
