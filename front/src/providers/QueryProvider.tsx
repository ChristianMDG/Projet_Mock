import { ReactNode, useState, useEffect } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient as defaultQueryClient } from '@/utils/queryClient';
import { customStorage } from '@/utils/customStorage';
import { QueryClient, HydrationBoundary, DehydratedState } from '@tanstack/react-query';

interface QueryProviderProps {
  children: ReactNode;
  client?: QueryClient;
  state?: DehydratedState;
}

const persister = createAsyncStoragePersister({
  storage: customStorage,
});

export function QueryProvider({ children, client = defaultQueryClient, state }: Readonly<QueryProviderProps>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PersistQueryClientProvider client={client} persistOptions={{ persister }}>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
      {mounted && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
    </PersistQueryClientProvider>
  );
}
