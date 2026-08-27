import { create } from 'zustand';
import dayjs from 'dayjs';

interface FinanceState {
  from: string | undefined;
  setFrom: (from: string | undefined) => void;
  to: string | undefined;
  setTo: (to: string | undefined) => void;
  getParams: () => { from?: string; to?: string };
}

const defaultFrom = dayjs().subtract(11, 'month').startOf('month').format('YYYY-MM-DD');
const defaultTo = dayjs().endOf('month').format('YYYY-MM-DD');

export const useFinanceStore = create<FinanceState>((set, get) => ({
  to: defaultTo,
  from: defaultFrom,
  setFrom: (from) => set({ from }),
  setTo: (to) => set({ to }),
  getParams: () => ({
    from: get().from,
    to: get().to,
  }),
}));
