---
agent: agent
---

# React Query Development - Taxibrousse
**Note:** Only use React Query v5 patterns. Remove any legacy usage of `useQuery`/`useMutation` from v3/v4. Always use hooks from `front/src/hooks/` and shared types from `@/types/`.

## Agent Instructions

- Keep hooks minimal; use only React Query v5 APIs
- Remove any legacy React Query code (old queryClient, refetchOnWindowFocus, etc.)
- Reuse `axios.ts` and `cms.axios.ts`, shared types from `@/types/`
- Prefer `select`, `enabled`, and `staleTime` for performance
- Use positive conditions for error handling and loading states
- Normalize errors once; surface concise messages to UI
- For mutations, implement only essential optimistic updates
- **ALWAYS format files**: `cd front && npm run format`
- Use `@/` imports consistently

## When to Use React Query

### ✅ Use For
- API data fetching (GET requests)
- Server state caching
- Background refetching
- Mutations (POST, PUT, DELETE)
- Pagination and infinite queries

### ❌ Don't Use For
- Client-side state → Zustand
- Form state → Formik
- Static data → constants
- Deprecated React Query APIs (v3/v4)

## Hook Structure
// ...existing code...

```
front/src/hooks/
├── voyage.hooks.ts         # Voyage queries/mutations
├── reservation.hooks.ts    # Reservation queries/mutations
├── dynamic-page.hooks.ts   # CMS content queries
├── hero-content.hooks.ts   # Hero content queries
└── user.hooks.ts           # User queries
```

## Basic Query Pattern

```typescript
import { useQuery } from '@tanstack/react-query';
import { getVoyages } from '@/api/voyage.api';

export const useVoyagesQuery = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['voyages', params],
    queryFn: () => getVoyages(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useVoyageQuery = (id: string) => {
  return useQuery({
    queryKey: ['voyage', id],
    queryFn: () => getVoyage(id),
    enabled: !!id,
  });
};
```

## CMS Query Pattern

```typescript
export const useDynamicPageBySlug = (slug: string) => {
  const { language } = useTranslation();
  return useQuery({
    queryKey: ['dynamic-page', slug, language],
    queryFn: () => getDynamicPageBySlug(slug, language),
    staleTime: 10 * 60 * 1000, // CMS content is stable
  });
};
```

## Mutation Pattern

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createReservation,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['reservations'] });
      qc.invalidateQueries({ queryKey: ['voyage', data.voyageId] });
    },
  });
};
```

## Optimistic Update

```typescript
export const useUpdateReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateReservation,
    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ['reservation', updated.id] });
      const previous = qc.getQueryData(['reservation', updated.id]);
      qc.setQueryData(['reservation', updated.id], updated);
      return { previous };
    },
    onError: (err, updated, context) => {
      qc.setQueryData(['reservation', updated.id], context?.previous);
    },
    onSettled: (data, err, updated) => {
      qc.invalidateQueries({ queryKey: ['reservation', updated.id] });
    },
  });
};
```

## Integration with Zustand

```typescript
const ReservationPage = () => {
  // Server state
  const { data: voyage, isLoading } = useVoyageQuery(voyageId);
  const createMutation = useCreateReservation();
  
  // Client state
  const { selectedSeats } = useSeatSelectionStore();
  
  const handleSubmit = async (formData) => {
    await createMutation.mutateAsync({
      ...formData,
      seats: selectedSeats,
    });
  };
};
```

## Existing Hooks

| Hook | Purpose |
|------|---------|
| `useVoyagesQuery` | List voyages with filters |
| `useVoyageQuery` | Single voyage details |
| `useReservationsQuery` | User reservations |
| `useDynamicPageBySlug` | CMS dynamic pages |
| `useHeroContent` | Hero section content |
| `useKoperativesQuery` | Cooperatives list |
| `useGaresQuery` | Stations list |
