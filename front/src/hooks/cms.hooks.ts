import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getHeroContent, getGareBanner, getKoperativeBanner, getPromotionBanner } from '@/api/cms.api';
import {
  HeroContentResponse,
  GareBannerResponse,
  KoperativeBannerResponse,
  PromotionBannerResponse,
} from '@/types/cms.types';

function selectLocalization<T extends { data: { locale: string; localizations?: Array<{ locale: string }> } }>(
  locale: string,
) {
  return (response: T): T => {
    const content = response.data;
    if (content.locale === locale) return response;
    const translation = content.localizations?.find(loc => loc.locale === locale);
    return translation ? ({ ...response, data: { ...content, ...translation } } as T) : response;
  };
}

export function useHeroContent() {
  const { i18n } = useTranslation();
  return useQuery<HeroContentResponse, Error>({
    queryKey: ['hero-content', i18n.language],
    queryFn: () => getHeroContent(i18n.language),
    select: selectLocalization<HeroContentResponse>(i18n.language),
  });
}

export function useGareBanner() {
  const { i18n } = useTranslation();
  return useQuery<GareBannerResponse, Error>({
    queryKey: ['gare-banner', i18n.language],
    queryFn: () => getGareBanner(i18n.language),
    select: selectLocalization<GareBannerResponse>(i18n.language),
  });
}

export function useKoperativeBanner() {
  const { i18n } = useTranslation();
  return useQuery<KoperativeBannerResponse, Error>({
    queryKey: ['koperative-banner', i18n.language],
    queryFn: () => getKoperativeBanner(i18n.language),
    select: selectLocalization<KoperativeBannerResponse>(i18n.language),
  });
}

export function usePromotionBanner() {
  const { i18n } = useTranslation();
  return useQuery<PromotionBannerResponse, Error>({
    queryKey: ['promotion-banner', i18n.language],
    queryFn: () => getPromotionBanner(i18n.language),
    select: selectLocalization<PromotionBannerResponse>(i18n.language),
  });
}
