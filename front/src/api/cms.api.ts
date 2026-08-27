import cmsAxios from './cms.axios';
import axios from './axios';
import {
  HeroContentResponse,
  GareBannerResponse,
  KoperativeBannerResponse,
  ShopBannerResponse,
  PromotionBannerResponse,
  SimpleSearchResponse,
  VilleDetailResponse,
  SingleVilleDetailResponse,
  ProductFilters,
} from '@/types/cms.types';
import type { Category, Product } from '@/models/Shop';

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

export const getShopBanner = async (locale: string = 'fr') => {
  const { data } = await cmsAxios.get<ShopBannerResponse>('/shop-banner', {
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

export const getSimpleSearch = async () => {
  const { data } = await cmsAxios.get<SimpleSearchResponse>('/simple-search', {
    params: { populate: '*' },
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

export const getCategories = async (locale: string = 'fr'): Promise<Category[]> => {
  try {
    const { data } = await cmsAxios.get<{ data: any[] }>('/categories', {
      params: {
        locale,
        populate: {
          image: true,
          subcategories: {
            populate: {
              image: true,
            },
          },
        },
        sort: 'displayOrder:asc',
      },
    });
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
        subcategories: (cat.subcategories ?? []).map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          icon: sub.icon,
          image: sub.image,
          displayOrder: sub.displayOrder,
          isActive: sub.isActive,
        })),
      }));
    }
  } catch {
    // Fallback to backend tree
  }

  const { data } = await axios.get<Category[]>('/categories/tree');
  return data;
};

export const getProducts = async (_locale: string = 'fr', filters: ProductFilters = {}): Promise<Product[]> => {
  const params: Record<string, any> = {};

  if (filters) {
    if (filters.subcategorySlugs && filters.subcategorySlugs.length > 0) {
      params.categorySlug = filters.subcategorySlugs[0];
    } else if (filters.categorySlugs && filters.categorySlugs.length > 0) {
      params.categorySlug = filters.categorySlugs[0];
    }
    if (typeof filters.priceMin === 'number') {
      params.minPrice = filters.priceMin;
    }
    if (typeof filters.priceMax === 'number') {
      params.maxPrice = filters.priceMax;
    }
  }

  const { data } = await axios.get<{ content: Product[] }>('/products/search', {
    params: {
      ...params,
      size: 100,
    },
  });
  return data.content;
};

export const getProductBySlug = async (slug: string, _locale: string = 'fr'): Promise<Product> => {
  const { data } = await axios.get<Product>(`/products/slug/${slug}`);
  return data;
};
