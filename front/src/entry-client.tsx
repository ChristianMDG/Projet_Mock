import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { hydrate } from '@tanstack/react-query';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import { queryClient } from './utils/queryClient';
import { BrowserRouter } from 'react-router-dom';
import dayjs from './utils/dayjs';
import mg from './dayjs/mg.js';
import { setupAxiosAuthInterceptor } from './api/interceptor.api';
import i18n from './utils/i18n';

dayjs.locale('mg', mg, true);

setupAxiosAuthInterceptor();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const windowAny = window as any;
const dehydratedState = windowAny.__REACT_QUERY_STATE__;
const ssrLanguage = windowAny.__SSR_LANGUAGE__;
const ssrMode = windowAny.__MUI_MODE__ ?? 'light';

// Pre-hydrate SSR state into the QueryClient BEFORE React hydration.
// This ensures components already see cached data on first render,
// preventing isPending → skeleton flash during hydration.
if (dehydratedState) {
  hydrate(queryClient, dehydratedState);
}

// Sync language from SSR to prevent hydration mismatch
if (ssrLanguage && i18n.language !== ssrLanguage) {
  await i18n.changeLanguage(ssrLanguage);
}

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <QueryProvider state={dehydratedState}>
          <App initialMode={ssrMode} />
        </QueryProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
);
