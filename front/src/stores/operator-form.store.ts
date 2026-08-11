import { create } from 'zustand';
import { Guichet, Koperative, UserOperator } from '@/types';
import { CinTypeEnum } from '@/models/enums';

interface OperatorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  idType: CinTypeEnum;
  password: string;
  photo: { url: string; publicId: string } | null;
  koperative: Koperative | null;
  guichets: Guichet[];
  isActive: boolean;
}

interface OperatorFormState {
  form: OperatorFormData;
  error: string | null;
  loading: boolean;

  // Actions
  setForm: (form: OperatorFormData) => void;
  updateForm: (updates: Partial<OperatorFormData>) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  resetForm: (initialData?: Partial<UserOperator>) => void;
}

const getInitialFormData = (data?: Partial<UserOperator>): OperatorFormData => ({
  firstName: data?.firstName ?? '',
  lastName: data?.lastName ?? '',
  email: data?.email ?? '',
  phone: data?.phone ?? '',
  address: data?.address ?? '',
  idNumber: data?.idNumber ?? '',
  idType: data?.idType as CinTypeEnum,
  password: '',
  photo: data?.photo ?? null,
  koperative: data?.koperative ?? null,
  guichets: data?.guichets ?? [],
  isActive: data?.isActive ?? true,
});

const useOperatorFormStore = create<OperatorFormState>(set => ({
  form: getInitialFormData(),
  error: null,
  loading: false,

  setForm: form => set({ form }),
  updateForm: updates =>
    set(state => ({
      form: { ...state.form, ...updates },
    })),
  setError: error => set({ error }),
  setLoading: loading => set({ loading }),
  resetForm: initialData =>
    set({
      form: getInitialFormData(initialData),
      error: null,
      loading: false,
    }),
}));

export default useOperatorFormStore;
