import { Box } from '@mui/material';
import RentalAppBanner from '../components/RentalAppBanner';
import Section from '../components/section/Section';
import { SECTION_TYPES } from '../constants/section.types';

export default function RentalHomePage() {
  return (
    <>
      {/* Offset for fixed AppBar */}
      <Box>
        <Section
          section={{
            id: 1,
            __component: SECTION_TYPES.SECTION_REFERENCE,
            sectionTitle: '',
            sectionType: SECTION_TYPES.RENTAL_HERO,
          }}
        />
        <Section
          section={{
            id: 2,
            __component: SECTION_TYPES.SECTION_REFERENCE,
            sectionTitle: '',
            sectionType: SECTION_TYPES.RENTAL_CATEGORIES,
          }}
        />
        <Section
          section={{
            id: 3,
            __component: SECTION_TYPES.SECTION_REFERENCE,
            sectionTitle: '',
            sectionType: SECTION_TYPES.RENTAL_HOW_IT_WORKS,
          }}
        />
        <Section
          section={{
            id: 4,
            __component: SECTION_TYPES.SECTION_REFERENCE,
            sectionTitle: '',
            sectionType: SECTION_TYPES.RENTAL_FEATURED_VEHICLES,
          }}
        />
        <Section
          section={{
            id: 5,
            __component: SECTION_TYPES.SECTION_REFERENCE,
            sectionTitle: '',
            sectionType: SECTION_TYPES.RENTAL_OFFERS,
          }}
        />
        <RentalAppBanner />
        <Section
          section={{
            id: 6,
            __component: SECTION_TYPES.SECTION_REFERENCE,
            sectionTitle: '',
            sectionType: SECTION_TYPES.RENTAL_REASSURANCE,
          }}
        />
      </Box>
    </>
  );
}
