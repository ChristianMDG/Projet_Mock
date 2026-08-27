import axios from './axios';
import { useAuthStore } from '@/stores/auth.store';
import type { AxiosError } from 'axios';

export class AuthenticationError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
    this.name = 'AuthenticationError';
  }
}

const ERROR_CODES: Record<number, string> = {
  400: 'error_bad_request',
  401: 'error_invalid_credentials',
  403: 'error_access_denied',
  404: 'error_not_found',
  409: 'error_phone_already_taken',
  422: 'error_validation_failed',
  500: 'error_server_error',
  503: 'error_service_unavailable',
};

function extractErrorCode(status: number, data: unknown): string {
  if (typeof data === 'string' && data.startsWith('error_')) return data;
  if (typeof data === 'object' && data && 'error' in data) return String((data as { error: string }).error);
  return ERROR_CODES[status] ?? 'error_unknown';
}

let isInterceptorSetup = false;

export function setupAxiosAuthInterceptor() {
  if (isInterceptorSetup) return;
  isInterceptorSetup = true;

  // Add token to requests
  axios.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Handle errors
  axios.interceptors.response.use(
    res => res,
    (error: AxiosError) => {
      const response = error.response;
      if (response) {
        const { status, data } = response;
        const code = extractErrorCode(status, data);

        // Auto logout on 401 (except login endpoint)
        const isLoginEndpoint = error.config?.url?.includes('/token');
        if (status === 401 && useAuthStore.getState().token && !isLoginEndpoint) {
          useAuthStore.getState().logout();
        }

        return Promise.reject(new AuthenticationError(code, status));
      }

      return Promise.reject(new AuthenticationError('error_network', 0));
    },
  );
}
