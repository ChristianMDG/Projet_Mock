import api from './axios';

export const getBatchStatus = async (): Promise<{ enabled: boolean }> => {
  const response = await api.get('/batch/auto-reservation/status');
  return response.data;
};

export const pauseBatch = async (): Promise<{ success: boolean; message: string; enabled: boolean }> => {
  const response = await api.post('/batch/auto-reservation/pause');
  return response.data;
};

export const playBatch = async (): Promise<{ success: boolean; message: string; enabled: boolean }> => {
  const response = await api.post('/batch/auto-reservation/play');
  return response.data;
};

export const runBatchNow = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/batch/auto-reservation/run-now');
  return response.data;
};
