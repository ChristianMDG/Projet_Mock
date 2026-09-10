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
  KoperativePartner,
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

const mapStrapiProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description ?? '',
  shortDescription: p.shortDescription ?? '',
  price: Number(p.price ?? 0),
  originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
  discountPercentage: p.discountPercentage !== undefined ? Number(p.discountPercentage) : undefined,
  currency: p.currency ?? 'MGA',
  images: p.images ?? [],
  category: p.category
    ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
        description: p.category.description,
        icon: p.category.icon,
        displayOrder: p.category.displayOrder,
        isActive: p.category.isActive,
        category: p.category.category
          ? {
              id: p.category.category.id,
              name: p.category.category.name,
              slug: p.category.category.slug,
              description: p.category.category.description,
              icon: p.category.category.icon,
            }
          : undefined,
      }
    : ({} as any),
  inStock: p.inStock ?? true,
  stockQuantity: p.stockQuantity ?? 0,
  rating: Number(p.rating ?? 4.5),
  reviewCount: Number(p.reviewCount ?? 0),
  tags: Array.isArray(p.tags) ? p.tags : [],
  specifications: Array.isArray(p.specifications) ? p.specifications : [],
  seller: p.seller
    ? {
        id: p.seller.id,
        name: p.seller.name,
        location: p.seller.location ?? '',
        rating: Number(p.seller.rating ?? 4.9),
        productCount: Number(p.seller.productCount ?? 0),
      }
    : undefined,
  isFeatured: Boolean(p.isFeatured),
  isNew: Boolean(p.isNew),
  isBestSeller: Boolean(p.isBestSeller),
  sku: p.sku,
  weight: p.weight ? Number(p.weight) : undefined,
  dimensions: p.dimensions,
  origin: p.origin,
});

export const getProducts = async (locale: string = 'fr', filters: ProductFilters = {}): Promise<Product[]> => {
  try {
    const params: Record<string, any> = {
      locale,
      'pagination[pageSize]': 100,
      'populate[0]': 'images',
      'populate[1]': 'category.category',
      'populate[2]': 'seller',
      'filters[price][$gt]': 0,
    };

    if (filters) {
      if (filters.subcategorySlugs && filters.subcategorySlugs.length > 0) {
        if (filters.subcategorySlugs.length === 1) {
          params['filters[category][slug][$eq]'] = filters.subcategorySlugs[0];
        } else {
          filters.subcategorySlugs.forEach((slug, idx) => {
            params[`filters[category][slug][$in][${idx}]`] = slug;
          });
        }
      } else if (filters.categorySlugs && filters.categorySlugs.length > 0) {
        if (filters.categorySlugs.length === 1) {
          const slug = filters.categorySlugs[0];
          params['filters[$or][0][category][slug][$eq]'] = slug;
          params['filters[$or][1][category][category][slug][$eq]'] = slug;
        } else {
          filters.categorySlugs.forEach((slug, idx) => {
            params[`filters[$or][0][category][slug][$in][${idx}]`] = slug;
            params[`filters[$or][1][category][category][slug][$in][${idx}]`] = slug;
          });
        }
      }

      if (typeof filters.priceMin === 'number') {
        params['filters[price][$gte]'] = filters.priceMin;
      }
      if (typeof filters.priceMax === 'number') {
        params['filters[price][$lte]'] = filters.priceMax;
      }

      if (filters.sort) {
        switch (filters.sort) {
          case 'price-asc':
            params['sort[0]'] = 'price:asc';
            break;
          case 'price-desc':
            params['sort[0]'] = 'price:desc';
            break;
          case 'newest':
            params['sort[0]'] = 'createdAt:desc';
            break;
          case 'rating':
            params['sort[0]'] = 'rating:desc';
            break;
          case 'best-seller':
            params['sort[0]'] = 'isBestSeller:desc';
            break;
          default:
            break;
        }
      }
    }

    const { data } = await cmsAxios.get<{ data: any[] }>('/products', { params });
    if (data?.data && Array.isArray(data.data)) {
      return data.data.map(mapStrapiProduct);
    }
  } catch {
    // Fallback to backend search if CMS is unreachable
  }

  const backendParams: Record<string, any> = {};
  if (filters) {
    if (filters.subcategorySlugs && filters.subcategorySlugs.length > 0) {
      backendParams.categorySlug = filters.subcategorySlugs[0];
    } else if (filters.categorySlugs && filters.categorySlugs.length > 0) {
      backendParams.categorySlug = filters.categorySlugs[0];
    }
    if (typeof filters.priceMin === 'number') {
      backendParams.minPrice = filters.priceMin;
    }
    if (typeof filters.priceMax === 'number') {
      backendParams.maxPrice = filters.priceMax;
    }
    if (filters.sort) {
      backendParams.sort = filters.sort;
    }
  }

  const { data } = await axios.get<{ content: Product[] }>('/products/search', {
    params: {
      ...backendParams,
      size: 100,
    },
  });
  return data.content;
};

export const getProductBySlug = async (slug: string, locale: string = 'fr'): Promise<Product> => {
  try {
    const { data } = await cmsAxios.get<{ data: any[] }>('/products', {
      params: {
        locale,
        'filters[slug][$eq]': slug,
        'populate[0]': 'images',
        'populate[1]': 'category.category',
        'populate[2]': 'seller',
      },
    });

    const p = data?.data?.[0];
    if (p) {
      return mapStrapiProduct(p);
    }
  } catch {
    // Fallback to backend slug endpoint
  }

  const { data } = await axios.get<Product>(`/products/slug/${slug}`);
  return data;
};

export const getKoperativePartners = async (locale: string = 'fr'): Promise<KoperativePartner[]> => {
  try {
    const { data } = await cmsAxios.get<{ data: KoperativePartner[] }>('/koperative-partners', {
      params: {
        locale,
        populate: '*',
        'filters[isActive][$eq]': true,
      },
    });
    const hasData = Boolean(data?.data && Array.isArray(data.data));
    if (hasData) {
      return data.data;
    }
  } catch (err) {
    console.error('Error fetching koperative partners from CMS:', err);
  }
  return [];
};
