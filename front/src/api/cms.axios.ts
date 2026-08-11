import axios, { AxiosInstance } from 'axios';

const cmsAxios: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_CMS_API_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_CMS_API_KEY && {
      Authorization: `Bearer ${import.meta.env.VITE_CMS_API_KEY}`,
    }),
  },
});

export default cmsAxios;
