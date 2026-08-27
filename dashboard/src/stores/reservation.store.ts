import { create } from 'zustand';
import type { ReservationSortConfig, Reservation } from '@/types/reservation.types';
import { ReservationStatusEnum, PaymentStatusEnum, type ReservationFilters } from '@/types/reservation.types';

interface ReservationState {
  // Filters
  filters: ReservationFilters;
  setFilters: (filters: Partial<ReservationFilters>) => void;
  resetFilters: () => void;

  // Selected reservation
  selectedReservation: Reservation | null;
  setSelectedReservation: (reservation: Reservation | null) => void;

  // Sort
  sortConfig: ReservationSortConfig;
  setSortConfig: (config: ReservationSortConfig) => void;

  // UI state
  isFiltersPanelOpen: boolean;
  setFiltersPanelOpen: (open: boolean) => void;
}

const defaultFilters: ReservationFilters = {
  status: ReservationStatusEnum.CONFIRMED,
  paymentStatus: PaymentStatusEnum.PAID,
  searchQuery: '',
  phoneNumber: '',
  dateFrom: '',
  dateTo: '',
};

const defaultSortConfig: ReservationSortConfig = {
  field: 'bookingDate',
  direction: 'desc',
};

export const useReservationStore = create<ReservationState>((set) => ({
  // Filters
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),

  // Selected reservation
  selectedReservation: null,
  setSelectedReservation: (reservation) => set({ selectedReservation: reservation }),

  // Sort
  sortConfig: defaultSortConfig,
  setSortConfig: (config) => set({ sortConfig: config }),

  // UI state
  isFiltersPanelOpen: false,
  setFiltersPanelOpen: (open) => set({ isFiltersPanelOpen: open }),
}));
