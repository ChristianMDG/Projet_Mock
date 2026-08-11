/**
 * Auth types using shared models from front project.
 */

import { UserInfo } from '@/models';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: UserInfo;
}

export interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: UserInfo) => void;
  logout: () => void;
  setUser: (user: UserInfo) => void;
  hydrate: () => void;
}
