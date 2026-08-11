import { create } from 'zustand';
import { Gare } from '@/types';
import { GareFilter } from '@/types/type.util';

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name' | 'city' | 'region';

interface GarePageState {
  // Existing state
  drawerOpen: boolean;
  filterParams: Partial<GareFilter>;
  gareForm: Partial<Gare>;
  selectedId: number | undefined;

  // Existing actions
  setDrawerOpen: (open: boolean) => void;
  setFilterParams: (filter: Partial<GareFilter>) => void;
  setGareForm: (form: Partial<Gare>) => void;
  setSelectedId: (id: number | undefined) => void;
  resetFilter: () => void;
}

const initialFilter: Partial<GareFilter> = {
  ville: [],
  name: '',
  koperativeName: '',
  isClosed: undefined,
};

const useGarePageStore = create<GarePageState>(set => ({
  // Initial state
  drawerOpen: false,
  filterParams: initialFilter,
  gareForm: {},
  selectedId: undefined,

  // Existing actions
  setDrawerOpen: open => set({ drawerOpen: open }),
  setFilterParams: (filter: Partial<GareFilter>) =>
    set(state => ({
      filterParams: { ...state.filterParams, ...filter },
    })),
  setGareForm: form => set({ gareForm: form }),
  setSelectedId: id => set({ selectedId: id }),
  resetFilter: () => set({ filterParams: initialFilter }),
}));

export default useGarePageStore;
