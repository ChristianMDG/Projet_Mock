import { create } from 'zustand';
import { Guichet } from '@/types';

interface GuichetListModals {
  guichetForm: { open: boolean; mode: 'create' | 'edit' };
  operatorForm: { open: boolean };
  deleteDialog: { open: boolean };
}

interface GuichetListSelectedItems {
  guichet: Guichet | null;
  guichetToDelete: Guichet | null;
}

interface GuichetListState {
  modals: GuichetListModals;
  selectedItems: GuichetListSelectedItems;

  // Actions
  setModals: (modals: Partial<GuichetListModals>) => void;
  setSelectedItems: (items: Partial<GuichetListSelectedItems>) => void;
  openGuichetForm: (mode: 'create' | 'edit', guichet?: Guichet) => void;
  closeGuichetForm: () => void;
  openOperatorForm: (guichet?: Guichet) => void;
  closeOperatorForm: () => void;
  openDeleteDialog: (guichet: Guichet) => void;
  closeDeleteDialog: () => void;
  resetState: () => void;
}

const useGuichetListStore = create<GuichetListState>(set => ({
  modals: {
    guichetForm: { open: false, mode: 'create' },
    operatorForm: { open: false },
    deleteDialog: { open: false },
  },
  selectedItems: {
    guichet: null,
    guichetToDelete: null,
  },

  setModals: modals =>
    set(state => ({
      modals: { ...state.modals, ...modals },
    })),

  setSelectedItems: items =>
    set(state => ({
      selectedItems: { ...state.selectedItems, ...items },
    })),

  openGuichetForm: (mode, guichet?: Guichet) =>
    set(state => ({
      modals: { ...state.modals, guichetForm: { open: true, mode } },
      selectedItems: { ...state.selectedItems, guichet: guichet ?? null },
    })),

  closeGuichetForm: () =>
    set(state => ({
      modals: { ...state.modals, guichetForm: { open: false, mode: 'create' } },
      selectedItems: { ...state.selectedItems, guichet: null },
    })),

  openOperatorForm: (guichet?: Guichet) =>
    set(state => ({
      modals: { ...state.modals, operatorForm: { open: true } },
      selectedItems: { ...state.selectedItems, guichet: guichet ?? null },
    })),

  closeOperatorForm: () =>
    set(state => ({
      modals: { ...state.modals, operatorForm: { open: false } },
      selectedItems: { ...state.selectedItems, guichet: null },
    })),

  openDeleteDialog: guichetToDelete =>
    set(state => ({
      modals: { ...state.modals, deleteDialog: { open: true } },
      selectedItems: { ...state.selectedItems, guichetToDelete },
    })),

  closeDeleteDialog: () =>
    set(state => ({
      modals: { ...state.modals, deleteDialog: { open: false } },
      selectedItems: { ...state.selectedItems, guichetToDelete: null },
    })),

  resetState: () =>
    set({
      modals: {
        guichetForm: { open: false, mode: 'create' },
        operatorForm: { open: false },
        deleteDialog: { open: false },
      },
      selectedItems: {
        guichet: null,
        guichetToDelete: null,
      },
    }),
}));

export default useGuichetListStore;
