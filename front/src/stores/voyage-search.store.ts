import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs, { Dayjs } from 'dayjs';
import { Koperative, Ville, Voyage } from '@/types';
import { customStorage } from '@/utils/customStorage';

export interface VoyageSearchState {
  // Search form state
  fromVille: Ville | null;
  toVille: Ville | null;
  departureDate: Dayjs;
  returnDate: Dayjs | null;
  passengers: number;
  isRoundTrip: boolean;
  koperativeId: number | null;
  // Search results state
  searchResults: Voyage[];
  availableKoperatives: Koperative[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  // UI state
  searchFormOpen: boolean;
  // Actions
  setFromVille: (ville: Ville | null) => void;
  setToVille: (ville: Ville | null) => void;
  setDepartureDate: (date: Dayjs) => void;
  setReturnDate: (date: Dayjs | null) => void;
  setPassengers: (count: number) => void;
  setIsRoundTrip: (roundTrip: boolean) => void;
  setKoperativeId: (koperativeId: number | null) => void;
  setSearchResults: (results: Voyage[]) => void;
  setAvailableKoperatives: (koperatives: Koperative[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasSearched: (searched: boolean) => void;
  setSearchFormOpen: (open: boolean) => void;
  setSearchParams: (params: Partial<VoyageSearchState>) => void;
  swapVilles: () => void;
  resetSearch: () => void;
  resetForm: () => void;
}
const initialState = {
  fromVille: null,
  toVille: null,
  departureDate: dayjs().add(1, 'day'),
  returnDate: null,
  passengers: 1,
  isRoundTrip: false,
  koperativeId: null,
  searchResults: [],
  availableKoperatives: [],
  isLoading: false,
  error: null,
  hasSearched: false,
  searchFormOpen: false,
};
export const useVoyageSearchStore = create<VoyageSearchState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setFromVille: fromVille => set({ fromVille }),
      setToVille: toVille => set({ toVille }),
      setDepartureDate: departureDate => set({ departureDate }),
      setReturnDate: returnDate => set({ returnDate }),
      setPassengers: passengers => set({ passengers }),
      setIsRoundTrip: isRoundTrip =>
        set({
          isRoundTrip,
          returnDate: isRoundTrip ? (get().returnDate ?? dayjs().add(7, 'day')) : null,
        }),
      setKoperativeId: koperativeId => set({ koperativeId }),
      setSearchResults: searchResults => set({ searchResults }),
      setAvailableKoperatives: availableKoperatives => set({ availableKoperatives }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),
      setHasSearched: hasSearched => set({ hasSearched }),
      setSearchFormOpen: searchFormOpen => set({ searchFormOpen }),
      setSearchParams: params => set(params),
      swapVilles: () => {
        const { fromVille, toVille } = get();
        if (fromVille || toVille) {
          set({
            fromVille: toVille,
            toVille: fromVille,
            // Clear previous search results when swapping
            searchResults: [],
            availableKoperatives: [],
            error: null,
            hasSearched: false,
          });
        }
      },
      resetSearch: () =>
        set({
          searchResults: [],
          availableKoperatives: [],
          error: null,
          hasSearched: false,
          isLoading: false,
        }),
      resetForm: () => set(initialState),
    }),
    {
      name: 'voyage-search-storage',
      partialize: state => ({
        fromVille: state.fromVille,
        toVille: state.toVille,
        departureDate: state.departureDate,
        returnDate: state.returnDate,
        passengers: state.passengers,
        isRoundTrip: state.isRoundTrip,
        koperativeId: state.koperativeId,
      }),
      storage: {
        getItem: name => {
          const str = customStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            // Restore dayjs objects from ISO strings
            if (parsed.state.departureDate) {
              const date = dayjs(parsed.state.departureDate);
              if (date.isBefore(dayjs())) {
                parsed.state.departureDate = dayjs().add(1, 'day');
              } else {
                parsed.state.departureDate = date;
              }
            }
            if (parsed.state.returnDate) {
              parsed.state.returnDate = dayjs(parsed.state.returnDate);
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          // Convert dayjs objects to ISO strings for storage
          const serialized = {
            ...value,
            state: {
              ...value.state,
              departureDate: value.state.departureDate?.toISOString?.() ?? value.state.departureDate,
              returnDate: value.state.returnDate?.toISOString?.() ?? value.state.returnDate,
            },
          };
          customStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: name => customStorage.removeItem(name),
      },
    },
  ),
);
export default useVoyageSearchStore;
