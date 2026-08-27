import { StrictMode, useEffect, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, HydrationBoundary, DehydratedState } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App';
import './utils/i18n';

// Retrieve dehydrated state from SSR
declare global {
  interface Window {
    __REACT_QUERY_STATE__?: DehydratedState;
    __MUI_MODE__?: 'light' | 'dark';
  }
}

const dehydratedState = window.__REACT_QUERY_STATE__;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

// Devtools must mount after hydration to avoid SSR/client tree mismatch
function DevtoolsAfterHydration() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (mounted) {
    return <ReactQueryDevtools initialIsOpen={false} />;
  }
  return null;
}

// Hydrate the app with SSR content
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HydrationBoundary>
      <DevtoolsAfterHydration />
    </QueryClientProvider>
  </StrictMode>
);
