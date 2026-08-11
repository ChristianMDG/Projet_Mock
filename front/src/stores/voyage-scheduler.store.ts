import { create } from 'zustand';

interface VoyageSchedulerState {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  resetState: () => void;
}

const useVoyageSchedulerStore = create<VoyageSchedulerState>(set => ({
  activeTab: 0,
  setActiveTab: tab => set({ activeTab: tab }),
  resetState: () => set({ activeTab: 0 }),
}));

export default useVoyageSchedulerStore;
