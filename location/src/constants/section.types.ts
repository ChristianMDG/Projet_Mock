/**
 * Dynamic Section Type Constants — Rental App
 *
 * Contains all CMS dynamic section types used throughout the rental application.
 * These constants ensure consistency when referencing sections in:
 * - Section.tsx component mappings
 * - Strapi CMS content types (rental.* namespace)
 * - Dynamic page configurations
 *
 * Convention: `rental.<name>-section` (matches CMS component filenames)
 *
 * Usage:
 * - Import specific section types or all section types
 * - Use in component mappings, API calls, and type definitions
 * - Maintain this file when adding/removing dynamic sections
 */

export const SECTION_TYPES = {
  // ── Core rental page sections ─────────────────────────────────────────────
  /** Hero banner with search form */
  RENTAL_HERO: 'rental.hero-section',
  /** Vehicle categories carousel / grid */
  RENTAL_CATEGORIES: 'rental.categories-section',
  /** Step-by-step rental process */
  RENTAL_HOW_IT_WORKS: 'rental.how-it-works',
  /** Featured / highlighted vehicles */
  RENTAL_FEATURED_VEHICLES: 'rental.featured-vehicles',
  /** Current offers and promotions */
  RENTAL_OFFERS: 'rental.offers-section',
  /** Trust / reassurance indicators */
  RENTAL_REASSURANCE: 'rental.reassurance-section',
  /** Rental-specific FAQ */
  RENTAL_FAQ: 'rental.faq-section',
  /** Rental contact & assistance */
  RENTAL_CONTACT: 'rental.contact-section',

  // ── Shared CMS section (section resolver engine) ──────────────────────────
  SECTION_REFERENCE: 'page.section-reference',
} as const;

/**
 * Type representing all available rental section types
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
  CORE: [
    SECTION_TYPES.RENTAL_HERO,
    SECTION_TYPES.RENTAL_CATEGORIES,
    SECTION_TYPES.RENTAL_HOW_IT_WORKS,
    SECTION_TYPES.RENTAL_FEATURED_VEHICLES,
    SECTION_TYPES.RENTAL_OFFERS,
    SECTION_TYPES.RENTAL_REASSURANCE,
  ],
  SUPPORT: [SECTION_TYPES.RENTAL_FAQ, SECTION_TYPES.RENTAL_CONTACT],
} as const;

/**
 * Recommended sections for the Rental Home Page
 *
 * Recommended order:
 * 1. Hero with search (already in RentalHeroSection component)
 * 2. Categories — quick entry points by vehicle type
 * 3. How it works — reduce friction for first-time renters
 * 4. Featured vehicles — showcase top picks
 * 5. Offers — current deals and promotions
 * 6. Reassurance — trust signals (insurance, assistance, transparency)
 */
export const RENTAL_HOME_SECTIONS = [
  SECTION_TYPES.RENTAL_CATEGORIES,
  SECTION_TYPES.RENTAL_HOW_IT_WORKS,
  SECTION_TYPES.RENTAL_FEATURED_VEHICLES,
  SECTION_TYPES.RENTAL_OFFERS,
  SECTION_TYPES.RENTAL_REASSURANCE,
] as const;

/**
 * Sections for the Rental Contact / Guide pages
 */
export const RENTAL_SUPPORT_SECTIONS = [SECTION_TYPES.RENTAL_FAQ, SECTION_TYPES.RENTAL_CONTACT] as const;
