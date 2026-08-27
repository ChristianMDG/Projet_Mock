import React from 'react';
import { type SxProps, type Theme } from '@mui/material';
import type { DynamicPageSection } from '@/api/dynamic-page.api';
import { useSectionByComponent } from '@/hooks/dynamic-page.hooks';
import MissingContent from '@/components/shared/MissingContent';
import { SECTION_TYPES } from '@/constants/section.types';
import {
  DynamicPageCardSkeleton,
  RentalHeroSectionSkeleton,
  RentalCategoriesSectionSkeleton,
  RentalHowItWorksSkeleton,
  RentalFeaturedVehiclesSkeleton,
  RentalOffersSectionSkeleton,
  RentalReassuranceSectionSkeleton,
  RentalFaqSectionSkeleton,
  RentalContactSectionSkeleton,
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

const RentalHeroSection = React.lazy(() => import('./RentalHeroSection'));
const RentalCategoriesSection = React.lazy(() => import('./RentalCategoriesSection'));
const RentalHowItWorks = React.lazy(() => import('./RentalHowItWorks'));
const RentalFeaturedVehicles = React.lazy(() => import('./RentalFeaturedVehicles'));
const RentalOffersSection = React.lazy(() => import('./RentalOffersSection'));
const RentalReassuranceSection = React.lazy(() => import('./RentalReassuranceSection'));
const RentalFaqSection = React.lazy(() => import('./RentalFaqSection'));
const RentalContactSection = React.lazy(() => import('./RentalContactSection'));

/**
 * Registry of dynamic CMS section components for the rental app.
 * Add rental-specific section renderers here as they are implemented.
 */
const SECTION_COMPONENTS: Record<string, SectionComponent> = {
  [SECTION_TYPES.RENTAL_HERO]: RentalHeroSection as SectionComponent,
  [SECTION_TYPES.RENTAL_CATEGORIES]: RentalCategoriesSection as SectionComponent,
  [SECTION_TYPES.RENTAL_HOW_IT_WORKS]: RentalHowItWorks as SectionComponent,
  [SECTION_TYPES.RENTAL_FEATURED_VEHICLES]: RentalFeaturedVehicles as SectionComponent,
  [SECTION_TYPES.RENTAL_OFFERS]: RentalOffersSection as SectionComponent,
  [SECTION_TYPES.RENTAL_REASSURANCE]: RentalReassuranceSection as SectionComponent,
  [SECTION_TYPES.RENTAL_FAQ]: RentalFaqSection as SectionComponent,
  [SECTION_TYPES.RENTAL_CONTACT]: RentalContactSection as SectionComponent,
};

/**
 * Skeleton fallback registry, keyed by CMS __component type.
 * Falls back to DynamicPageCardSkeleton when no specific skeleton is registered.
 */
const SECTION_SKELETONS: Record<string, SkeletonComponent> = {
  [SECTION_TYPES.RENTAL_HERO]: RentalHeroSectionSkeleton,
  [SECTION_TYPES.RENTAL_CATEGORIES]: RentalCategoriesSectionSkeleton,
  [SECTION_TYPES.RENTAL_HOW_IT_WORKS]: RentalHowItWorksSkeleton,
  [SECTION_TYPES.RENTAL_FEATURED_VEHICLES]: RentalFeaturedVehiclesSkeleton,
  [SECTION_TYPES.RENTAL_OFFERS]: RentalOffersSectionSkeleton,
  [SECTION_TYPES.RENTAL_REASSURANCE]: RentalReassuranceSectionSkeleton,
  [SECTION_TYPES.RENTAL_FAQ]: RentalFaqSectionSkeleton,
  [SECTION_TYPES.RENTAL_CONTACT]: RentalContactSectionSkeleton,
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
      const SkeletonFallback = SECTION_SKELETONS[sectionType] ?? DynamicPageCardSkeleton;
      return (
        <React.Suspense fallback={<SkeletonFallback />}>
          <Component section={cachedSection} sx={sx} />
        </React.Suspense>
      );
    }
  }

  return <MissingContent componentName={sectionType} />;
};

const Section: React.FC<SectionProps> = ({ section, sx, hide }) => {
  if (hide) {
    return <></>;
  }

  if (section.__component === SECTION_TYPES.SECTION_REFERENCE) {
    return <SectionReferenceResolver sectionType={section.sectionType} sx={sx} />;
  }

  const Component = SECTION_COMPONENTS[section.__component];
  if (Component) {
    const SkeletonFallback = SECTION_SKELETONS[section.__component] ?? DynamicPageCardSkeleton;
    return (
      <React.Suspense fallback={<SkeletonFallback />}>
        <Component section={section} sx={sx} />
      </React.Suspense>
    );
  }

  return <MissingContent componentName={section.__component} />;
};

export default Section;
