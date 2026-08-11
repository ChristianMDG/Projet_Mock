import { create } from 'zustand';
import { UserFormData } from '@/components/forms';
import { getEmptyUserForm } from '@/utils/reservation-form.utils';

interface PaymentSuccessState {
  // User form state (for non-authenticated users)
  userForm: UserFormData;
  notes: string;
  password: string;
  hasExistingAccount: boolean;

  // Auto-processing state for authenticated users
  autoReservationProcessed: boolean;
  autoReservationLoading: boolean;

  // Manual reservation state
  manualReservationLoading: boolean;

  // Error states
  autoReservationError: string | null;
  manualReservationError: string | null;

  // Success state
  reservationSuccess: boolean;
  reservationCode: string | null;

  // Actions
  setUserForm: (form: UserFormData) => void;
  updateUserFormField: (field: keyof UserFormData, value: string) => void;
  setNotes: (notes: string) => void;
  setPassword: (password: string) => void;
  setHasExistingAccount: (hasExistingAccount: boolean) => void;

  setAutoReservationProcessed: (processed: boolean) => void;
  setAutoReservationLoading: (loading: boolean) => void;

  setManualReservationLoading: (loading: boolean) => void;

  setAutoReservationError: (error: string | null) => void;
  setManualReservationError: (error: string | null) => void;

  setReservationSuccess: (success: boolean, code?: string) => void;

  // Validation
  isFormValid: () => boolean;
  isPasswordValid: () => boolean;

  // Reset
  reset: () => void;
}

const initialState = {
  userForm: getEmptyUserForm(),
  notes: '',
  password: '',
  hasExistingAccount: false,

  autoReservationProcessed: false,
  autoReservationLoading: false,

  manualReservationLoading: false,

  autoReservationError: null,
  manualReservationError: null,

  reservationSuccess: false,
  reservationCode: null,
};

export const usePaymentSuccessStore = create<PaymentSuccessState>((set, get) => ({
  ...initialState,

  // Form actions
  setUserForm: form => set({ userForm: form }),
  updateUserFormField: (field, value) =>
    set(state => ({
      userForm: {
        ...state.userForm,
        [field]: value,
      },
    })),
  setNotes: notes => set({ notes }),
  setPassword: password => set({ password }),
  setHasExistingAccount: hasExistingAccount => set({ hasExistingAccount }),

  // Auto-reservation actions
  setAutoReservationProcessed: processed => set({ autoReservationProcessed: processed }),
  setAutoReservationLoading: loading => set({ autoReservationLoading: loading }),

  // Manual reservation actions
  setManualReservationLoading: loading => set({ manualReservationLoading: loading }),

  // Error actions
  setAutoReservationError: error => set({ autoReservationError: error }),
  setManualReservationError: error => set({ manualReservationError: error }),

  // Success actions
  setReservationSuccess: (success, code) =>
    set({
      reservationSuccess: success,
      reservationCode: code || null,
    }),

  // Validation
  isFormValid: () => {
    const { userForm } = get();
    return !!(userForm.firstName && userForm.lastName && userForm.phone);
  },

  isPasswordValid: () => {
    const { password, hasExistingAccount } = get();
    return hasExistingAccount || password.length >= 6;
  },

  // Reset
  reset: () => set(initialState),
}));
