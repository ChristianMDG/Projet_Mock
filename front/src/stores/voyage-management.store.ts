import { create } from 'zustand';
import { VoyageStatusEnum } from '@/models/enums';
import { Dayjs } from 'dayjs';

export interface VoyageManagementFilters {
  koperativeIds: number[];
  gareIds: number[];
  statusFilter: VoyageStatusEnum[];
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  searchQuery: string;
  routeFilter: string;
  showTemplatesOnly: boolean;
  showInstancesOnly: boolean;
}

interface VoyageManagementState {
  // Filters
  filters: VoyageManagementFilters;

  // Selection and bulk operations
  selectedVoyageIds: number[];
  selectAll: boolean;

  // UI states
  isFilterDrawerOpen: boolean;
  bulkActionDialogOpen: boolean;
  selectedBulkAction: 'status' | 'delete' | 'export' | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // View mode
  viewMode: 'table' | 'card' | 'calendar';

  // Actions
  setFilters: (filters: Partial<VoyageManagementFilters>) => void;
  resetFilters: () => void;

  // Selection actions
  toggleVoyageSelection: (voyageId: number) => void;
  selectAllVoyages: (voyageIds: number[]) => void;
  clearSelection: () => void;
  setSelectAll: (selectAll: boolean) => void;

  // UI actions
  setFilterDrawerOpen: (open: boolean) => void;
  setBulkActionDialog: (open: boolean, action?: 'status' | 'delete' | 'export' | null) => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;

  // View actions
  setViewMode: (mode: 'table' | 'card' | 'calendar') => void;

  // Reset state
  resetState: () => void;
}

const initialFilters: VoyageManagementFilters = {
  koperativeIds: [],
  gareIds: [],
  statusFilter: [],
  dateRange: {
    startDate: null,
    endDate: null,
  },
  searchQuery: '',
  routeFilter: '',
  showTemplatesOnly: false,
  showInstancesOnly: false,
};

const initialState = {
  filters: initialFilters,
  selectedVoyageIds: [],
  selectAll: false,
  isFilterDrawerOpen: false,
  bulkActionDialogOpen: false,
  selectedBulkAction: null,
  currentPage: 0,
  pageSize: 20,
  sortBy: 'departureTime',
  sortOrder: 'desc' as const,
  viewMode: 'table' as const,
};

export const useVoyageManagementStore = create<VoyageManagementState>(set => ({
  ...initialState,

  // Filter actions
  setFilters: newFilters =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 0, // Reset pagination when filters change
    })),

  resetFilters: () =>
    set(() => ({
      filters: initialFilters,
      currentPage: 0,
      selectedVoyageIds: [],
      selectAll: false,
    })),

  // Selection actions
  toggleVoyageSelection: voyageId =>
    set(state => {
      const isSelected = state.selectedVoyageIds.includes(voyageId);
      const newSelection = isSelected
        ? state.selectedVoyageIds.filter(id => id !== voyageId)
        : [...state.selectedVoyageIds, voyageId];

      return {
        selectedVoyageIds: newSelection,
        selectAll: false, // Reset select all when individual items are toggled
      };
    }),

  selectAllVoyages: voyageIds =>
    set(() => ({
      selectedVoyageIds: voyageIds,
      selectAll: true,
    })),

  clearSelection: () =>
    set(() => ({
      selectedVoyageIds: [],
      selectAll: false,
    })),

  setSelectAll: selectAll => set(() => ({ selectAll })),

  // UI actions
  setFilterDrawerOpen: open => set(() => ({ isFilterDrawerOpen: open })),

  setBulkActionDialog: (open, action = null) =>
    set(() => ({
      bulkActionDialogOpen: open,
      selectedBulkAction: action,
    })),

  // Pagination actions
  setCurrentPage: page => set(() => ({ currentPage: page })),

  setPageSize: size =>
    set(() => ({
      pageSize: size,
      currentPage: 0, // Reset to first page when changing page size
    })),

  setSorting: (sortBy, sortOrder) =>
    set(() => ({
      sortBy,
      sortOrder,
      currentPage: 0, // Reset to first page when changing sort
    })),

  // View actions
  setViewMode: mode => set(() => ({ viewMode: mode })),

  // Reset state
  resetState: () => set(() => initialState),
}));
