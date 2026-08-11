import { create } from 'zustand';
import { Ville } from '@/types';
import dayjs, { Dayjs } from 'dayjs';

interface VoyagePageState {
  currentVille: Ville | null;
  destinationVille: Ville | null;
  selectedTab: string;
  selectedDate: Dayjs;

  setCurrentVille: (ville: Ville | null) => void;
  setDestinationVille: (ville: Ville | null) => void;
  setSelectedTab: (tab: string) => void;
  setSelectedDate: (date: Dayjs) => void;
  resetState: () => void;
}

const initialState = {
  currentVille: null,
  destinationVille: null,
  selectedTab: 'nextweek',
  selectedDate: dayjs().startOf('day'),
};

export const useVoyagePageStore = create<VoyagePageState>(set => ({
  ...initialState,

  setCurrentVille: ville => set({ currentVille: ville }),
  setDestinationVille: ville => set({ destinationVille: ville }),
  setSelectedTab: tab => set({ selectedTab: tab }),
  setSelectedDate: date => set({ selectedDate: date }),
  resetState: () => set(initialState),
}));
