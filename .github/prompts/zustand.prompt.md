---
agent: agent
---

# Zustand Store Development - Taxibrousse
**Note:** Remove any legacy Zustand patterns (e.g., direct state mutation, non-typed stores). Use only typed stores and selectors as per current best practices.

## Agent Instructions

- Keep stores small and focused; use only typed Zustand stores
- Remove any legacy Zustand code (direct state mutation, non-typed stores)
- Use selectors to minimize re-renders 
- Persist only what's necessary; avoid sensitive data
- Use positive conditions for state checks
- Provide smallest working example with types, initial state, actions
- **ALWAYS format files**: `cd front && npm run format`
- Import from `@/stores/` with clean module paths
- Store only UI state; use React Query for server state

## When to Use Zustand

### ✅ Use For
- Authentication state (user, token)
- UI state (modals, sidebar, drawers)
- Multi-step form state
- Application settings (language)
- Complex component communication

### ❌ Don't Use For
- Server data → React Query
- Simple component state → useState
- Form validation → Formik + Yup

## Store Structure

```
front/src/stores/
├── auth.store.ts           # Authentication
├── language.store.ts       # i18n preferences
├── header.store.ts         # Navigation state
├── voyage-scheduler.store.ts
├── payment.store.ts
└── seat-selection.store.ts
```

## Basic Store Pattern

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeatureState {
  data: DataType | null;
  isLoading: boolean;
  setData: (data: DataType) => void;
  reset: () => void;
}

const initialState = { data: null, isLoading: false };

export const useFeatureStore = create<FeatureState>()(
  persist(
    (set) => ({
      ...initialState,
      setData: (data) => set({ data }),
      reset: () => set(initialState),
    }),
    {
      name: 'feature-storage',
      partialize: (state) => ({ data: state.data }),
    }
  )
);
```

## UI State Store

```typescript
const useUIStore = create<UIState>((set) => ({
  drawerOpen: false,
  modalOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  toggleModal: () => set((s) => ({ modalOpen: !s.modalOpen })),
}));
```

## Usage with Selectors

```typescript
// ✅ Good - selective subscription
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// ❌ Bad - re-renders on any change
const { user, isAuthenticated, token } = useAuthStore();
```

## Integration with React Query

```typescript
const ReservationComponent = () => {
  // Server state
  const { data: voyage } = useVoyageQuery(voyageId);
  
  // Client state
  const { selectedSeats, addSeat } = useSeatSelectionStore();
  
  // Combine for submission
  const handleSubmit = () => {
    createReservation({ voyageId, seats: selectedSeats });
  };
};
```

## Existing Stores

| Store | Purpose |
|-------|---------|
| `auth.store.ts` | User, token, isAuthenticated |
| `language.store.ts` | Current language |
| `header.store.ts` | Navigation state |
| `seat-selection.store.ts` | Selected seats |
| `payment.store.ts` | Payment flow state |
| `voyage-search.store.ts` | Search filters |
