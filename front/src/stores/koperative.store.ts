import { create } from 'zustand';
import { Koperative } from '@/types';
import { KoperativeFilter } from '@/types/type.util';

type ViewMode = 'grid' | 'list';

interface KoperativePageState {
  drawerOpen: boolean;
  filterParams: KoperativeFilter;
  koperativeForm: Partial<Koperative>;
  selectedId: number | undefined;
  viewMode: ViewMode;
  setDrawerOpen: (open: boolean) => void;
  setFilterParams: (filter: Partial<KoperativeFilter>) => void;
  setKoperativeForm: (form: Partial<Koperative>) => void;
  setSelectedId: (id: number | undefined) => void;
  setViewMode: (mode: ViewMode) => void;
  resetFilter: () => void;
}

const useKoperativePageStore = create<KoperativePageState>(set => ({
  drawerOpen: false,
  filterParams: { ville: [], name: '' },
  koperativeForm: {},
  selectedId: undefined,
  viewMode: 'grid',
  setDrawerOpen: open => set({ drawerOpen: open }),
  setFilterParams: filter => set(state => ({ filterParams: { ...state.filterParams, ...filter } })),
  setKoperativeForm: form => set({ koperativeForm: form }),
  setSelectedId: id => set({ selectedId: id }),
  setViewMode: mode => set({ viewMode: mode }),
  resetFilter: () => set({ filterParams: { ville: [], name: '' } }),
}));

export default useKoperativePageStore;
