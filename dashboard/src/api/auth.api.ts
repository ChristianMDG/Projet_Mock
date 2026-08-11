import api from './axios';
import type { AuthResponse, LoginCredentials } from '@/types/auth.types';
import { UserInfo } from '@/models';
import { useAuthStore } from '@/stores/auth.store';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const auth = btoa(`${credentials.phone}:${credentials.password}`);
  const { data } = await api.post<AuthResponse>(
    '/users/token',
    {},
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (data.token) {
    useAuthStore.getState().login(data.token, data.user);
  }

  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/users/logout');
  useAuthStore.getState().logout();
};

export const getCurrentUser = async (): Promise<UserInfo> => {
  const { data } = await api.get<UserInfo>('/users/current');
  return data;
};
