import { create } from 'zustand';
import type { OperateurFilters } from '@/types/operateur.types';

interface OperateurState {
  filters: OperateurFilters;
  setFilters: (filters: Partial<OperateurFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: OperateurFilters = {
  search: '',
  isActive: undefined,
  koperativeId: undefined,
  gareId: undefined,
};

export const useOperateurStore = create<OperateurState>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
