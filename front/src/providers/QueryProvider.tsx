import { ReactNode, useState, useEffect } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient as defaultQueryClient } from '@/utils/queryClient';
import { customStorage } from '@/utils/customStorage';
import { QueryClient, QueryClientProvider, hydrate, HydrationBoundary, DehydratedState } from '@tanstack/react-query';

interface QueryProviderProps {
  children: ReactNode;
  client?: QueryClient;
  state?: DehydratedState;
  ssr?: boolean;
}

const persister = createAsyncStoragePersister({
  storage: customStorage,
});

/**
 * SSR-aware QueryProvider.
 * - On the server (ssr=true): uses plain QueryClientProvider so that data
 *   pre-fetched via fetchQuery() is preserved in the cache during renderToString.
 * - On the client: uses PersistQueryClientProvider so that the cache is
 *   persisted to localStorage between page visits. The onSuccess callback
 *   re-hydrates SSR state after localStorage restore to prevent stale
 *   localStorage data from overriding fresh SSR data.
 */
export function QueryProvider({
  children,
  client = defaultQueryClient,
  state,
  ssr = false,
}: Readonly<QueryProviderProps>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (ssr) {
    return (
      <QueryClientProvider client={client}>
        <HydrationBoundary state={state}>{children}</HydrationBoundary>
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: query => {
            // Only persist successful queries to avoid caching error/loading states
            return query.state.status === 'success';
          },
        },
      }}
      onSuccess={() => {
        // After persister restores from localStorage, re-hydrate SSR state
        // so fresh SSR data always overrides stale localStorage data.
        // This prevents the skeleton loop: persist restore → stale data → refetch → skeleton.
        if (state) {
          hydrate(client, state);
        }
      }}
    >
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
      {mounted && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
    </PersistQueryClientProvider>
  );
}
