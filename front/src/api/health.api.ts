import axios from './axios';

const API_URL = '/health';

export interface HealthStatus {
  status: string;
  application?: string;
  profile?: string;
  timestamp?: string;
  message?: string;
  [key: string]: unknown;
}

export interface HealthInfo {
  application?: string;
  version?: string;
  description?: string;
  profile?: string;
  [key: string]: unknown;
}

export const getHealth = async (): Promise<HealthStatus> => {
  const { data } = await axios.get<HealthStatus>(API_URL);
  return data;
};

export const getHealthInfo = async (): Promise<HealthInfo> => {
  const { data } = await axios.get<HealthInfo>(`${API_URL}/info`);
  return data;
};
