import { create } from 'zustand';
import { CinTypeEnum, UserOperator } from '@/types';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  idType: CinTypeEnum;
  password: string;
  photo: { url: string; publicId: string } | null;
  isActive: boolean;
}

interface UserFormState {
  form: UserFormData;
  error: string | null;
  loading: boolean;

  // Actions
  setForm: (form: UserFormData) => void;
  updateForm: (updates: Partial<UserFormData>) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  resetForm: (initialData?: Partial<UserOperator>) => void;
}

const getInitialFormData = (data?: Partial<UserOperator>): UserFormData => ({
  firstName: data?.firstName ?? '',
  lastName: data?.lastName ?? '',
  email: data?.email ?? '',
  phone: data?.phone ?? '',
  address: data?.address ?? '',
  idNumber: data?.idNumber ?? '',
  idType: data?.idType as CinTypeEnum,
  password: '',
  photo: data?.photo ?? null,
  isActive: data?.isActive ?? true,
});

const useUserFormStore = create<UserFormState>(set => ({
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

export default useUserFormStore;
