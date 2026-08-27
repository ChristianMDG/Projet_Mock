import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ville } from '@/types';
import { Colis, Voyage } from '@/types';
import dayjs, { Dayjs } from 'dayjs';
import { customStorage } from '@/utils/customStorage';

interface VoyagePageState {
  currentVille: Ville | null;
  destinationVille: Ville | null;
  selectedTab: string;
  selectedDate: Dayjs;
  isVilleDialogOpen: boolean;
  isVoyageSchedulerOpen: boolean;
  selectedVoyage: Voyage | null;
  voyageEdition: boolean;
  selectedSubTab: 'reservation' | 'colis';
  openColisScheduler: boolean;
  selectedColis: Colis | null;
  viewColis: Colis | null;
  scheduleSuccess: boolean;

  setCurrentVille: (ville: Ville | null) => void;
  setDestinationVille: (ville: Ville | null) => void;
  setSelectedTab: (tab: string) => void;
  setSelectedDate: (date: Dayjs) => void;
  setIsVilleDialogOpen: (open: boolean) => void;
  setIsVoyageSchedulerOpen: (open: boolean) => void;
  setSelectedVoyage: (voyage: Voyage | null) => void;
  setVoyageEdition: (edition: boolean) => void;
  setSelectedSubTab: (tab: 'reservation' | 'colis') => void;
  setOpenColisScheduler: (open: boolean) => void;
  setSelectedColis: (colis: Colis | null) => void;
  setViewColis: (colis: Colis | null) => void;
  setScheduleSuccess: (success: boolean) => void;
  resetState: () => void;
}

const initialState = {
  currentVille: null,
  destinationVille: null,
  selectedTab: 'nextweek',
  selectedDate: dayjs().startOf('day'),
  isVilleDialogOpen: false,
  isVoyageSchedulerOpen: false,
  selectedVoyage: null,
  voyageEdition: false,
  selectedSubTab: 'reservation' as const,
  openColisScheduler: false,
  selectedColis: null,
  viewColis: null,
  scheduleSuccess: false,
};

export const useVoyagePageStore = create<VoyagePageState>()(
  persist(
    set => ({
      ...initialState,

      setCurrentVille: ville => set({ currentVille: ville }),
      setDestinationVille: ville => set({ destinationVille: ville }),
      setSelectedTab: tab => set({ selectedTab: tab }),
      setSelectedDate: date => set({ selectedDate: date }),
      setIsVilleDialogOpen: open => set({ isVilleDialogOpen: open }),
      setIsVoyageSchedulerOpen: open => set({ isVoyageSchedulerOpen: open }),
      setSelectedVoyage: voyage => set({ selectedVoyage: voyage }),
      setVoyageEdition: edition => set({ voyageEdition: edition }),
      setSelectedSubTab: tab => set({ selectedSubTab: tab }),
      setOpenColisScheduler: open => set({ openColisScheduler: open }),
      setSelectedColis: colis => set({ selectedColis: colis }),
      setViewColis: colis => set({ viewColis: colis }),
      setScheduleSuccess: success => set({ scheduleSuccess: success }),
      resetState: () => set(initialState),
    }),
    {
      name: 'voyage-page-storage',
      partialize: state => ({
        currentVille: state.currentVille,
        destinationVille: state.destinationVille,
        selectedTab: state.selectedTab,
        selectedDate: state.selectedDate,
        selectedSubTab: state.selectedSubTab,
      }),
      storage: {
        getItem: name => {
          const str = customStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            if (parsed.state.selectedDate) {
              parsed.state.selectedDate = dayjs(parsed.state.selectedDate);
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              selectedDate: value.state.selectedDate?.toISOString?.() ?? value.state.selectedDate,
            },
          };
          customStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: name => customStorage.removeItem(name),
      },
      skipHydration: true,
    },
  ),
);
