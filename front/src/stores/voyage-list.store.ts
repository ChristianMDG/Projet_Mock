import { create } from 'zustand';
import { Voyage } from '@/models/Voyage';
import { RecurrenceTypeEnum, VoyageStatusEnum } from '@/models/enums';

interface VoyageListState {
  // State
  searchTerm: string;
  statusFilter: VoyageStatusEnum | 'ALL';
  recurrenceFilter: RecurrenceTypeEnum | 'ALL';
  schedulerOpen: boolean;
  editingVoyage: Voyage | null;
  deleteDialogOpen: boolean;
  voyageToDelete: Voyage | null;
  anchorEl: HTMLElement | null;
  selectedVoyage: Voyage | null;
  // Setters
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: VoyageStatusEnum | 'ALL') => void;
  setRecurrenceFilter: (rec: RecurrenceTypeEnum | 'ALL') => void;
  setSchedulerOpen: (open: boolean) => void;
  setEditingVoyage: (voyage: Voyage | null) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setVoyageToDelete: (voyage: Voyage | null) => void;
  setAnchorEl: (el: HTMLElement | null) => void;
  setSelectedVoyage: (voyage: Voyage | null) => void;
  // Reset
  reset: () => void;
}

const useVoyageListStore = create<VoyageListState>(set => ({
  // State
  searchTerm: '',
  statusFilter: 'ALL',
  recurrenceFilter: 'ALL',
  schedulerOpen: false,
  editingVoyage: null,
  deleteDialogOpen: false,
  voyageToDelete: null,
  anchorEl: null,
  selectedVoyage: null,
  // Setters
  setSearchTerm: term => set({ searchTerm: term }),
  setStatusFilter: status => set({ statusFilter: status }),
  setRecurrenceFilter: rec => set({ recurrenceFilter: rec }),
  setSchedulerOpen: open => set({ schedulerOpen: open }),
  setEditingVoyage: voyage => set({ editingVoyage: voyage }),
  setDeleteDialogOpen: open => set({ deleteDialogOpen: open }),
  setVoyageToDelete: voyage => set({ voyageToDelete: voyage }),
  setAnchorEl: el => set({ anchorEl: el }),
  setSelectedVoyage: voyage => set({ selectedVoyage: voyage }),
  // Reset
  reset: () =>
    set({
      searchTerm: '',
      statusFilter: 'ALL',
      recurrenceFilter: 'ALL',
      schedulerOpen: false,
      editingVoyage: null,
      deleteDialogOpen: false,
      voyageToDelete: null,
      anchorEl: null,
      selectedVoyage: null,
    }),
}));

export default useVoyageListStore;
