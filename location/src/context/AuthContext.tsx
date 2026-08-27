import type { AuthContext } from '@/types/auth.types';
import { useAuthStore } from '@/stores/auth.store';

export const useAuth = (): AuthContext => {
  const { user, token, isAuthenticated, isLoading, login, logout, setUser } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
  };
};
