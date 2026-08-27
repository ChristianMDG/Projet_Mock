import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GuestReservationSearchParams {
  phoneNumber: string;
  idNumber: string;
}

interface GuestReservationStore {
  phoneNumber: string;
  idNumber: string;
  searched: boolean;
  searchParams: GuestReservationSearchParams;
  setPhoneNumber: (phoneNumber: string) => void;
  setIdNumber: (idNumber: string) => void;
  setSearched: (searched: boolean) => void;
  setSearchParams: (params: GuestReservationSearchParams) => void;
  reset: () => void;
}

export const useGuestReservationStore = create<GuestReservationStore>()(
  persist(
    set => ({
      phoneNumber: '',
      idNumber: '',
      searched: false,
      searchParams: { phoneNumber: '', idNumber: '' },
      setPhoneNumber: phoneNumber => set({ phoneNumber }),
      setIdNumber: idNumber => set({ idNumber }),
      setSearched: searched => set({ searched }),
      setSearchParams: params => set({ searchParams: params }),
      reset: () =>
        set({
          phoneNumber: '',
          idNumber: '',
          searched: false,
          searchParams: { phoneNumber: '', idNumber: '' },
        }),
    }),
    {
      name: 'guest-reservation-store',
      partialize: state => ({
        phoneNumber: state.phoneNumber,
        idNumber: state.idNumber,
        searched: state.searched,
        searchParams: state.searchParams,
      }),
      skipHydration: true,
    },
  ),
);
