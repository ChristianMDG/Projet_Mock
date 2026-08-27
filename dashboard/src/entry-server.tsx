import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import './utils/i18n';

// Create a query client for SSR
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: false,
      },
    },
  });
}

export async function render(url: string, cookieHeader?: string) {
  const queryClient = createQueryClient();

  // Extract mode from cookies
  const mode = (cookieHeader?.match(/mui-mode=(light|dark)/)?.[1] || 'light') as 'light' | 'dark';

  // For dashboard, we prefetch minimal data since most data is behind auth
  // The actual data fetching will happen on client side after auth

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StaticRouter>
    </StrictMode>
  );

  const dehydratedState = dehydrate(queryClient);

  return { html, dehydratedState, mode, url };
}
