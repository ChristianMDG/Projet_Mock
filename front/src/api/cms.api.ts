import cmsAxios from './cms.axios';
import {
  HeroContentResponse,
  GareBannerResponse,
  KoperativeBannerResponse,
  PromotionBannerResponse,
  VilleDetailResponse,
  SingleVilleDetailResponse,
} from '@/types/cms.types';

export const getHeroContent = async (locale: string = 'en') => {
  const { data } = await cmsAxios.get<HeroContentResponse>('/hero-content', {
    params: {
      locale,
      populate: '*',
    },
  });
  return data;
};

export const getGareBanner = async (locale: string = 'en') => {
  const { data } = await cmsAxios.get<GareBannerResponse>('/gare-banner', {
    params: {
      locale,
      populate: '*',
    },
  });
  return data;
};

export const getKoperativeBanner = async (locale: string = 'en') => {
  const { data } = await cmsAxios.get<KoperativeBannerResponse>('/koperative-banner', {
    params: {
      locale,
      populate: '*',
    },
  });
  return data;
};

export const getPromotionBanner = async (locale: string = 'en') => {
  const { data } = await cmsAxios.get<PromotionBannerResponse>('/promotion-banner', {
    params: {
      locale,
      populate: '*',
    },
  });
  return data;
};

export const getVilleDetails = async () => {
  const { data } = await cmsAxios.get<VilleDetailResponse>('/ville-details', {
    params: {
      populate: 'ImageGalery',
    },
  });
  return data;
};

export const getVilleDetailById = async (id: number) => {
  const { data } = await cmsAxios.get<SingleVilleDetailResponse>(`/ville-details/${id}`, {
    params: {
      populate: 'ImageGalery',
    },
  });
  return data;
};

export const getVilleDetailByVilleId = async (villeId: number) => {
  const { data } = await cmsAxios.get<VilleDetailResponse>('/ville-details', {
    params: {
      'filters[Ville][id][$eq]': villeId,
      populate: 'ImageGalery',
    },
  });
  return data;
};
