// CMS Types for Strapi v5

export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    large?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    small?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
}

export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: string;
  size: number;
  width: number;
  height: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiLocalizedResponse<T> extends StrapiResponse<T> {
  meta: StrapiResponse<T>['meta'] & {
    availableLocales: string[];
  };
}

// Hero Content Types
export interface HeroContentAttributes {
  Title: string;
  SubTitle: string;
  Description?: any; // Strapi blocks field
  Destination?: string;
  Image: StrapiMedia;
  locale: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroContent extends HeroContentAttributes {
  id: number;
  documentId: string;
  localizations?: Array<Partial<HeroContentAttributes> & { id: number; documentId: string; locale: string }>;
}

export interface HeroContentResponse extends StrapiLocalizedResponse<HeroContent> {}

// Simple Search Types
export interface SimpleSearchContent {
  id: number;
  documentId: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: StrapiMedia;
}

export interface SimpleSearchResponse extends StrapiResponse<SimpleSearchContent> {}
export interface PaymentMethodAttributes {
  name: string;
  description: string;
  logo: StrapiMedia;
  identifier: string;
  isActive: boolean;
  sortOrder: number;
  locale: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod extends PaymentMethodAttributes {
  id: number;
  documentId: string;
}

// Gare Banner Types
export interface GareBannerAttributes {
  Title: string;
  SubTitle: string;
  Description?: string;
  Localisation?: string;
  Image: StrapiMedia;
  locale: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GareBanner extends GareBannerAttributes {
  id: number;
  documentId: string;
  localizations?: Array<Partial<GareBannerAttributes> & { id: number; documentId: string; locale: string }>;
}

export interface GareBannerResponse extends StrapiLocalizedResponse<GareBanner> {}

// Koperative Banner Types
export interface KoperativeBannerAttributes {
  Title: string;
  SubTitle: string;
  Description?: string;
  Localisation?: string;
  Image: StrapiMedia;
  locale: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface KoperativeBanner extends KoperativeBannerAttributes {
  id: number;
  documentId: string;
  localizations?: Array<Partial<KoperativeBannerAttributes> & { id: number; documentId: string; locale: string }>;
}

export interface KoperativeBannerResponse extends StrapiLocalizedResponse<KoperativeBanner> {}

// Shop Banner Types
export interface ShopBannerAttributes {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: StrapiMedia;
  isActive: boolean;
  locale: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopBanner extends ShopBannerAttributes {
  id: number;
  documentId: string;
  localizations?: Array<Partial<ShopBannerAttributes> & { id: number; documentId: string; locale: string }>;
}

export interface ShopBannerResponse extends StrapiLocalizedResponse<ShopBanner> {}

// Promotion Banner Types
export interface PromotionBannerAttributes {
  Title: string;
  SubTitle: string;
  Image?: StrapiMedia;
  Active: boolean;
  locale: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionBanner extends PromotionBannerAttributes {
  id: number;
  documentId: string;
  localizations?: Array<Partial<PromotionBannerAttributes> & { id: number; documentId: string; locale: string }>;
}

export interface PromotionBannerResponse extends StrapiLocalizedResponse<PromotionBanner> {}

// VilleDetail Types
export interface VilleDetailAttributes {
  Superficie?: number;
  Population?: number;
  Regions?: string;
  ImageGalery?: StrapiMedia[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VilleDetail extends VilleDetailAttributes {
  id: number;
  documentId: string;
}

export interface VilleDetailResponse extends StrapiResponse<VilleDetail[]> {}

export interface SingleVilleDetailResponse extends StrapiResponse<VilleDetail> {}

export interface ProductFilters {
  categorySlugs?: string[];
  subcategorySlugs?: string[];
  types?: string[];
  sizes?: string[];
  priceMin?: number;
  priceMax?: number;
}
