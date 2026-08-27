import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { queryClient } from '../utils/queryClient';
import { customStorage } from '@/utils/customStorage';

const VERSION_KEY = 'app-version';
const VERSION_HEADER = 'x-app-version';
const USER_THEME = 'X-Theme-App';

const checkVersion = async (response: AxiosResponse) => {
  const backendVersion = response.headers[VERSION_HEADER];
  const storedVersion = customStorage.getItem(VERSION_KEY);

  if (backendVersion && storedVersion) {
    // Use localeCompare with numeric: true to correctly compare version strings (e.g. "1.10" > "1.2")
    const isNewer = backendVersion.localeCompare(storedVersion, undefined, { numeric: true, sensitivity: 'base' }) > 0;

    if (isNewer) {
      if (typeof window !== 'undefined') {
        document.cookie.split(';').forEach(c => {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/');
        });
        localStorage.clear();
        sessionStorage.clear();
        if ('caches' in window) {
          caches
            .keys()
            .then(keys => keys.forEach(key => caches.delete(key)))
            .catch(() => {});
        }
      }
      customStorage.setItem(VERSION_KEY, backendVersion);
      await queryClient.invalidateQueries();
      queryClient.clear();

      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  } else if (backendVersion && !storedVersion) {
    customStorage.setItem(VERSION_KEY, backendVersion);
  }
};

const baseURL =
  (typeof process !== 'undefined' ? process.env.SSR_VITE_API_URL : undefined) ?? import.meta.env?.VITE_API_URL;

const instance: AxiosInstance = axios.create({
  timeout: 10000,
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: params => {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      const val = params[key];
      if (val !== undefined && val !== null) {
        if (Array.isArray(val)) {
          val.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, val);
        }
      }
    }
    return searchParams.toString();
  },
});

// Add sender ID to all requests for anonymous user identification
instance.interceptors.request.use(
  config => {
    const userTheme = customStorage.getItem(USER_THEME);
    config.headers[USER_THEME] = userTheme ?? 'light';
    return config;
  },
  error => {
    throw error;
  },
);

instance.interceptors.response.use(
  async response => {
    await checkVersion(response);
    return response;
  },
  async error => {
    if (error.response) await checkVersion(error.response);
    throw error;
  },
);

export default instance;

// Helper to set theme header on the axios instance defaults so it's present on all requests
export function setThemeHeader(value: string) {
  try {
    const headers = instance.defaults.headers as Record<string, unknown>;
    headers[USER_THEME] = value;
    headers[USER_THEME.toLowerCase()] = value;
  } catch {
    // ignore
  }
}
