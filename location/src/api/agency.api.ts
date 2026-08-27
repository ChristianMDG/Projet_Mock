import axiosInstance from './axios';
import { Agency, AgencyResponse, SingleAgencyResponse } from '@/types/cms.types';

export const getAgencies = async (): Promise<Agency[]> => {
  const { data } = await axiosInstance.get<AgencyResponse>('/api/agencies');
  return data.data;
};

export const getAgencyById = async (id: Agency['id']): Promise<Agency> => {
  const { data } = await axiosInstance.get<SingleAgencyResponse>(`/api/agencies/${id}`);
  return data.data;
};
