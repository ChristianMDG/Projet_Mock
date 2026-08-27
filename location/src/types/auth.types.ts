import type { UserOperator } from '@/models/UserOperator';

export interface LoginFormData {
  phone: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export type AccountModel = UserOperator;

export type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface AuthContext {
  user: UserOperator | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: UserOperator) => void;
  logout: () => void;
  setUser: (user: UserOperator) => void;
}

export interface ValidationErrors {
  phone?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UseAuthFormOptions {
  redirectTo?: string;
  initialMode?: AuthMode;
  showSocialLogin?: boolean;
  onSuccess?: () => void;
  prefillPhone?: string;
}

export interface AuthResponse {
  token: string;
  user?: UserOperator;
}

export interface AuthError {
  code: string;
  message: string;
  status: number;
}

export type AuthErrorCode =
  | 'error_invalid_credentials'
  | 'error_phone_already_taken'
  | 'error_network'
  | 'error_server_error'
  | 'error_validation_failed'
  | 'error_access_denied'
  | 'error_unknown';
