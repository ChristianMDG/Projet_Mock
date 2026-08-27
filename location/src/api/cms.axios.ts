import axios, { AxiosInstance } from 'axios';

const baseURL =
  typeof window === 'undefined'
    ? (process.env.SSR_VITE_CMS_API_URL ?? import.meta.env.VITE_CMS_API_URL)
    : import.meta.env.VITE_CMS_API_URL;

const cmsAxios: AxiosInstance = axios.create({
  baseURL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_CMS_API_KEY && {
      Authorization: `Bearer ${import.meta.env.VITE_CMS_API_KEY}`,
    }),
  },
});

export default cmsAxios;
