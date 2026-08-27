import { create } from 'zustand';
import type { UserOperator } from '@/models/UserOperator';
import type { AuthContext } from '@/types/auth.types';
import { queryClient } from '@/utils/queryClient';
import { logout as logoutAPI } from '@/api/user.api';
import { customStorage } from '@/utils/customStorage';
import dayjs from '@/utils/dayjs';
import { AuthorityEnum } from '@/models/enums';

const TOKEN_STORAGE_KEY = 'txbr_auth_token';
const USER_STORAGE_KEY = 'txbr_auth_user';
const AUTH_TIMESTAMP_KEY = 'txbr_auth_timestamp';

const getStoredToken = (): string | null => {
  return customStorage.getItem(TOKEN_STORAGE_KEY);
};

const getStoredUser = (): UserOperator | null => {
  const userJson = customStorage.getItem(USER_STORAGE_KEY);
  return userJson ? (JSON.parse(userJson) as UserOperator) : null;
};

const storeToken = (token: string | null): void => {
  if (token) {
    customStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    customStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

const storeUser = (user: UserOperator | null): void => {
  if (user) {
    customStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    customStorage.removeItem(USER_STORAGE_KEY);
  }
};

const computeIsGuichetAndInactive = (user: UserOperator | null): boolean => {
  return Boolean(user?.authorities?.some(role => role.name === AuthorityEnum.GUICHET)) && user?.isActive === false;
};

interface AuthStoreState extends AuthContext {
  isHydrated: boolean;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  isGuichetAndInactive: false,

  hydrate: () => {
    if (get().isHydrated) return;

    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    set({
      user: storedUser,
      token: storedToken,
      isAuthenticated: !!storedToken,
      isHydrated: true,
      isGuichetAndInactive: computeIsGuichetAndInactive(storedUser),
    });
  },

  login: (token: string, user?: UserOperator) => {
    storeToken(token);
    storeUser(user ?? null);
    customStorage.setItem(AUTH_TIMESTAMP_KEY, dayjs().valueOf().toString());

    set({
      token,
      user: user ?? null,
      isAuthenticated: true,
      isLoading: false,
      isGuichetAndInactive: computeIsGuichetAndInactive(user ?? null),
    });
  },

  logout: async () => {
    await logoutAPI();

    queryClient.clear();
    customStorage.clear();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isGuichetAndInactive: false,
    });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },

  setUser: (user: UserOperator) => {
    storeUser(user);
    set({ user, isGuichetAndInactive: computeIsGuichetAndInactive(user) });
  },
}));
