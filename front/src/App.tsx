import React, { Suspense, useEffect } from 'react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TFunction, i18n } from 'i18next';
import { appTheme } from './themes/appTheme';
import { ROUTES, syncLanguageFromPath } from '@/constants';
import { useLanguageSync } from '@/hooks/language-preference.hooks';
import type { LayoutProps } from './types/app.types';
import { getMainContentStyles } from './types/layout.utils';
import BasicHeader from './shared/BasicHeader';
import { ScrollToTop, PageLoader } from './components/shared';
import BasicFooter from '@/shared/BasicFooter';
import { SectionProvider } from '@/context';
import { MessengerChat } from '@/components/ui';

import HomePage from './pages/HomePage';
import KoperativePage from './pages/KoperativePage';
import KoperativeDetailPage from './pages/KoperativeDetailPage';
import AccountDetailPage from './pages/AccountDetailPage';
import GarePage from './pages/GarePage';
import GareDetailPage from './pages/GareDetailPage';
import { OperatorPage } from './pages/OperatorPage';
import OperatorBookingPage from './pages/OperatorBookingPage';
import ContratPage from './pages/ContratPage';
import ContratFormPage from './pages/ContratFormPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VoyageSchedulerPage from './pages/SchedulerPage';
import VoyagePage from './pages/VoyagePage';
import ReservationPage from './pages/ReservationPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ReservationConfirmationPage from './pages/ReservationConfirmationPage';
import VoyageWeeklyPage from './pages/VoyageWeeklyPage';
import ListDynamicPage from './pages/ListDynamicPage';
import DynamicPage from './pages/DynamicPage';
import KoperativeInfoPage from './pages/KoperativeInfoPage';

const AppLayout: React.FC<LayoutProps & { t: TFunction; i18n: i18n }> = ({ children, t, i18n }) => (
  <Box>
    <BasicHeader />
    <Container component="main" maxWidth="xl" sx={getMainContentStyles}>
      {children}
    </Container>
    <BasicFooter t={t} i18n={i18n} />
    <MessengerChat />
  </Box>
);

const allLanguages = ['mg', 'fr', 'en'];
const routeConfig = [
  { key: 'home', path: ROUTES.home, element: <HomePage /> },
  { key: 'login', path: ROUTES.login, element: <LoginPage /> },
  { key: 'resetPassword', path: ROUTES.resetPassword, element: <ResetPasswordPage /> },
  { key: 'koperativesList', path: ROUTES.koperativesList, element: <KoperativePage /> },
  { key: 'koperativeDetail', path: ROUTES.koperativeDetail, element: <KoperativeDetailPage /> },
  { key: 'koperativeVoyageScheduler', path: ROUTES.koperativeVoyageScheduler, element: <VoyageSchedulerPage /> },
  { key: 'garesList', path: ROUTES.garesList, element: <GarePage /> },
  { key: 'gareDetail', path: ROUTES.gareDetail, element: <GareDetailPage /> },
  { key: 'operators', path: ROUTES.operators, element: <OperatorPage /> },
  { key: 'operatorBooking', path: ROUTES.operatorBooking, element: <OperatorBookingPage /> },
  { key: 'voyagesList', path: ROUTES.voyagesList, element: <VoyagePage /> },
  { key: 'reservationsList', path: ROUTES.reservationsList, element: <ReservationPage /> },
  { key: 'reservationsByVoyage', path: ROUTES.reservationsByVoyage, element: <ReservationPage /> },
  { key: 'searchResults', path: ROUTES.searchResults, element: <VoyageWeeklyPage /> },
  { key: 'paymentVoyage', path: ROUTES.paymentVoyage, element: <PaymentPage /> },
  { key: 'payment', path: ROUTES.payment, element: <PaymentPage /> },
  { key: 'paymentSuccess', path: ROUTES.paymentSuccess, element: <PaymentSuccessPage /> },
  { key: 'reservationConfirmation', path: ROUTES.reservationConfirmation, element: <ReservationConfirmationPage /> },
  { key: 'contratsList', path: ROUTES.contratsList, element: <ContratPage /> },
  { key: 'contratCreate', path: ROUTES.contratCreate, element: <ContratFormPage /> },
  { key: 'contratEdit', path: ROUTES.contratEdit, element: <ContratFormPage /> },
  { key: 'pageInformations', path: ROUTES.pageInformations, element: <ListDynamicPage /> },
  { key: 'dynamicPage', path: ROUTES.dynamicPage, element: <DynamicPage /> },
  { key: 'accountDetail', path: ROUTES.accountDetail, element: <AccountDetailPage /> },
  { key: 'cooperativeInfo', path: ROUTES.cooperativeInfo, element: <KoperativeInfoPage /> },
];

const SSRSafeNavigate: React.FC<{ to: string; replace?: boolean }> = ({ to, replace }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);
  return null;
};

const App: React.FC<{ initialMode?: 'light' | 'dark' }> = ({ initialMode }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useLanguageSync();

  // Sync i18n language with URL path (mg has no prefix, fr/en have prefix)
  useEffect(() => {
    syncLanguageFromPath(location.pathname, i18n).then(_ => {});
  }, [location.pathname, i18n]);

  return (
    <ThemeProvider theme={appTheme} defaultMode={initialMode}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
        <SectionProvider>
          <Routes>
            <Route
              path="/*"
              element={
                <AppLayout t={t} i18n={i18n}>
                  <ScrollToTop />
                  <Suspense fallback={<PageLoader fullScreen />}>
                    <Routes>
                      {/* Generate all localized routes */}
                      {allLanguages.flatMap(lang =>
                        routeConfig.map(({ key, path, element }) => (
                          <Route key={`${key}-${lang}`} path={path[lang]} element={element} />
                        )),
                      )}

                      {/* Root redirect */}
                      <Route path="/" element={<SSRSafeNavigate to={ROUTES.home[i18n.language]} replace />} />

                      {/* Fallback */}
                      <Route path="*" element={<SSRSafeNavigate to={ROUTES.home[i18n.language]} replace />} />
                    </Routes>
                  </Suspense>
                </AppLayout>
              }
            />
          </Routes>
        </SectionProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
