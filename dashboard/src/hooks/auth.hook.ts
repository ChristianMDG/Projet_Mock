import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, logout as logoutApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import type { LoginCredentials } from '@/types/auth.types';
import axios from 'axios';

const ERROR_MESSAGES: Record<string, string> = {
  error_invalid_credentials: 'Téléphone ou mot de passe incorrect',
  error_access_denied: 'Accès non autorisé',
  error_network: 'Erreur de connexion. Vérifiez votre connexion internet',
  error_timeout: 'La requête a expiré. Veuillez réessayer',
  error_unknown: 'Une erreur est survenue. Veuillez réessayer',
};

function getErrorCode(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === 'string' && data.startsWith('error_')) return data;
    if (typeof data === 'object' && data && 'error' in data) return String(data.error);

    if (err.response?.status === 401) return 'error_invalid_credentials';
    if (err.response?.status === 403) return 'error_access_denied';
    if (err.code === 'ERR_NETWORK') return 'error_network';
    if (err.code === 'ECONNABORTED') return 'error_timeout';
  }
  return 'error_unknown';
}

function getErrorMessage(err: unknown): string {
  const code = getErrorCode(err);
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.error_unknown;
}

export function useLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: () => {
      setError(null);
      navigate('/');
    },
    onError: (err: unknown) => {
      setError(getErrorMessage(err));
    },
  });

  const login = (credentials: LoginCredentials, callbacks?: { onSuccess?: () => void; onError?: () => void }) => {
    mutation.mutate(credentials, {
      onSuccess: () => {
        setError(null);
        navigate('/');
        callbacks?.onSuccess?.();
      },
      onError: (err: unknown) => {
        setError(getErrorMessage(err));
        callbacks?.onError?.();
      },
    });
  };

  return {
    login,
    isLoading: mutation.isPending,
    error,
    clearError: () => setError(null),
  };
}

export function useLogout() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => navigate('/login'),
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.isPending,
  };
}

export function useAuth() {
  const { user, token, isAuthenticated, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    logout,
  };
}
