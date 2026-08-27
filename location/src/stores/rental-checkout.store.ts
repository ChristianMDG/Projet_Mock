import { create } from 'zustand';
import { CheckoutStep } from '../types/rental.types';

interface RentalCheckoutState {
  step: CheckoutStep;
  reservationId: number | null;
  transactionReference: string | null;
  operatorName: string | null;
  setStep: (step: CheckoutStep) => void;
  setReservation: (id: number) => void;
  setTransaction: (reference: string, operatorName: string) => void;
  reset: () => void;
}

export const useRentalCheckoutStore = create<RentalCheckoutState>(set => ({
  step: CheckoutStep.DRIVER_INFO,
  reservationId: null,
  transactionReference: null,
  operatorName: null,
  setStep: step => set({ step }),
  setReservation: id => set({ reservationId: id, step: CheckoutStep.PAYMENT }),
  setTransaction: (reference, operatorName) =>
    set({ transactionReference: reference, operatorName, step: CheckoutStep.TRACKING }),
  reset: () =>
    set({ step: CheckoutStep.DRIVER_INFO, reservationId: null, transactionReference: null, operatorName: null }),
}));
