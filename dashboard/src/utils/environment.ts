const isLocal = import.meta.env.VITE_ENV === 'development';
const baseUrl = isLocal ? `http://${import.meta.env.VITE_DOMAIN_MAIN}` : `https://${import.meta.env.VITE_DOMAIN_MAIN}`;

export const getApiBaseUrl = () => `${baseUrl}/api`;
export const getWebSocketUrl = () => `${baseUrl}/ws`;
