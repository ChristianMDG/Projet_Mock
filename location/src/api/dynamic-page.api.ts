import cmsAxios from './cms.axios';

// ─── Shared ──────────────────────────────────────────────────────────────────

export type ContainerMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ─── Page structure ───────────────────────────────────────────────────────────

export interface DynamicPageHeader {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  alertType: 'info' | 'success' | 'warning' | 'error';
  alertTitle?: string;
  alertMessage?: string;
}

export interface CallToAction {
  id: number;
  __component: 'page.call-to-action';
  title: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
  buttonVariant: 'contained' | 'outlined' | 'text';
  buttonColor: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  buttonIcon?: string;
  backgroundColor?: string;
}

// ─── Section-reference (used by the resolver engine) ─────────────────────────

export interface SectionReference {
  id: number;
  __component: 'page.section-reference';
  sectionTitle: string;
  sectionType: string;
}

// ─── Rental Sections ────────────────────────────────────────────────────────────

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  name?: string;
}

export interface RentalCategoryItem {
  id: number;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: { data: StrapiImage };
  imageUrl?: string;
  link?: string;
}

export interface RentalCategoriesSection {
  id: number;
  __component: 'rental.categories-section';
  title: string;
  subtitle?: string;
  categories: RentalCategoryItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface RentalContactSection {
  id: number;
  __component: 'rental.contact-section';
  title: string;
  subtitle?: string;
  assistancePhone?: string;
  servicePhone?: string;
  email?: string;
  address?: string;
  openingHours?: string;
  showContactForm?: boolean;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface RentalFaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface RentalFaqSection {
  id: number;
  __component: 'rental.faq-section';
  title: string;
  subtitle?: string;
  faqs: RentalFaqItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface RentalVehicleItem {
  id: number;
  brand: string;
  model: string;
  category: 'Citadine' | 'Berline' | 'SUV' | 'Utilitaire' | 'Minibus' | '4x4';
  pricePerDay: number;
  seats?: number;
  transmission: 'Manuelle' | 'Automatique';
  fuel: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique';
  image?: { data: StrapiImage };
  imageUrl?: string;
  isFeatured?: boolean;
  order?: number;
}

export interface RentalFeaturedVehicles {
  id: number;
  __component: 'rental.featured-vehicles';
  title: string;
  subtitle?: string;
  vehicles: RentalVehicleItem[];
  showViewAllButton?: boolean;
  viewAllLabel?: string;
  viewAllUrl?: string;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface RentalHeroSection {
  id: number;
  __component: 'rental.hero-section';
  title: string;
  subtitle?: string;
  backgroundImage?: { data: StrapiImage };
  backgroundImageUrl?: string;
  overlayOpacity?: number;
  backgroundColor?: string;
}

export interface RentalStepItem {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

export interface RentalHowItWorks {
  id: number;
  __component: 'rental.how-it-works';
  title: string;
  subtitle?: string;
  steps: RentalStepItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface RentalOfferItem {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  discount?: number;
  image?: { data: StrapiImage };
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  validUntil?: string;
  isLimited?: boolean;
  remaining?: number;
  progress?: number;
  gridSize?: 'small' | 'large';
  order?: number;
}

export interface RentalOffersSection {
  id: number;
  __component: 'rental.offers-section';
  title: string;
  subtitle?: string;
  offers: RentalOfferItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface RentalReassuranceItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  color?: string;
  link?: string;
  linkText?: string;
}

export interface RentalReassuranceSection {
  id: number;
  __component: 'rental.reassurance-section';
  title: string;
  subtitle?: string;
  indicators: RentalReassuranceItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

// ─── Dynamic section union (add rental sections here as they are built) ───────

export type DynamicPageSection =
  | SectionReference
  | RentalHeroSection
  | RentalCategoriesSection
  | RentalHowItWorks
  | RentalFeaturedVehicles
  | RentalOffersSection
  | RentalReassuranceSection
  | RentalFaqSection
  | RentalContactSection;

// ─── Dynamic page models ──────────────────────────────────────────────────────

export interface DynamicPageBase {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  icon?: string;
  locale: string;
}

export interface DynamicPageItem extends DynamicPageBase {
  pageHeader?: DynamicPageHeader;
}

export interface DynamicPage extends DynamicPageBase {
  pageHeader: DynamicPageHeader;
  sections: DynamicPageSection[];
  callToAction?: CallToAction;
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface DynamicPageListResponse {
  data: DynamicPageItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface DynamicPageResponse {
  data: DynamicPage[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleDynamicPageResponse {
  data: DynamicPage;
  meta: StrapiMeta;
}

export interface StrapiPageResponse {
  id: number;
  documentId: string;
  slug: string;
  sections?: DynamicPageSection[];
}

export interface StrapiApiResponse<T = StrapiPageResponse[]> {
  data: T;
  meta: StrapiMeta;
}

export interface SectionResponse {
  data: DynamicPageSection | null;
  meta: StrapiMeta;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const getDynamicPages = async (locale: string = 'fr') => {
  const response = await cmsAxios.get<DynamicPageListResponse>('/dynamic-pages', {
    params: { locale },
  });
  return response.data;
};

export const getDynamicPage = async (id: string, locale: string = 'fr') => {
  const response = await cmsAxios.get<SingleDynamicPageResponse>(`/dynamic-pages/${id}`, {
    params: {
      locale,
    },
  });
  return response.data;
};

export const getDynamicPageBySlug = async (slug: string, locale: string = 'fr') => {
  const response = await cmsAxios.get<SingleDynamicPageResponse>(`/dynamic-pages/${slug}`, {
    params: {
      locale,
    },
  });
  return response.data;
};

export const getSectionByComponent = async (
  component: string,
  locale: string = 'fr',
  slug: string = 'page-template',
) => {
  const response = await cmsAxios.get<SingleDynamicPageResponse>(`/dynamic-pages/${slug}`, {
    params: {
      locale,
      sectionType: component,
    },
  });

  const page = response.data.data;
  const section = page?.sections?.[0] ?? null;

  return {
    data: section,
    meta: response.data.meta,
  };
};
