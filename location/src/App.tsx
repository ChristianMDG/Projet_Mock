import React, { Suspense, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appTheme } from './themes/appTheme';
import { ROUTES, syncLanguageFromPath } from '@/constants';
import { useLanguageSync } from '@/hooks/language-preference.hooks';
import { useGoogleAnalytics, useGlobalInteractionTracking } from '@/hooks/google-analytics.hook';
import { AppLayout } from './shared';
import Labels from '@/labelKeys.json';

// Lazy load all pages for better code splitting and performance
const RentalHomePage = React.lazy(() => import('./pages/RentalHomePage'));
const RentalSearchResultsPage = React.lazy(() => import('./pages/RentalSearchResultsPage'));
const RentalVehicleDetailPage = React.lazy(() => import('./pages/RentalVehicleDetailPage'));
const RentalUtilitairesPage = React.lazy(() => import('./pages/RentalUtilitairesPage'));
const RentalVoituresPage = React.lazy(() => import('./pages/RentalVoituresPage'));
const RentalAgencesPage = React.lazy(() => import('./pages/RentalAgencesPage'));
const RentalUtilitaireDetailPage = React.lazy(() => import('./pages/RentalUtilitaireDetailPage'));
const RentalCheckoutPage = React.lazy(() => import('./pages/RentalCheckoutPage'));
const RentalGuidePage = React.lazy(() => import('./pages/RentalGuidePage'));
const RentalTermsPage = React.lazy(() => import('./pages/RentalTermsPage'));
const RentalContactPage = React.lazy(() => import('./pages/RentalContactPage'));
const RentalAboutPage = React.lazy(() => import('./pages/RentalAboutPage'));

const allLanguages = ['mg', 'fr', 'en'];

const routeConfig = [
  // Standalone routes
  { key: 'rentalHomeStandalone', path: ROUTES.rentalHomeStandalone, element: <RentalHomePage /> },
  {
    key: 'rentalSearchResultsStandalone',
    path: ROUTES.rentalSearchResultsStandalone,
    element: <RentalSearchResultsPage />,
  },
  {
    key: 'rentalVehicleDetailStandalone',
    path: ROUTES.rentalVehicleDetailStandalone,
    element: <RentalVehicleDetailPage />,
  },
  { key: 'rentalUtilitairesStandalone', path: ROUTES.rentalUtilitairesStandalone, element: <RentalUtilitairesPage /> },
  {
    key: 'rentalUtilitaireDetailStandalone',
    path: ROUTES.rentalUtilitaireDetailStandalone,
    element: <RentalUtilitaireDetailPage />,
  },
  { key: 'rentalVoituresStandalone', path: ROUTES.rentalVoituresStandalone, element: <RentalVoituresPage /> },
  { key: 'rentalAgencesStandalone', path: ROUTES.rentalAgencesStandalone, element: <RentalAgencesPage /> },
  { key: 'rentalCheckoutStandalone', path: ROUTES.rentalCheckoutStandalone, element: <RentalCheckoutPage /> },
  { key: 'rentalGuideStandalone', path: ROUTES.rentalGuideStandalone, element: <RentalGuidePage /> },
  { key: 'rentalTermsStandalone', path: ROUTES.rentalTermsStandalone, element: <RentalTermsPage /> },
  { key: 'rentalContactStandalone', path: ROUTES.rentalContactStandalone, element: <RentalContactPage /> },
  { key: 'rentalAboutStandalone', path: ROUTES.rentalAboutStandalone, element: <RentalAboutPage /> },

  // /location prefix routes
  { key: 'rentalHome', path: ROUTES.rentalHome, element: <RentalHomePage /> },
  { key: 'rentalSearchResults', path: ROUTES.rentalSearchResults, element: <RentalSearchResultsPage /> },
  { key: 'rentalVehicleDetail', path: ROUTES.rentalVehicleDetail, element: <RentalVehicleDetailPage /> },
  { key: 'rentalUtilitaires', path: ROUTES.rentalUtilitaires, element: <RentalUtilitairesPage /> },
  { key: 'rentalUtilitaireDetail', path: ROUTES.rentalUtilitaireDetail, element: <RentalUtilitaireDetailPage /> },
  { key: 'rentalVoitures', path: ROUTES.rentalVoitures, element: <RentalVoituresPage /> },
  { key: 'rentalAgences', path: ROUTES.rentalAgences, element: <RentalAgencesPage /> },
  { key: 'rentalCheckout', path: ROUTES.rentalCheckout, element: <RentalCheckoutPage /> },
  { key: 'rentalGuide', path: ROUTES.rentalGuide, element: <RentalGuidePage /> },
  { key: 'rentalTerms', path: ROUTES.rentalTerms, element: <RentalTermsPage /> },
  { key: 'rentalContact', path: ROUTES.rentalContact, element: <RentalContactPage /> },
  { key: 'rentalAbout', path: ROUTES.rentalAbout, element: <RentalAboutPage /> },
];

const App: React.FC<{ initialMode?: 'light' | 'dark' }> = ({ initialMode }) => {
  const { i18n, t } = useTranslation();
  const location = useLocation();

  useLanguageSync();
  useGoogleAnalytics();
  useGlobalInteractionTracking();

  // Sync i18n language with URL path (mg has no prefix, fr/en have prefix)
  useEffect(() => {
    syncLanguageFromPath(location.pathname, i18n).then(_ => {});
  }, [location.pathname, i18n]);

  return (
    <ThemeProvider theme={appTheme} defaultMode={initialMode}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
        <Suspense fallback={<Box sx={{ p: 4, textAlign: 'center' }}>{t(Labels.rental_loading)}</Box>}>
          <AppLayout>
            <Routes>
              {/* Generate all localized routes */}
              {allLanguages.flatMap(lang =>
                routeConfig.map(({ key, path, element }) => (
                  <Route key={`${key}-${lang}`} path={path[lang]} element={element} />
                )),
              )}
              <Route path="*" element={<RentalHomePage />} />
            </Routes>
          </AppLayout>
        </Suspense>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
