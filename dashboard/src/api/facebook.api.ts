import api from './axios';
import { VoyageDescriptionDto, FacebookScheduleRequest } from '@/types/facebook.types';

const BASE_PATH = '/facebook';

export const getVoyageDescriptions = async (
  departureDate: string,
  gareId: number,
  departureVille: string
): Promise<VoyageDescriptionDto[]> => {
  const response = await api.get<VoyageDescriptionDto[]>(`${BASE_PATH}/voyage-descriptions`, {
    params: {
      departureDate,
      gareId,
      departureVille,
    },
  });
  return response.data;
};

export const scheduleFacebookPost = async (request: FacebookScheduleRequest): Promise<void> => {
  const formData = new FormData();
  formData.append('voyageIds', request.voyageIds);
  formData.append('description', request.description);
  formData.append('scheduledTime', request.scheduledTime);
  if (request.hashtags) {
    formData.append('hashtags', request.hashtags);
  }
  if (request.image) {
    formData.append('image', request.image);
  }

  await api.post(`${BASE_PATH}/schedule`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
