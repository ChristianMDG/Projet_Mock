import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaymentTransactionStatusEnum } from '@/models/enums';

interface PaymentState {
  paymentMethodId: string;
  phoneNumber: string;
  otpModalOpen: boolean;
  paymentLoading: boolean;
  paymentError: string | null;
  transactionId: string | null;
  transactionReference: string | null;
  paymentStatus: PaymentTransactionStatusEnum | null;
  showPaymentStatus: boolean;
  wsConnected: boolean;
  reservationId: number | null;

  setPaymentMethodId: (methodId: string) => void;
  setPhoneNumber: (phone: string) => void;
  setOtpModalOpen: (open: boolean) => void;
  setPaymentLoading: (loading: boolean) => void;
  setPaymentError: (error: string | null) => void;
  setTransactionId: (id: string | null) => void;
  setTransactionReference: (reference: string | null) => void;
  setPaymentStatus: (status: PaymentTransactionStatusEnum | null) => void;
  setShowPaymentStatus: (show: boolean) => void;
  setWsConnected: (connected: boolean) => void;
  setReservationId: (id: number | null) => void;

  resetPaymentForm: () => void;
  resetPaymentFlow: () => void;
}

const initialState = {
  paymentMethodId: '',
  phoneNumber: '',
  otpModalOpen: false,
  paymentLoading: false,
  paymentError: null,
  transactionId: null,
  transactionReference: null,
  paymentStatus: null,
  showPaymentStatus: false,
  wsConnected: false,
  reservationId: null,
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    set => ({
      ...initialState,

      setPaymentMethodId: methodId => set({ paymentMethodId: methodId }),
      setPhoneNumber: phone => set({ phoneNumber: phone }),
      setOtpModalOpen: open => set({ otpModalOpen: open, paymentError: open ? null : undefined }),
      setPaymentLoading: loading => set({ paymentLoading: loading }),
      setPaymentError: error => set({ paymentError: error }),
      setTransactionId: id => set({ transactionId: id }),
      setTransactionReference: reference => set({ transactionReference: reference }),
      setPaymentStatus: status => set({ paymentStatus: status }),
      setShowPaymentStatus: show => set({ showPaymentStatus: show }),
      setWsConnected: connected => set({ wsConnected: connected }),
      setReservationId: id => set({ reservationId: id }),

      resetPaymentForm: () =>
        set({
          paymentMethodId: initialState.paymentMethodId,
          phoneNumber: initialState.phoneNumber,
          paymentError: null,
        }),

      resetPaymentFlow: () => set(initialState),
    }),
    {
      name: 'payment-storage',
    },
  ),
);
