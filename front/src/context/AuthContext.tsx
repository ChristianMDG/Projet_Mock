import type { AuthContext } from '@/types/auth.types';
import { useAuthStore } from '@/stores/auth.store';

export const useAuth = (): AuthContext => {
  return useAuthStore();
};
