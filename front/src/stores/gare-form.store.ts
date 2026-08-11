import { create } from 'zustand';
import { Gare, Ville } from '@/types';
import { Cloudinary } from '@/models/Cloudinary';

interface GareFormData {
  name: string;
  address: string;
  ville?: Ville | null;
  description: string;
  photo?: Cloudinary | null;
  photos?: Cloudinary[] | null;
  isClosed: boolean;
}

interface GareFormState {
  form: GareFormData;
  loading: boolean;
  error: string | null;

  // Actions
  setForm: (form: GareFormData) => void;
  updateForm: (updates: Partial<GareFormData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: (initialData?: Partial<Gare>) => void;
}

const getInitialFormData = (initialData?: Partial<Gare>): GareFormData => {
  if (initialData && typeof initialData.id === 'number' && initialData.id > 0) {
    return {
      name: initialData.name ?? '',
      address: initialData.address ?? '',
      ville: initialData.ville ?? null,
      description: initialData.description ?? '',
      photo: initialData.photo ?? null,
      photos: initialData.photos ?? [
        {
          publicId: '',
          url: '',
          format: '',
          resourceType: '',
          bytes: 0,
          width: 0,
          height: 0,
        },
      ],
      isClosed: initialData.isClosed ?? false,
    };
  }
  return {
    name: '',
    address: '',
    ville: null,
    description: '',
    photo: null,
    photos: [],
    isClosed: false,
  };
};

const useGareFormStore = create<GareFormState>(set => ({
  form: getInitialFormData(),
  loading: false,
  error: null,

  setForm: form => set({ form }),

  updateForm: updates =>
    set(state => ({
      form: { ...state.form, ...updates },
    })),

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  resetForm: initialData =>
    set({
      form: getInitialFormData(initialData),
      loading: false,
      error: null,
    }),
}));

export default useGareFormStore;
