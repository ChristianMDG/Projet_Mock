import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTranslation } from 'react-i18next';

import { ColorSchemeProvider } from '@/shared';

// Pages
import {
  HomePage,
  MessagesPage,
  LoginPage,
  ReservationPage,
  AnalyticsPage,
  UserManagementPage,
  ClassesPage,
  ProductManagement,
  CategoryManagementPage,
  SubcategoryManagementPage,
  OrderManagementPage,
  InventoryManagementPage,
  PromotionManagementPage,
  ShopAnalyticsPage,
  DeliveryConfigurationPage,
  FacebookPage,
  OperateurPage,
  CommissionPage,
  FinancePage,
} from '@/pages';
import ProtectedRoute from '@/components/ProtectedRoute';
import RouteManagementPage from '@/pages/RouteManagementPage';
import DashboardLayout from '@/components/DashboardLayout';

export default function App() {
  const { i18n } = useTranslation();

  return (
    <ColorSchemeProvider>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/routes" element={<RouteManagementPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/commissions" element={<CommissionPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/facebook" element={<FacebookPage />} />
              <Route path="/operateur" element={<OperateurPage />} />
              <Route path="/shop/products" element={<ProductManagement />} />
              <Route path="/shop/categories" element={<CategoryManagementPage />} />
              <Route path="/shop/subcategories" element={<SubcategoryManagementPage />} />
              <Route path="/shop/orders" element={<OrderManagementPage />} />
              <Route path="/shop/inventory" element={<InventoryManagementPage />} />
              <Route path="/shop/promotions" element={<PromotionManagementPage />} />
              <Route path="/shop/analytics" element={<ShopAnalyticsPage />} />
              <Route path="/shop/delivery" element={<DeliveryConfigurationPage />} />
            </Route>
          </Route>
        </Routes>
      </LocalizationProvider>
    </ColorSchemeProvider>
  );
}
