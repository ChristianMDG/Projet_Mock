import { SectionType } from '@/constants';
import cmsAxios from './cms.axios';
import { StrapiMedia, PaymentMethod } from '@/types/cms.types';

export type ContainerMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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

export interface MeasureItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface SafetyMeasures {
  id: number;
  __component: 'page.safety-measures';
  title: string;
  measures: MeasureItem[];
}

export interface InsuranceType {
  id: number;
  name: string;
  description: string;
  coverage: string;
  included: boolean;
  price?: string;
}

export interface InsuranceCoverage {
  id: number;
  __component: 'page.insurance-coverage';
  title: string;
  insuranceTypes: InsuranceType[];
}

export interface TipItem {
  id: number;
  icon?: string;
  title: string;
  text: string;
}

export interface SafetyTips {
  id: number;
  __component: 'page.safety-tips';
  title: string;
  tips: TipItem[];
}

export interface ContactItem {
  id: number;
  icon?: string;
  name: string;
  number: string;
  available: string;
}

export interface EmergencyContacts {
  id: number;
  __component: 'page.emergency-contacts';
  title: string;
  alertType?: 'info' | 'success' | 'warning' | 'error';
  alertTitle?: string;
  alertMessage?: string;
  contacts: ContactItem[];
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface FaqSection {
  id: number;
  __component: 'page.faq-section';
  title: string;
  faqs: FaqItem[];
}

export interface TextParagraph {
  id: number;
  text: string;
}

export interface AboutUs {
  id: number;
  __component: 'page.about-us-section';
  title: string;
  paragraphs: TextParagraph[];
}

export interface RouteItem {
  id: number;
  from: string;
  to: string;
  price: number;
  duration: string;
  comfort: 'Standard' | 'Confort' | 'VIP';
}

export interface PopularRoutes {
  id: number;
  __component: 'page.popular-routes';
  title: string;
  routes: RouteItem[];
  disclaimer?: string;
}

export interface PromotionItem {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  discount?: number;
  originalPrice?: number;
  discountedPrice?: number;
  validUntil: string;
  image?: StrapiMedia;
  code: string;
  route: string;
  isLimited?: boolean;
  remaining?: number;
  category: string;
  isVIP?: boolean;
  progress?: number;
  imageUrl?: string;
  gridSize?: 'small' | 'large';
  order?: number;
}

export interface CurrentPromotions {
  id: number;
  __component: 'page.current-promotions';
  title: string;
  promotions: PromotionItem[];
}

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  image?: StrapiMedia;
  category: string;
  link?: string;
  buttonText?: string;
}

export interface NewsSection {
  id: number;
  __component: 'page.news-section';
  title: string;
  subtitle?: string;
  newsItems: NewsItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface PromotionalContent {
  id: number;
  __component: 'page.promotional-content';
  title: string;
  promotions: PromotionItem[];
  callToAction?: CallToAction;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface HelpArticle {
  id: number;
  title: string;
  content: string;
  url?: string;
}

export interface HelpCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  articles: HelpArticle[];
}

export interface HelpCenterSection {
  id: number;
  __component: 'page.help-center-section';
  title: string;
  categories: HelpCategory[];
}

export interface FeatureItem {
  id: number;
  text: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  price: string;
  features: FeatureItem[];
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export interface ServiceTypes {
  id: number;
  __component: 'page.service-types';
  title: string;
  services: ServiceItem[];
}

export interface ContactMethod {
  id: number;
  label: string;
  value: string;
  type: 'email' | 'phone' | 'address' | 'hours' | 'other';
}

export interface Contact {
  id: number;
  __component: 'page.contact-section';
  title: string;
  description?: string;
  contactMethods: ContactMethod[];
}

export interface LegalSection {
  id: number;
  title: string;
  content: string;
}

export interface LegalContent {
  id: number;
  __component: 'page.legal-content';
  title: string;
  subtitle?: string;
  sections: LegalSection[];
}

export interface AttractionItem {
  id: number;
  name: string;
}

export interface DestinationItem {
  id: number;
  city: string;
  region: string;
  description: string;
  image?: StrapiMedia;
  duration: string;
  attractions: AttractionItem[];
  category: 'Coastal' | 'Nature' | 'Cultural' | 'Thermal' | 'Urban' | 'Adventure';
  popularity: number;
  frequency: string;
}

export interface DestinationsGrid {
  id: number;
  __component: 'page.destinations-grid';
  title: string;
  subtitle?: string;
  destinations: DestinationItem[];
}

export interface TestimonialItem {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar?: StrapiMedia;
  avatarUrl?: string;
}

export interface OverallRating {
  id: number;
  title: string;
  averageRating: number;
  totalReviews: number;
  recommendation: number;
}

export interface Testimonials {
  id: number;
  __component: 'page.customer-testimonials';
  title: string;
  subtitle?: string;
  testimonials: TestimonialItem[];
  overallRating?: OverallRating;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface FeatureItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface StatisticItem {
  id: number;
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface WhyChooseUs {
  id: number;
  __component: 'page.why-choose-us';
  title: string;
  subtitle?: string;
  features: FeatureItem[];
  statistics: StatisticItem[];
  showStatistics?: boolean;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface StatisticsSection {
  id: number;
  __component: 'page.statistics-section';
  title: string;
  statistics: StatisticItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface MissionSection {
  id: number;
  __component: 'page.mission-section';
  title: string;
  tagline: string;
  description: string;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface ValueItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface ValuesSection {
  id: number;
  __component: 'page.values-section';
  title: string;
  values: ValueItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface CityItem {
  name: string;
  region?: string;
  code?: string;
  isActive?: boolean;
}

export interface RegionItem {
  id: number;
  name: string;
  province?: string;
  cities: CityItem[];
}

export interface NetworkSection {
  id: number;
  __component: 'page.network-section';
  title: string;
  description?: string;
  regions: RegionItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface PopularDestinationItem {
  id: number;
  route: string;
  region: string;
  description: string;
  image?: StrapiMedia;
  duration: string;
  price: string;
  frequency: string;
  attractions: AttractionItem[];
  category: 'Coastal' | 'Nature' | 'Cultural' | 'Thermal' | 'Urban' | 'Adventure';
  popularity: number;
}

export interface PopularDestinations {
  id: number;
  __component: 'page.popular-destinations';
  title: string;
  subtitle?: string;
  destinations: PopularDestinationItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface SectionReference {
  id: number;
  __component: 'page.section-reference';
  sectionTitle: string;
  sectionType: SectionType;
}

export interface PaymentSection {
  id: number;
  __component: 'page.payment-section';
  title: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor?: string;
  paymentMethods: PaymentMethod[];
}

export interface BookingRuleItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface BookingRules {
  id: number;
  __component: 'page.booking-rules';
  title: string;
  rules: BookingRuleItem[];
}

export interface AdditionalInfoItem {
  id: number;
  icon: string;
  label: string;
  text: string;
}

export interface AdditionalInfo {
  id: number;
  __component: 'page.additional-info';
  title: string;
  alertType: 'info' | 'success' | 'warning' | 'error';
  alertMessage: string;
  items: AdditionalInfoItem[];
}

// Service Categories
export interface ServiceCategoryItem {
  id: number;
  text: string;
}

export interface ServiceCategory {
  id: number;
  title: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  services: ServiceCategoryItem[];
}

export interface ServiceCategories {
  id: number;
  __component: 'page.service-categories';
  title?: string;
  categories: ServiceCategory[];
}

// Loyalty Program
export interface LoyaltyBenefit {
  id: number;
  text: string;
}

export interface LoyaltyLevel {
  id: number;
  name: string;
  trips: string;
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  highlighted: boolean;
  benefits: LoyaltyBenefit[];
}

export interface LoyaltyProgram {
  id: number;
  __component: 'page.loyalty-program';
  title: string;
  programName: string;
  description?: string;
  levels: LoyaltyLevel[];
}

// Additional Services
export interface AdditionalServiceItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface AdditionalServices {
  id: number;
  __component: 'page.additional-services';
  title: string;
  services: AdditionalServiceItem[];
}

// Accident Instructions
export interface AccidentInstructionItem {
  id: number;
  step: number;
  icon: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  details?: string;
}

export interface AccidentInstructions {
  id: number;
  __component: 'page.accident-instructions';
  title: string;
  subtitle?: string;
  emergencyNumber: string;
  instructions: AccidentInstructionItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

// Travel Destinations
export interface TravelDestinationItem {
  id: number;
  city: string;
  country: string;
  image: StrapiMedia;
  description?: string;
  link?: string;
  gridSize: 'small' | 'medium' | 'large';
  order: number;
}

export interface TravelDestinations {
  id: number;
  __component: 'page.travel-destinations';
  title: string;
  subtitle?: string;
  destinations: TravelDestinationItem[];
  buttonText?: string;
  buttonUrl?: string;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

// Benefits Showcase
export interface BenefitItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  highlighted: boolean;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

export interface BenefitsShowcase {
  id: number;
  __component: 'page.benefits-showcase';
  title: string;
  subtitle?: string;
  benefits: BenefitItem[];
  layout: 'grid' | 'carousel' | 'list';
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

// Trust Indicators
export interface TrustIndicatorItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

export interface TrustIndicators {
  id: number;
  __component: 'page.trust-indicators';
  title: string;
  subtitle?: string;
  indicators: TrustIndicatorItem[];
  layout: 'horizontal' | 'vertical' | 'grid';
  showBorder: boolean;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export type DynamicPageSection =
  | SafetyMeasures
  | InsuranceCoverage
  | SafetyTips
  | EmergencyContacts
  | AccidentInstructions
  | TravelDestinations
  | BenefitsShowcase
  | TrustIndicators
  | FaqSection
  | AboutUs
  | PopularRoutes
  | CurrentPromotions
  | NewsSection
  | PromotionalContent
  | HelpCenterSection
  | ServiceTypes
  | Contact
  | LegalContent
  | DestinationsGrid
  | Testimonials
  | WhyChooseUs
  | PopularDestinations
  | StatisticsSection
  | MissionSection
  | ValuesSection
  | NetworkSection
  | SectionReference
  | PaymentSection
  | BookingRules
  | AdditionalInfo
  | ServiceCategories
  | LoyaltyProgram
  | AdditionalServices
  | SimpleSearch
  | KoperativeTypesList;

export interface KoperativeTypesList {
  id: number;
  __component: 'page.koperative-types-list';
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

export interface SimpleSearch {
  id: number;
  __component: 'page.simple-search';
  title?: string;
  subtitle?: string;
  description?: string;
  image?: StrapiMedia;
}

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
  featuredImage?: StrapiMedia;
}

export interface DynamicPage extends DynamicPageBase {
  pageHeader: DynamicPageHeader;
  sections: DynamicPageSection[];
  callToAction?: CallToAction;
  featuredImage?: StrapiMedia;
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

// Let the middleware handle population
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

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
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
