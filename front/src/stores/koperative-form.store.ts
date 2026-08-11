import { create } from 'zustand';
import { Koperative } from '@/types';

interface KoperativeFormState {
  form: Partial<Koperative>;
  loading: boolean;
  villeFilter: string;
  error: string | null;

  // Actions
  setForm: (form: Partial<Koperative>) => void;
  updateForm: (updates: Partial<Koperative>) => void;
  setLoading: (loading: boolean) => void;
  setVilleFilter: (filter: string) => void;
  setError: (error: string | null) => void;
  resetForm: (initialData?: Partial<Koperative>) => void;
}

const useKoperativeFormStore = create<KoperativeFormState>(set => ({
  form: {},
  loading: false,
  villeFilter: '',
  error: null,

  setForm: form => set({ form }),

  updateForm: updates =>
    set(state => ({
      form: { ...state.form, ...updates },
    })),

  setLoading: loading => set({ loading }),

  setVilleFilter: villeFilter => set({ villeFilter }),

  setError: error => set({ error }),

  resetForm: (initialData = {}) =>
    set({
      form: { ...initialData },
      loading: false,
      villeFilter: '',
      error: null,
    }),
}));

export default useKoperativeFormStore;
