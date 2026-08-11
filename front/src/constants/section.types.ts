/**
 * Dynamic Section Type Constants
 *
 * This file contains all available dynamic section types used throughout the application.
 * These constants ensure consistency when referencing sections in:
 * - Section.tsx component mappings
 * - Strapi CMS content types
 * - Dynamic page configurations
 *
 * Usage:
 * - Import specific section types or all section types
 * - Use in component mappings, API calls, and type definitions
 * - Maintain this file when adding/removing dynamic sections
 */

export const SECTION_TYPES = {
  // Safety & Insurance Sections
  SAFETY_MEASURES: 'page.safety-measures',
  INSURANCE_COVERAGE: 'page.insurance-coverage',
  SAFETY_TIPS: 'page.safety-tips',
  EMERGENCY_CONTACTS: 'page.emergency-contacts',
  ACCIDENT_INSTRUCTIONS: 'page.accident-instructions',
  TRAVEL_DESTINATIONS: 'page.travel-destinations',
  BENEFITS_SHOWCASE: 'page.benefits-showcase',
  TRUST_INDICATORS: 'page.trust-indicators',
  FAQ_SECTION: 'page.faq-section',
  ABOUT_US_SECTION: 'page.about-us-section',
  HELP_CENTER_SECTION: 'page.help-center-section',
  LEGAL_CONTENT: 'page.legal-content',
  POPULAR_ROUTES: 'page.popular-routes',
  CURRENT_PROMOTIONS: 'page.current-promotions',
  NEWS_SECTION: 'page.news-section',
  PROMOTIONAL_CONTENT: 'page.promotional-content',
  CUSTOMER_TESTIMONIALS: 'page.customer-testimonials',
  WHY_CHOOSE_US: 'page.why-choose-us',

  // Service Sections
  SERVICE_TYPES: 'page.service-types',
  CONTACT_SECTION: 'page.contact-section',

  // Destinations Sections
  DESTINATIONS_GRID: 'page.destinations-grid',
  POPULAR_DESTINATIONS: 'page.popular-destinations',

  // Company Information Sections
  STATISTICS_SECTION: 'page.statistics-section',
  MISSION_SECTION: 'page.mission-section',
  VALUES_SECTION: 'page.values-section',
  NETWORK_SECTION: 'page.network-section',
  PAYMENT_SECTION: 'page.payment-section',

  // Booking Sections
  BOOKING_RULES: 'page.booking-rules',

  // Additional Information Sections
  ADDITIONAL_INFO: 'page.additional-info',

  // Services Page Sections
  SERVICE_CATEGORIES: 'page.service-categories',
  LOYALTY_PROGRAM: 'page.loyalty-program',
  ADDITIONAL_SERVICES: 'page.additional-services',
} as const;

/**
 * Type representing all available section types
 */
export type SectionType = (typeof SECTION_TYPES)[keyof typeof SECTION_TYPES];

/**
 * Array of all section type values for iteration
 */
export const ALL_SECTION_TYPES = Object.values(SECTION_TYPES);

/**
 * Section type categories for grouping
 */
export const SECTION_CATEGORIES = {
  SAFETY_AND_INSURANCE: [
    SECTION_TYPES.SAFETY_MEASURES,
    SECTION_TYPES.INSURANCE_COVERAGE,
    SECTION_TYPES.SAFETY_TIPS,
    SECTION_TYPES.EMERGENCY_CONTACTS,
    SECTION_TYPES.ACCIDENT_INSTRUCTIONS,
  ],
  INFORMATION: [
    SECTION_TYPES.FAQ_SECTION,
    SECTION_TYPES.ABOUT_US_SECTION,
    SECTION_TYPES.HELP_CENTER_SECTION,
    SECTION_TYPES.LEGAL_CONTENT,
  ],
  MARKETING: [
    SECTION_TYPES.POPULAR_ROUTES,
    SECTION_TYPES.CURRENT_PROMOTIONS,
    SECTION_TYPES.NEWS_SECTION,
    SECTION_TYPES.PROMOTIONAL_CONTENT,
    SECTION_TYPES.CUSTOMER_TESTIMONIALS,
    SECTION_TYPES.WHY_CHOOSE_US,
  ],
  SERVICES: [SECTION_TYPES.SERVICE_TYPES, SECTION_TYPES.CONTACT_SECTION],
  DESTINATIONS: [
    SECTION_TYPES.DESTINATIONS_GRID,
    SECTION_TYPES.POPULAR_DESTINATIONS,
    SECTION_TYPES.TRAVEL_DESTINATIONS,
  ],
  COMPANY: [
    SECTION_TYPES.STATISTICS_SECTION,
    SECTION_TYPES.MISSION_SECTION,
    SECTION_TYPES.VALUES_SECTION,
    SECTION_TYPES.NETWORK_SECTION,
  ],
} as const;

/**
 * Recommended sections for the HomePage
 *
 * These sections are optimized to showcase the application's look and feel
 * while providing essential information to users on the home page.
 *
 * Recommended order:
 * 1. Hero section with search (already implemented in HomePage)
 * 2. Popular destinations - showcase available routes with visual appeal
 * 3. Why choose us - highlight key benefits and differentiators
 * 4. Statistics - build trust with numbers (routes, satisfied customers, etc.)
 * 5. Popular routes - display frequently booked routes
 * 6. Customer testimonials - social proof and trust building
 * 7. Service types - explain different service offerings
 * 8. Current promotions - drive conversions with special offers
 * 9. Safety measures - reassure users about safety standards
 * 10. Payment methods (already implemented in HomePage)
 */
export const HOME_PAGE_SECTIONS = [
  SECTION_TYPES.POPULAR_DESTINATIONS, // Visual appeal + navigation
  SECTION_TYPES.WHY_CHOOSE_US, // Key benefits & value proposition
  SECTION_TYPES.STATISTICS_SECTION, // Trust & credibility
  SECTION_TYPES.POPULAR_ROUTES, // High-demand routes
  SECTION_TYPES.CUSTOMER_TESTIMONIALS, // Social proof
  SECTION_TYPES.SERVICE_TYPES, // Service information
  SECTION_TYPES.CURRENT_PROMOTIONS, // Conversion driver
  SECTION_TYPES.SAFETY_MEASURES, // Trust & security
] as const;

/**
 * Essential information sections for HomePage
 * Subset of HOME_PAGE_SECTIONS focusing on critical information
 */
export const HOME_PAGE_ESSENTIAL_SECTIONS = [
  SECTION_TYPES.WHY_CHOOSE_US, // Value proposition
  SECTION_TYPES.STATISTICS_SECTION, // Trust indicators
  SECTION_TYPES.SAFETY_MEASURES, // Security reassurance
] as const;
