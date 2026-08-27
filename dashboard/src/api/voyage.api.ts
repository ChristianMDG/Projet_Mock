import api from './axios';
import { toIsoDate } from '@/utils/format';
import type { Voyage, VoyageDayGroup, VoyageFilters, VoyageQuickFilter, VoyageStatusEnum } from '@/types/voyage.types';

const BASE = '/voyages';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface VoyageFilterParams {
  koperativeId?: number;
  departureVilleId?: number;
  arrivalVilleId?: number;
  departureGareId?: number;
  arrivalGareId?: number;
  departureDate?: string;
  departureFrom?: string;
  departureTo?: string;
  statuses?: string[];
  language?: string;
  passengers?: number;
}

const cleanParams = (params: VoyageFilterParams) => {
  const out: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value) && value.length === 0) return;
    out[key] = value;
  });
  return out;
};

export const getVoyages = async (page = 0, size = 20): Promise<PageResponse<Voyage>> => {
  const { data } = await api.get<PageResponse<Voyage>>(BASE, {
    params: { page, size },
  });
  return data;
};

export const getVoyageDetail = async (id: number): Promise<Voyage> => {
  const { data } = await api.get<Voyage>(`${BASE}/${id}`);
  return data;
};

export const getVoyageDetails = async (id: number): Promise<Voyage> => {
  const { data } = await api.get<Voyage>(`${BASE}/${id}/details`);
  return data;
};

export const getFilteredVoyages = async (params: VoyageFilterParams): Promise<Voyage[]> => {
  const { data } = await api.get<Voyage[]>(`${BASE}/filtered`, {
    params: cleanParams(params),
  });
  return data;
};

export const getGroupedVoyages = async (params: VoyageFilterParams): Promise<VoyageDayGroup[]> => {
  const { data } = await api.get<VoyageDayGroup[]>(`${BASE}/filtered/grouped`, {
    params: cleanParams(params),
  });
  return data;
};

export const getScheduledVoyagesByGare = async (gareId: number): Promise<Voyage[]> => {
  const { data } = await api.get<Voyage[]>(`${BASE}/scheduled/gare/${gareId}`);
  return data;
};

export const updateVoyage = async (id: number, voyage: Partial<Voyage>): Promise<Voyage> => {
  const { data } = await api.put<Voyage>(`${BASE}/${id}`, { ...voyage, id });
  return data;
};

export const updateVoyageStatus = async (id: number, status: VoyageStatusEnum, current: Voyage): Promise<Voyage> => {
  return updateVoyage(id, { ...current, status });
};

/** Maps store filters to API query params, computing a 7-day range when dateTo is absent. */
export function toApiParams(
  filters: Pick<
    VoyageFilters,
    'koperativeId' | 'departureVilleId' | 'arrivalVilleId' | 'dateFrom' | 'dateTo' | 'statuses'
  >
): VoyageFilterParams {
  const departureFrom = filters.dateFrom ?? toIsoDate(new Date());
  let departureTo = filters.dateTo;
  if (departureTo === undefined) {
    const base = new Date(`${departureFrom}T00:00:00`);
    base.setDate(base.getDate() + 6);
    departureTo = toIsoDate(base);
  }
  return {
    koperativeId: filters.koperativeId,
    departureVilleId: filters.departureVilleId,
    arrivalVilleId: filters.arrivalVilleId,
    departureFrom,
    departureTo,
    statuses: filters.statuses,
  };
}

/** Applies client-side quick filter on already-fetched voyages. */
export function applyQuickFilter(voyages: Voyage[], quick: VoyageQuickFilter | undefined): Voyage[] {
  if (quick === null || quick === undefined) return voyages;
  return voyages.filter((v) => {
    if (quick === 'has_seats') return (v.availableSeats ?? 0) > 0;

    const totalSeats = v.crafter?.seatCapacity ?? 0;
    if (quick === 'almost_full') {
      if (totalSeats > 0) {
        const reserved = totalSeats - (v.availableSeats ?? 0);
        return reserved / totalSeats >= 0.9;
      }
      return false;
    }

    if (v.departureTime) {
      const depDate = new Date(v.departureTime);
      depDate.setHours(0, 0, 0, 0);
      const dep = depDate.getTime();

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const today = todayDate.getTime();

      if (quick === 'today') return dep === today;

      if (quick === 'tomorrow') {
        const tomorrow = new Date(todayDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return dep === tomorrow.getTime();
      }

      if (quick === 'this_week') {
        const end = new Date(todayDate);
        end.setDate(end.getDate() + 7);
        return dep >= today && dep < end.getTime();
      }
    }

    return false;
  });
}
