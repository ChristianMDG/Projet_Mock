import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import { BrowserRouter } from 'react-router-dom';
import dayjs from './utils/dayjs';
import mg from './dayjs/mg.js';
import { setupAxiosAuthInterceptor } from './api/interceptor.api';
import './utils/i18n';
import i18n from './utils/i18n';

dayjs.locale('mg', mg, true);

setupAxiosAuthInterceptor();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const windowAny = window as any;
const dehydratedState = windowAny.__REACT_QUERY_STATE__;
const ssrLanguage = windowAny.__SSR_LANGUAGE__;
const ssrMode = windowAny.__MUI_MODE__ || 'light';

// Ensure i18n language matches SSR before hydration
async function hydrateApp() {
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
}

hydrateApp();
