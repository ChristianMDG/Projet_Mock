import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getGuideSteps, getAboutValues } from '../api/rental-content.api';

export const useGuideSteps = () => {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ['guideSteps', i18n.language],
    queryFn: () => getGuideSteps(i18n.language),
  });
};

export const useAboutValues = () => {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ['aboutValues', i18n.language],
    queryFn: () => getAboutValues(i18n.language),
  });
};
