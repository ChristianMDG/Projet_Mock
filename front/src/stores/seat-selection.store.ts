import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SeatConfig } from '@/types/type.props';

interface SeatSelectionState {
  // UI State
  expandedVoyageId: number | null;
  selectedPricingType: string | null;

  // Seat Selection State
  selectedSeats: Record<number, SeatConfig[]>; // voyageId -> seats

  // Actions
  toggleVoyageExpansion: (voyageId: number) => void;
  setExpandedVoyage: (voyageId: number, pricingType?: string) => void;
  setSelectedPricingType: (voyageId: number, pricingType: string) => void;
  setSelectedSeats: (voyageId: number, seats: SeatConfig[]) => void;
  addSelectedSeat: (voyageId: number, seat: SeatConfig) => void;
  removeSelectedSeat: (voyageId: number, seatId: number) => void;
  clearSelectedSeats: (voyageId: number) => void;
  reset: () => void;
}

export const useSeatSelectionStore = create<SeatSelectionState>()(
  persist(
    set => ({
      // Initial state
      expandedVoyageId: null,
      selectedPricingType: null,
      selectedSeats: {},

      // Actions
      toggleVoyageExpansion: (voyageId: number) =>
        set(state => ({
          expandedVoyageId: state.expandedVoyageId === voyageId ? null : voyageId,
          selectedPricingType: state.expandedVoyageId === voyageId ? null : state.selectedPricingType,
        })),

      setExpandedVoyage: (voyageId: number, pricingType = 'STANDARD') =>
        set({ expandedVoyageId: voyageId, selectedPricingType: pricingType }),

      setSelectedPricingType: (voyageId: number, pricingType: string) =>
        set(state => ({
          selectedPricingType: state.expandedVoyageId === voyageId ? pricingType : null,
        })),

      setSelectedSeats: (voyageId: number, seats: SeatConfig[]) =>
        set(state => ({
          selectedSeats: {
            ...state.selectedSeats,
            [voyageId]: seats,
          },
        })),

      addSelectedSeat: (voyageId: number, seat: SeatConfig) =>
        set(state => {
          const currentSeats = state.selectedSeats[voyageId] || [];
          const isAlreadySelected = currentSeats.some(s => s.id === seat.id);

          if (isAlreadySelected) return state;

          return {
            selectedSeats: {
              ...state.selectedSeats,
              [voyageId]: [...currentSeats, seat],
            },
          };
        }),

      removeSelectedSeat: (voyageId: number, seatId: number) =>
        set(state => {
          const currentSeats = state.selectedSeats[voyageId] || [];
          return {
            selectedSeats: {
              ...state.selectedSeats,
              [voyageId]: currentSeats.filter(seat => seat.id !== seatId),
            },
          };
        }),

      clearSelectedSeats: (voyageId: number) =>
        set(state => ({
          selectedSeats: {
            ...state.selectedSeats,
            [voyageId]: [],
          },
        })),

      reset: () =>
        set({
          expandedVoyageId: null,
          selectedPricingType: null,
          selectedSeats: {},
        }),
    }),
    {
      name: 'seat-selection-storage',
    },
  ),
);
