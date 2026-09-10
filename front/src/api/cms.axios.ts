import axios, { AxiosInstance } from 'axios';

// import.meta.env works in both browser and Vite SSR dev mode.
// process.env.SSR_VITE_* is the fallback for production SSR builds (and tsx Node.js)
// where import.meta.env values are either inlined at build time or undefined.
const baseURL =
  (typeof process !== 'undefined' ? process.env.SSR_VITE_CMS_API_URL : undefined) ?? import.meta.env?.VITE_CMS_API_URL;
const cmsApiKey =
  (typeof process !== 'undefined' ? process.env.SSR_VITE_CMS_API_KEY : undefined) ?? import.meta.env?.VITE_CMS_API_KEY;

const cmsAxios: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    ...(cmsApiKey && {
      Authorization: `Bearer ${cmsApiKey}`,
    }),
  },
});

export default cmsAxios;
