import { UserOperator } from '@/models/UserOperator';
import type { LanguagePreference } from '@/models/UserInfo';
import { AccountModel, AuthResponse, LoginCredentials } from '@/types/auth.types';
import { useAuthStore } from '@/stores/auth.store';
import axios from './axios';

/**
 * Fetches the current user's information
 */
export const getCurrentUser = async () => {
  const response = await axios.get<UserOperator>('/users/current');
  return response.data;
};
export const createAccount = async (accountData: AccountModel) => {
  const { data } = await axios.post<UserOperator>('/users/account', accountData);
  return data;
};

export const updateUserAccount = async (id: number, accountData: Partial<UserOperator>) => {
  const { data } = await axios.put<string>(`/users/account/${id}`, accountData);
  return data;
};

export const loginWithToken = async (credentials: LoginCredentials) => {
  const auth = btoa(`${credentials.phone}:${credentials.password}`);
  const { data } = await axios.post<AuthResponse>(
    '/users/token',
    {},
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
  );
  if (data.token) {
    useAuthStore.getState().login(data.token, data.user ?? undefined);
  }
  return data;
};

export const forgotPassword = async (phone: string) => {
  await axios.post('/users/forgot-password', { phone });
};

export const resetPassword = async (phone: string, otp: string, newPassword: string) => {
  const { data } = await axios.post<string>('/users/reset-password', { phone, otp, newPassword });
  return data;
};

export const getUsers = async (search?: string) => {
  const { data } = await axios.get<UserOperator[]>('/users', {
    params: search ? { search } : undefined,
  });
  return data;
};

/**
 * Logout user and invalidate token on server
 */
export const logout = async () => {
  await axios.post('/users/logout');
};

/**
 * Update user's language preference
 */
export const updateLanguagePreference = async (language: LanguagePreference) => {
  const { data } = await axios.put<{ message: string; language: string }>('/users/language-preference', {
    language,
  });
  return data;
};

export const getOperatorsByKoperative = async (koperativeId: number) => {
  const { data } = await axios.get<UserOperator[]>(`/users/operators/koperative/${koperativeId}`);
  return data;
};

/**
 * Facebook OAuth login
 */
export const FacebookLoginWithToken = async (accessToken: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>('/auth/facebook/verify', {
    accessToken,
  });
  return response.data;
};

/**
 * Google OAuth login
 */
export const GoogleLoginWithToken = async (idToken: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>('/auth/google/verify', {
    idToken,
  });
  return response.data;
};
