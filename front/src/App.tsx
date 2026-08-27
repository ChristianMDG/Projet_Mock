import React, { useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appTheme } from './themes/appTheme';
import { ROUTES, syncLanguageFromPath } from '@/constants';
import { useLanguageSync } from '@/hooks/language-preference.hooks';
import { useGoogleAnalytics, useGlobalInteractionTracking } from '@/hooks/google-analytics.hook';
import ScrollToTop from '@/components/shared/ScrollToTop';
import { RootLayout } from './shared';
import { useAuthStore } from '@/stores/auth.store';
import { useMessagingStore } from '@/stores/messaging.store';
import useVoyageSearchStore from '@/stores/voyage-search.store';
import { useVoyagePageStore } from '@/stores/voyage.store';
import { useCartStore } from '@/stores/cart.store';
import { usePaymentStore } from '@/stores/payment.store';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useGuestReservationStore } from '@/stores/guest-reservation.store';

// Direct page imports to match SSR and prevent hydration mismatch
import HomePage from './pages/HomePage';
import KoperativePage from './pages/KoperativePage';
import KoperativeDetailPage from './pages/KoperativeDetailPage';
import AccountDetailPage from './pages/AccountDetailPage';
import GarePage from './pages/GarePage';
import GareDetailPage from './pages/GareDetailPage';
import { OperatorPage } from './pages/OperatorPage';
import OperatorBookingPage from './pages/OperatorBookingPage';

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
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ShopPaymentSuccessPage from './pages/ShopPaymentSuccessPage';
import ShopPaymentCancelPage from './pages/ShopPaymentCancelPage';

const allLanguages = ['mg', 'fr', 'en'];
const standaloneRouteConfig = [
  { key: 'login', path: ROUTES.login, element: <LoginPage /> },
  { key: 'resetPassword', path: ROUTES.resetPassword, element: <ResetPasswordPage /> },
];
const routeConfig = [
  { key: 'home', path: ROUTES.home, element: <HomePage /> },
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

  { key: 'pageInformations', path: ROUTES.pageInformations, element: <ListDynamicPage /> },
  { key: 'dynamicPage', path: ROUTES.dynamicPage, element: <DynamicPage /> },
  { key: 'accountDetail', path: ROUTES.accountDetail, element: <AccountDetailPage /> },
  { key: 'cooperativeInfo', path: ROUTES.cooperativeInfo, element: <KoperativeInfoPage /> },
  { key: 'shop', path: ROUTES.shop, element: <ShopPage /> },
  { key: 'shopCheckout', path: ROUTES.shopCheckout, element: <CheckoutPage /> },
  { key: 'shopPaymentSuccess', path: ROUTES.shopPaymentSuccess, element: <ShopPaymentSuccessPage /> },
  { key: 'shopPaymentCancel', path: ROUTES.shopPaymentCancel, element: <ShopPaymentCancelPage /> },
  { key: 'shopProduct', path: ROUTES.shopProduct, element: <ProductDetailPage /> },
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
  const hydrateAuth = useAuthStore(state => state.hydrate);
  const initNavigatorRoom = useMessagingStore(state => state.initNavigatorRoom);

  useLanguageSync();
  useGoogleAnalytics();
  useGlobalInteractionTracking();

  useEffect(() => {
    hydrateAuth();
    initNavigatorRoom();
    void useVoyageSearchStore.persist.rehydrate();
    void useVoyagePageStore.persist.rehydrate();
    void useCartStore.persist.rehydrate();
    void usePaymentStore.persist.rehydrate();
    void useSeatSelectionStore.persist.rehydrate();
    void useCheckoutStore.persist.rehydrate();
    void useGuestReservationStore.persist.rehydrate();
  }, [hydrateAuth, initNavigatorRoom]);

  // Sync i18n language with URL path (mg has no prefix, fr/en have prefix)
  useEffect(() => {
    syncLanguageFromPath(location.pathname, i18n).then(_ => {});
  }, [location.pathname, i18n]);

  return (
    <ThemeProvider theme={appTheme} defaultMode={initialMode}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
        <Routes>
          {/* Standalone auth routes (no header/footer) */}
          {allLanguages.flatMap(lang =>
            standaloneRouteConfig.map(({ key, path, element }) => (
              <Route key={`${key}-${lang}`} path={path[lang]} element={element} />
            )),
          )}

          <Route
            path="/*"
            element={
              <RootLayout t={t} i18n={i18n}>
                <ScrollToTop />
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
              </RootLayout>
            }
          />
        </Routes>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
