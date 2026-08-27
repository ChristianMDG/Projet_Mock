import { create } from 'zustand';
import type { AuthState } from '@/types/auth.types';
import { UserInfo } from '@/models';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

const isBrowser = typeof window !== 'undefined';

const getStoredToken = (): string | null => {
  if (isBrowser) return localStorage.getItem(TOKEN_KEY);
  return null;
};

const getStoredUser = (): UserInfo | null => {
  if (isBrowser) {
    const data = localStorage.getItem(USER_KEY);
    if (data) return JSON.parse(data);
  }
  return null;
};

const initialToken = getStoredToken();
const initialUser = getStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  isLoading: false,

  hydrate: () => {
    const token = getStoredToken();
    const user = getStoredUser();
    set({
      token,
      user,
      isAuthenticated: Boolean(token),
    });
  },

  login: (token: string, user?: UserInfo) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));

    set({
      token,
      user: user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setUser: (user: UserInfo) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },
}));

// Hydrate on load
if (isBrowser) {
  queueMicrotask(() => useAuthStore.getState().hydrate());
}
