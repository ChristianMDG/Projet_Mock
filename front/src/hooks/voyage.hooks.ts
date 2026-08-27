import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from '@/utils/dayjs';
import {
  checkResourceAvailability,
  createVoyage,
  deleteVoyage,
  findAvailableVoyages,
  findFilteredVoyages,
  findGroupedVoyages,
  findGroupedVoyagesByKoperative,
  generateRecurringInstances,
  getScheduledVoyagesByGare,
  getScheduledVoyagesByGares,
  getUserPreviousVoyages,
  getVoyage,
  getVoyageByReservationId,
  getVoyages,
  getVoyagesByDateRange,
  getVoyagesByKoperative,
  getWeeklyResults,
  getMonthlyResults,
  scheduleVoyage,
  updateVoyage,
} from '@/api/voyage.api';
import { Voyage } from '@/types';
import {
  VoyageFilter,
  VoyageClasses,
  VoyageWeeklyResponse,
  MonthlyVoyageFilter,
  VoyageMonthlyResponse,
} from '@/types/type.util';

// Cache times in milliseconds
const CACHE_TIMES = {
  VOYAGE_LIST: 5 * 60 * 1000, // 5 minutes
  VOYAGE_AVAILABILITY: 2 * 60 * 1000, // 2 minutes
  VOYAGE_FILTER: 3 * 60 * 1000, // 3 minutes
} as const;

// Query keys for better caching
export const voyageKeys = {
  all: ['voyages'] as const,
  lists: () => [...voyageKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...voyageKeys.lists(), filters] as const,
  details: () => [...voyageKeys.all, 'detail'] as const,
  detail: (id: number) => [...voyageKeys.details(), id] as const,
  koperative: (id: number) => [...voyageKeys.all, 'koperative', id] as const,
  filtered: (filter: VoyageFilter) => [...voyageKeys.all, 'filtered', filter] as const,
  grouped: (filter: VoyageFilter) => [...voyageKeys.all, 'grouped', filter] as const,
  groupedKoperative: (filter: VoyageFilter) => [...voyageKeys.all, 'groupedKoperative', filter] as const,
  scheduled: (gareIds: number[]) => [...voyageKeys.all, 'scheduled', gareIds] as const,
  available: (departureId: number, arrivalId: number, date: string) =>
    [...voyageKeys.all, 'available', departureId, arrivalId, date] as const,
  dateRange: (startDate: string, endDate: string) => [...voyageKeys.all, 'dateRange', startDate, endDate] as const,
  byReservation: (reservationId: number) => [...voyageKeys.all, 'byReservation', reservationId] as const,
  weekly: (
    departureVilleId: number,
    arrivalVilleId: number,
    year: number,
    weekNumber: number,
    koperativeId?: number,
    language?: string,
    passengers?: number,
  ) =>
    [
      ...voyageKeys.all,
      'weekly',
      departureVilleId,
      arrivalVilleId,
      year,
      weekNumber,
      koperativeId,
      language,
      passengers,
    ] as const,
  monthly: (
    departureVilleId: number,
    arrivalVilleId: number,
    month: string,
    koperativeId?: number,
    language?: string,
    passengers?: number,
  ) =>
    [
      ...voyageKeys.all,
      'monthly',
      departureVilleId,
      arrivalVilleId,
      month,
      koperativeId,
      language,
      passengers,
    ] as const,
};

// Fetch paginated voyages
export function useVoyages(page = 0, size = 20) {
  return useQuery<
    {
      content: Voyage[];
      totalElements: number;
      totalPages: number;
    },
    Error
  >({
    queryKey: voyageKeys.list({ page, size }),
    queryFn: () => getVoyages(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch voyages by koperative
export function useVoyagesByKoperative(koperativeId: number) {
  return useQuery<Voyage[], Error>({
    queryKey: voyageKeys.koperative(koperativeId),
    queryFn: () => getVoyagesByKoperative(koperativeId),
    enabled: !!koperativeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch voyage details
export function useVoyage(id: number) {
  return useQuery<Voyage, Error>({
    queryKey: voyageKeys.detail(id),
    queryFn: () => getVoyage(id),
    enabled: !!id,
    staleTime: 10 * 1000, // 10 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });
}

// Fetch voyage by reservation ID
export function useVoyageByReservationId(reservationId?: number) {
  return useQuery<Voyage, Error>({
    queryKey: voyageKeys.byReservation(reservationId!),
    queryFn: () => getVoyageByReservationId(reservationId!),
    enabled: !!reservationId,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });
}

// Find available voyages
export function useAvailableVoyages(departureGareId?: number, arrivalGareId?: number, departureDate?: string) {
  return useQuery<Voyage[], Error>({
    queryKey: voyageKeys.available(departureGareId!, arrivalGareId!, departureDate!),
    queryFn: () => findAvailableVoyages(departureGareId!, arrivalGareId!, departureDate!),
    enabled: !!departureGareId && !!arrivalGareId && !!departureDate,
    staleTime: 15 * 1000, // 15 seconds for availability data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

// Find voyages by date range
export function useVoyagesByDateRange(startDate?: string, endDate?: string) {
  return useQuery<Voyage[], Error>({
    queryKey: voyageKeys.dateRange(startDate!, endDate!),
    queryFn: () => getVoyagesByDateRange(startDate!, endDate!),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Check resource availability
export function useResourceAvailability() {
  return useMutation<
    boolean,
    Error,
    {
      crafterId?: number;
      chauffeurId?: number;
      departureTime: string;
      estimatedArrivalTime: string;
      excludeVoyageId?: number;
    }
  >({
    mutationFn: ({ crafterId, chauffeurId, departureTime, estimatedArrivalTime, excludeVoyageId }) =>
      checkResourceAvailability(crafterId, chauffeurId, departureTime, estimatedArrivalTime, excludeVoyageId),
  });
}

// Schedule voyage (single or recurring)
export function useScheduleVoyage() {
  const queryClient = useQueryClient();
  return useMutation<Voyage[], Error, { koperativeId?: number; [key: string]: unknown }>({
    mutationFn: scheduleVoyage,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['voyages'] });
      if (variables.koperativeId) {
        await queryClient.invalidateQueries({ queryKey: ['voyages', 'koperative', variables.koperativeId] });
      }
    },
  });
}

// Generate recurring instances
export function useGenerateRecurringInstances() {
  const queryClient = useQueryClient();
  return useMutation<Voyage[], Error, { templateId: number; maxInstances?: number }>({
    mutationFn: ({ templateId, maxInstances = 100 }) => generateRecurringInstances(templateId, maxInstances),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['voyages'] });
    },
  });
}

// Create voyage
export function useCreateVoyage() {
  const queryClient = useQueryClient();
  return useMutation<Voyage, Error, Partial<Voyage>>({
    mutationFn: createVoyage,
    onSuccess: async data => {
      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ queryKey: voyageKeys.all });

      if (data.koperative?.id) {
        await queryClient.invalidateQueries({
          queryKey: voyageKeys.koperative(data.koperative.id),
        });
      }

      // Set the new voyage in cache
      queryClient.setQueryData(voyageKeys.detail(data.id!), data);
    },
    onError: error => {
      console.error('Error creating voyage:', error);
    },
  });
}

// Update voyage
export function useUpdateVoyage() {
  const queryClient = useQueryClient();
  return useMutation<Voyage, Error, { id: number; voyage: Partial<Voyage> }>({
    mutationFn: ({ id, voyage }) => updateVoyage(id, voyage),
    onSuccess: async data => {
      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ queryKey: voyageKeys.all });

      // Update the specific voyage in cache
      queryClient.setQueryData(voyageKeys.detail(data.id!), data);

      if (data.koperative?.id) {
        await queryClient.invalidateQueries({
          queryKey: voyageKeys.koperative(data.koperative.id),
        });
      }
    },
    onError: error => {
      console.error('Error updating voyage:', error);
    },
  });
}

// Delete voyage
export function useDeleteVoyage() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteVoyage,
    onSuccess: async (_, voyageId) => {
      // Remove the voyage from cache
      queryClient.removeQueries({ queryKey: voyageKeys.detail(voyageId) });

      // Invalidate lists to refetch updated data
      await queryClient.invalidateQueries({ queryKey: voyageKeys.lists() });
    },
    onError: error => {
      console.error('Error deleting voyage:', error);
    },
  });
}

// NEW HOOKS FOR VOYAGE MANAGEMENT

// Fetch scheduled voyages by gare ordered by departure time descending
export function useScheduledVoyagesByGare(gareId: number) {
  return useQuery<Voyage[], Error>({
    queryKey: voyageKeys.scheduled([gareId]),
    queryFn: () => getScheduledVoyagesByGare(gareId),
    enabled: !!gareId,
    staleTime: 2 * 60 * 1000, // 2 minutes for live schedule data
  });
}

// Fetch scheduled voyages by multiple gares ordered by departure time descending
export function useScheduledVoyagesByGares(gareIds: number[]) {
  return useQuery<Voyage[], Error>({
    queryKey: voyageKeys.scheduled(gareIds),
    queryFn: () => getScheduledVoyagesByGares(gareIds),
    enabled: gareIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for live schedule data
  });
}

// Fetch voyages by filter criteria
export function useFilteredVoyages(filter: VoyageFilter) {
  return useQuery<Voyage[], Error>({
    queryKey: voyageKeys.filtered(filter),
    queryFn: () => findFilteredVoyages(filter),
    enabled: !!filter.koperativeId,
    staleTime: CACHE_TIMES.VOYAGE_FILTER, // 3 minutes for filtered results
  });
}

// Fetch pre-grouped voyages from server
export function useGroupedVoyages(filter: VoyageFilter) {
  return useQuery<VoyageClasses[], Error>({
    queryKey: voyageKeys.grouped(filter),
    queryFn: () => findGroupedVoyages(filter),
    enabled: !!(filter.koperativeId || (filter.departureVilleId && filter.arrivalVilleId && filter.departureDate)),
    staleTime: CACHE_TIMES.VOYAGE_FILTER,
  });
}

// Fetch pre-grouped voyages from server filtered by koperative
export function useGroupedVoyagesByKoperative(filter: VoyageFilter) {
  return useQuery<VoyageClasses[], Error>({
    queryKey: voyageKeys.groupedKoperative(filter),
    queryFn: () => findGroupedVoyagesByKoperative(filter),
    enabled: !!filter.koperativeId,
    staleTime: CACHE_TIMES.VOYAGE_FILTER,
  });
}

// hooks for previous voyages of a traveller (paginated / infinite scroll)
export const useUserPreviousVoyages = (voyageurId: number, pageSize = 10) => {
  return useInfiniteQuery({
    queryKey: ['voyages', 'voyageur', voyageurId, 'previous', pageSize],
    queryFn: ({ pageParam }) => getUserPreviousVoyages(voyageurId, pageParam as number, pageSize),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (allPages.length < lastPage.totalPages ? allPages.length : undefined),
    enabled: !!voyageurId,
  });
};

// Fetch weekly voyage results
export function useWeeklyVoyageResults(filter: VoyageFilter) {
  // Extract week number and year from departure date for stable query key
  const departureDate = dayjs(filter.departureDate);
  const weekNumber = departureDate.week();
  const year = departureDate.year();

  return useQuery<VoyageWeeklyResponse, Error>({
    queryKey: voyageKeys.weekly(
      filter.departureVilleId!,
      filter.arrivalVilleId!,
      year,
      weekNumber,
      filter.koperativeId,
      filter.language,
      filter.passengers,
    ),
    queryFn: async () => {
      return getWeeklyResults(filter);
    },
    enabled: Boolean(filter.departureVilleId && filter.arrivalVilleId && filter.departureDate),
    staleTime: 120000, // 2 minutes
    placeholderData: keepPreviousData,
  });
}

// Fetch monthly voyage results (day-level price summary)
export function useMonthlyVoyageResults(filter: MonthlyVoyageFilter) {
  return useQuery<VoyageMonthlyResponse, Error>({
    queryKey: voyageKeys.monthly(
      filter.departureVilleId!,
      filter.arrivalVilleId!,
      filter.month,
      filter.koperativeId,
      filter.language,
      filter.passengers,
    ),
    queryFn: () => getMonthlyResults(filter),
    enabled: Boolean(filter.departureVilleId && filter.arrivalVilleId && filter.month),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
}
