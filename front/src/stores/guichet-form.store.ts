import { create } from 'zustand';
import { Guichet, Koperative, Ville } from '@/types';

interface GuichetFormState {
  formData: Partial<Guichet>;
  selectedVille: Ville | null;
  loading: boolean;
  error: string | null;

  // Actions
  setFormData: (data: Partial<Guichet>) => void;
  updateFormData: (updates: Partial<Guichet>) => void;
  setSelectedVille: (ville: Ville | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: (initialData?: Partial<Guichet>, koperativeId?: number) => void;
}

const getInitialFormData = (initialData?: Partial<Guichet>, koperativeId?: number): Partial<Guichet> => {
  return {
    ...initialData,
    koperative: { id: koperativeId } as Koperative,
    isActive: initialData?.isActive ?? true,
  };
};

const getInitialVille = (initialData?: Partial<Guichet>): Ville | null => {
  return initialData?.gare?.ville ?? null;
};

const useGuichetFormStore = create<GuichetFormState>(set => ({
  formData: {},
  selectedVille: null,
  loading: false,
  error: null,

  setFormData: data => set({ formData: data }),

  updateFormData: updates =>
    set(state => ({
      formData: { ...state.formData, ...updates },
    })),

  setSelectedVille: ville => set({ selectedVille: ville }),

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  resetForm: (initialData, koperativeId) =>
    set({
      formData: getInitialFormData(initialData, koperativeId),
      selectedVille: getInitialVille(initialData),
      loading: false,
      error: null,
    }),
}));

export default useGuichetFormStore;
