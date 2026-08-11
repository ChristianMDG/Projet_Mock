import { create } from 'zustand';
import { Reservation } from '@/models/Reservation';

interface AccountReservationState {
  // Selected reservation for dialogs
  selectedReservation: Reservation | null;

  // Dialog states
  isPaymentDialogOpen: boolean;
  isCancelDialogOpen: boolean;

  // Expanded reservations (for voyage details collapse)
  expandedReservations: Set<number>;

  // Actions
  openPaymentDialog: (reservation: Reservation) => void;
  closePaymentDialog: () => void;
  openCancelDialog: (reservation: Reservation) => void;
  closeCancelDialog: () => void;
  toggleExpanded: (reservationId: number) => void;
  reset: () => void;
}

const initialState = {
  selectedReservation: null,
  isPaymentDialogOpen: false,
  isCancelDialogOpen: false,
  expandedReservations: new Set<number>(),
};

export const useAccountReservationStore = create<AccountReservationState>(set => ({
  ...initialState,

  openPaymentDialog: reservation =>
    set({
      selectedReservation: reservation,
      isPaymentDialogOpen: true,
      isCancelDialogOpen: false,
    }),

  closePaymentDialog: () =>
    set({
      isPaymentDialogOpen: false,
    }),

  openCancelDialog: reservation =>
    set({
      selectedReservation: reservation,
      isCancelDialogOpen: true,
      isPaymentDialogOpen: false,
    }),

  closeCancelDialog: () =>
    set({
      isCancelDialogOpen: false,
    }),

  toggleExpanded: reservationId =>
    set(state => {
      const newExpanded = new Set(state.expandedReservations);
      if (newExpanded.has(reservationId)) {
        newExpanded.delete(reservationId);
      } else {
        newExpanded.add(reservationId);
      }
      return { expandedReservations: newExpanded };
    }),

  reset: () => set(initialState),
}));
