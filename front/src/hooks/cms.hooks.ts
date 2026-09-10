import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  getHeroContent,
  getGareBanner,
  getKoperativeBanner,
  getShopBanner,
  getPromotionBanner,
  getCategories,
  getProducts,
  getProductBySlug,
  getSimpleSearch,
  getKoperativePartners,
} from '@/api/cms.api';
import {
  HeroContentResponse,
  GareBannerResponse,
  KoperativeBannerResponse,
  ShopBannerResponse,
  PromotionBannerResponse,
  SimpleSearchResponse,
  ProductFilters,
  KoperativePartner,
} from '@/types/cms.types';
import type { Category, Product } from '@/models/Shop';

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

export function useShopBanner() {
  const { i18n } = useTranslation();
  return useQuery<ShopBannerResponse, Error>({
    queryKey: ['shop-banner', i18n.language],
    queryFn: () => getShopBanner(i18n.language),
    select: selectLocalization<ShopBannerResponse>(i18n.language),
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

export function useCategories() {
  const { i18n } = useTranslation();
  return useQuery<Category[], Error>({
    queryKey: ['categories', i18n.language],
    queryFn: () => getCategories(i18n.language),
  });
}

export function useProducts(filters: ProductFilters = {}) {
  const { i18n } = useTranslation();
  return useQuery<Product[], Error>({
    queryKey: ['products', i18n.language, filters],
    queryFn: () => getProducts(i18n.language, filters),
  });
}

export function useProductBySlug(slug?: string) {
  const { i18n } = useTranslation();
  return useQuery<Product, Error>({
    queryKey: ['product', 'cms', i18n.language, slug],
    queryFn: () => getProductBySlug(slug ?? '', i18n.language),
    enabled: !!slug,
  });
}

export function useSimpleSearch() {
  return useQuery<SimpleSearchResponse, Error>({
    queryKey: ['simple-search'],
    queryFn: getSimpleSearch,
    staleTime: 15 * 60 * 1000,
  });
}

export function useKoperativePartners() {
  const { i18n } = useTranslation();
  return useQuery<KoperativePartner[], Error>({
    queryKey: ['koperative-partners', i18n.language],
    queryFn: () => getKoperativePartners(i18n.language),
  });
}
