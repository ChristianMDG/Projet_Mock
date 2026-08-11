import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Outlet />;

  return <Navigate to="/login" replace />;
}
