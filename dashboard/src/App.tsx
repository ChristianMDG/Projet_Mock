import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import { ColorSchemeProvider } from '@/shared';

// Pages
import {
  HomePage,
  MessagesPage,
  LoginPage,
  ReservationPage,
  AnalyticsPage,
  VoyageManagementPage,
  KoperativeManagementPage,
  UserManagementPage,
  OperateurManagementPage,
  ClassesPage,
} from '@/pages';
import ProtectedRoute from '@/components/ProtectedRoute';
import RouteManagementPage from '@/pages/RouteManagementPage';
import DashboardLayout from '@/components/DashboardLayout';

export default function App() {
  return (
    <ColorSchemeProvider>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/routes" element={<RouteManagementPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/voyages" element={<VoyageManagementPage />} />
            <Route path="/koperatives" element={<KoperativeManagementPage />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/operateur" element={<OperateurManagementPage />} />
            <Route path="/classes" element={<ClassesPage />} />
          </Route>
        </Route>
      </Routes>
    </ColorSchemeProvider>
  );
}
