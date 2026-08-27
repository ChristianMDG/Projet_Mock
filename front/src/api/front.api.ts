import axios from './axios';

const API_URL = '/v3rs10n';

export interface AppVersion {
  version: string;
  status: string;
  cacheCleared: string;
  timestamp: string;
}

export const getAppVersion = async (): Promise<AppVersion> => {
  const { data } = await axios.get<AppVersion>(API_URL);
  return data;
};
