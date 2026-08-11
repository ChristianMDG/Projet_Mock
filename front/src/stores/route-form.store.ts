import { create } from 'zustand';
import { Gare } from '@/models/Gare';
import { Route } from '@/models/Route';

interface RouteFormState {
  form: {
    name: string;
    departureGare: Gare | null;
    arrivalGare: Gare | null;
    estimatedDurationHours: number | null;
    distanceKm: number | null;
    fraisTaxibrousse: number | null;
    fraisKoperative: number | null;
    description: string;
    isActive: boolean;
  };
  loading: boolean;
  error: string | null;
}

interface RouteFormActions {
  updateForm: (updates: Partial<RouteFormState['form']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: (initialData?: Partial<Route>) => void;
}

const useRouteFormStore = create<RouteFormState & RouteFormActions>((set, get) => ({
  form: {
    name: '',
    departureGare: null,
    arrivalGare: null,
    estimatedDurationHours: null,
    distanceKm: null,
    fraisTaxibrousse: null,
    fraisKoperative: null,
    description: '',
    isActive: true,
  },
  loading: false,
  error: null,

  updateForm: updates => {
    set(state => ({
      form: {
        ...state.form,
        ...updates,
      },
    }));
  },

  setLoading: loading => {
    set({ loading });
  },

  setError: error => {
    set({ error });
  },

  resetForm: initialData => {
    const defaultForm = get().form;

    set({
      form: {
        name: initialData?.name ?? '',
        departureGare: initialData?.departureGare ?? defaultForm.departureGare,
        arrivalGare: initialData?.arrivalGare ?? null,
        estimatedDurationHours: initialData?.estimatedDurationHours ?? null,
        distanceKm: initialData?.distanceKm ?? null,
        fraisTaxibrousse: initialData?.fraisTaxibrousse ?? null,
        fraisKoperative: initialData?.fraisKoperative ?? null,
        description: initialData?.description ?? '',
        isActive: initialData?.isActive ?? true,
      },
      loading: false,
      error: null,
    });
  },
}));

export default useRouteFormStore;
