import cmsAxiosInstance from './cms.axios';
import { GuideStep, GuideStepResponse, AboutValue, AboutValueResponse } from '@/types/cms.types';

export const getGuideSteps = async (locale: string): Promise<GuideStep[]> => {
  const { data } = await cmsAxiosInstance.get<GuideStepResponse>('/api/guide-steps', {
    params: {
      locale,
      sort: ['order:asc'],
    },
  });
  return data.data || [];
};

export const getAboutValues = async (locale: string): Promise<AboutValue[]> => {
  const { data } = await cmsAxiosInstance.get<AboutValueResponse>('/api/about-values', {
    params: {
      locale,
      sort: ['order:asc'],
    },
  });
  return data.data || [];
};
