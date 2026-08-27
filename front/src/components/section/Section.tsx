import React from 'react';
import { type SxProps, type Theme } from '@mui/material';
import type { DynamicPageSection } from '@/api/dynamic-page.api';
import { useSectionByComponent } from '@/hooks/dynamic-page.hooks';
import MissingContent from '@/components/shared/MissingContent';
import { SECTION_TYPES } from '@/constants/section.types';
import SafetyMeasures from './SafetyMeasures';
import InsuranceCoverage from './InsuranceCoverage';
import SafetyTips from './SafetyTips';
import EmergencyContacts from './EmergencyContacts';
import AccidentInstructions from './AccidentInstructions';
import TravelDestinations from './TravelDestinations';
import BenefitsShowcase from './BenefitsShowcase';
import TrustIndicators from './TrustIndicators';
import FaqSection from './FaqSection';
import AboutUs from './AboutUs';
import PopularRoutes from './PopularRoutes';
import CurrentPromotions from './CurrentPromotions';
import NewsSection from './NewsSection';
import PromotionalContent from './PromotionalContent';
import HelpCenterSection from './HelpCenterSection';
import ServiceTypes from './ServiceTypes';
import Contact from './Contact';
import LegalContent from './LegalContent';
import DestinationsGrid from './DestinationsGrid';
import Testimonials from './Testimonials';
import WhyChooseUs from './WhyChooseUs';
import PopularDestinations from './PopularDestinations';
import StatisticsSection from './StatisticsSection';
import MissionSection from './MissionSection';
import ValuesSection from './ValuesSection';
import NetworkSection from './NetworkSection';
import PaymentSection from './PaymentSection';
import BookingRules from './BookingRules';
import AdditionalInfo from './AdditionalInfo';
import ServiceCategories from './ServiceCategories';
import LoyaltyProgram from './LoyaltyProgram';
import AdditionalServices from './AdditionalServices';
import SimpleSearch from './SimpleSearch';
import KoperativeTypesList from './KoperativeTypesList';
import {
  SafetyMeasuresSkeleton,
  InsuranceCoverageSkeleton,
  SafetyTipsSkeleton,
  EmergencyContactsSkeleton,
  AccidentInstructionsSkeleton,
  TravelDestinationsSkeleton,
  BenefitsShowcaseSkeleton,
  TrustIndicatorsSkeleton,
  FaqSectionSkeleton,
  AboutUsSkeleton,
  PopularRoutesSkeleton,
  CurrentPromotionsSkeleton,
  NewsSectionSkeleton,
  PromotionalContentSkeleton,
  HelpCenterSectionSkeleton,
  ServiceTypesSkeleton,
  ContactSkeleton,
  LegalContentSkeleton,
  DestinationsGridSkeleton,
  TestimonialsSkeleton,
  WhyChooseUsSkeleton,
  PopularDestinationsSkeleton,
  StatisticsSectionSkeleton,
  MissionSectionSkeleton,
  ValuesSectionSkeleton,
  NetworkSectionSkeleton,
  DynamicPageCardSkeleton,
  PaymentSectionSkeleton,
  BookingRulesSkeleton,
  AdditionalInfoSkeleton,
  ServiceCategoriesSkeleton,
  LoyaltyProgramSkeleton,
  AdditionalServicesSkeleton,
  SimpleSearchSkeleton,
  KoperativeTypesListSkeleton,
} from './skeleton';

interface SectionProps {
  section: DynamicPageSection;
  sx?: SxProps<Theme>;
  hide?: boolean;
}

type SectionComponent = React.ComponentType<{
  section: DynamicPageSection;
  sx?: SxProps<Theme>;
  hide?: boolean;
}>;
type SkeletonComponent = React.ComponentType;

const SECTION_COMPONENTS: Record<string, SectionComponent> = {
  [SECTION_TYPES.SAFETY_MEASURES]: SafetyMeasures as SectionComponent,
  [SECTION_TYPES.INSURANCE_COVERAGE]: InsuranceCoverage as SectionComponent,
  [SECTION_TYPES.SAFETY_TIPS]: SafetyTips as SectionComponent,
  [SECTION_TYPES.EMERGENCY_CONTACTS]: EmergencyContacts as SectionComponent,
  [SECTION_TYPES.ACCIDENT_INSTRUCTIONS]: AccidentInstructions as SectionComponent,
  [SECTION_TYPES.TRAVEL_DESTINATIONS]: TravelDestinations as SectionComponent,
  [SECTION_TYPES.BENEFITS_SHOWCASE]: BenefitsShowcase as SectionComponent,
  [SECTION_TYPES.TRUST_INDICATORS]: TrustIndicators as SectionComponent,
  [SECTION_TYPES.FAQ_SECTION]: FaqSection as SectionComponent,
  [SECTION_TYPES.ABOUT_US_SECTION]: AboutUs as SectionComponent,
  [SECTION_TYPES.POPULAR_ROUTES]: PopularRoutes as SectionComponent,
  [SECTION_TYPES.CURRENT_PROMOTIONS]: CurrentPromotions as SectionComponent,
  [SECTION_TYPES.NEWS_SECTION]: NewsSection as SectionComponent,
  [SECTION_TYPES.PROMOTIONAL_CONTENT]: PromotionalContent as SectionComponent,
  [SECTION_TYPES.HELP_CENTER_SECTION]: HelpCenterSection as SectionComponent,
  [SECTION_TYPES.SERVICE_TYPES]: ServiceTypes as SectionComponent,
  [SECTION_TYPES.CONTACT_SECTION]: Contact as SectionComponent,
  [SECTION_TYPES.LEGAL_CONTENT]: LegalContent as SectionComponent,
  [SECTION_TYPES.DESTINATIONS_GRID]: DestinationsGrid as SectionComponent,
  [SECTION_TYPES.CUSTOMER_TESTIMONIALS]: Testimonials as SectionComponent,
  [SECTION_TYPES.WHY_CHOOSE_US]: WhyChooseUs as SectionComponent,
  [SECTION_TYPES.POPULAR_DESTINATIONS]: PopularDestinations as SectionComponent,
  [SECTION_TYPES.STATISTICS_SECTION]: StatisticsSection as SectionComponent,
  [SECTION_TYPES.MISSION_SECTION]: MissionSection as SectionComponent,
  [SECTION_TYPES.VALUES_SECTION]: ValuesSection as SectionComponent,
  [SECTION_TYPES.NETWORK_SECTION]: NetworkSection as SectionComponent,
  [SECTION_TYPES.PAYMENT_SECTION]: PaymentSection as SectionComponent,
  [SECTION_TYPES.BOOKING_RULES]: BookingRules as SectionComponent,
  [SECTION_TYPES.ADDITIONAL_INFO]: AdditionalInfo as SectionComponent,
  [SECTION_TYPES.SERVICE_CATEGORIES]: ServiceCategories as SectionComponent,
  [SECTION_TYPES.LOYALTY_PROGRAM]: LoyaltyProgram as SectionComponent,
  [SECTION_TYPES.ADDITIONAL_SERVICES]: AdditionalServices as SectionComponent,
  [SECTION_TYPES.SIMPLE_SEARCH]: SimpleSearch as SectionComponent,
  [SECTION_TYPES.KOPERATIVE_TYPES_LIST]: KoperativeTypesList as SectionComponent,
};

const SECTION_SKELETONS: Record<string, SkeletonComponent> = {
  [SECTION_TYPES.SAFETY_MEASURES]: SafetyMeasuresSkeleton,
  [SECTION_TYPES.INSURANCE_COVERAGE]: InsuranceCoverageSkeleton,
  [SECTION_TYPES.SAFETY_TIPS]: SafetyTipsSkeleton,
  [SECTION_TYPES.EMERGENCY_CONTACTS]: EmergencyContactsSkeleton,
  [SECTION_TYPES.ACCIDENT_INSTRUCTIONS]: AccidentInstructionsSkeleton,
  [SECTION_TYPES.TRAVEL_DESTINATIONS]: TravelDestinationsSkeleton,
  [SECTION_TYPES.BENEFITS_SHOWCASE]: BenefitsShowcaseSkeleton,
  [SECTION_TYPES.TRUST_INDICATORS]: TrustIndicatorsSkeleton,
  [SECTION_TYPES.FAQ_SECTION]: FaqSectionSkeleton,
  [SECTION_TYPES.ABOUT_US_SECTION]: AboutUsSkeleton,
  [SECTION_TYPES.POPULAR_ROUTES]: PopularRoutesSkeleton,
  [SECTION_TYPES.CURRENT_PROMOTIONS]: CurrentPromotionsSkeleton,
  [SECTION_TYPES.NEWS_SECTION]: NewsSectionSkeleton,
  [SECTION_TYPES.PROMOTIONAL_CONTENT]: PromotionalContentSkeleton,
  [SECTION_TYPES.HELP_CENTER_SECTION]: HelpCenterSectionSkeleton,
  [SECTION_TYPES.SERVICE_TYPES]: ServiceTypesSkeleton,
  [SECTION_TYPES.CONTACT_SECTION]: ContactSkeleton,
  [SECTION_TYPES.LEGAL_CONTENT]: LegalContentSkeleton,
  [SECTION_TYPES.DESTINATIONS_GRID]: DestinationsGridSkeleton,
  [SECTION_TYPES.CUSTOMER_TESTIMONIALS]: TestimonialsSkeleton,
  [SECTION_TYPES.WHY_CHOOSE_US]: WhyChooseUsSkeleton,
  [SECTION_TYPES.POPULAR_DESTINATIONS]: PopularDestinationsSkeleton,
  [SECTION_TYPES.STATISTICS_SECTION]: StatisticsSectionSkeleton,
  [SECTION_TYPES.MISSION_SECTION]: MissionSectionSkeleton,
  [SECTION_TYPES.VALUES_SECTION]: ValuesSectionSkeleton,
  [SECTION_TYPES.NETWORK_SECTION]: NetworkSectionSkeleton,
  [SECTION_TYPES.PAYMENT_SECTION]: PaymentSectionSkeleton,
  [SECTION_TYPES.BOOKING_RULES]: BookingRulesSkeleton,
  [SECTION_TYPES.ADDITIONAL_INFO]: AdditionalInfoSkeleton,
  [SECTION_TYPES.SERVICE_CATEGORIES]: ServiceCategoriesSkeleton,
  [SECTION_TYPES.LOYALTY_PROGRAM]: LoyaltyProgramSkeleton,
  [SECTION_TYPES.ADDITIONAL_SERVICES]: AdditionalServicesSkeleton,
  [SECTION_TYPES.SIMPLE_SEARCH]: SimpleSearchSkeleton,
  [SECTION_TYPES.KOPERATIVE_TYPES_LIST]: KoperativeTypesListSkeleton,
};

const SectionReferenceResolver: React.FC<{ sectionType: string; sx?: SxProps<Theme> }> = ({ sectionType, sx }) => {
  const { data, isLoading } = useSectionByComponent(sectionType);

  if (isLoading) {
    const SkeletonFallback = SECTION_SKELETONS[sectionType] ?? DynamicPageCardSkeleton;
    return <SkeletonFallback />;
  }

  const cachedSection = data?.data;
  if (cachedSection) {
    const Component = SECTION_COMPONENTS[sectionType];
    if (Component) {
      return <Component section={cachedSection} sx={sx} />;
    }
  }

  return <MissingContent componentName={sectionType} />;
};

const Section: React.FC<SectionProps> = ({ section, sx, hide }) => {
  if (hide) {
    return <></>;
  }

  if (section.__component === 'page.section-reference') {
    return <SectionReferenceResolver sectionType={section.sectionType} sx={sx} />;
  }

  const Component = SECTION_COMPONENTS[section.__component];
  if (Component) {
    return <Component section={section} sx={sx} />;
  }

  return <MissingContent componentName={section.__component} />;
};

export default Section;
