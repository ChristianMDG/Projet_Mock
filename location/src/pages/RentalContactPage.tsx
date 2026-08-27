import { Box, Container, Typography, alpha } from '@mui/material';
import Section from '../components/section/Section';
import { SECTION_TYPES } from '../constants/section.types';
import rentalHero from '../assets/rental-hero.png';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export default function RentalContactPage() {
  const { t } = useTranslation();
  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            py: { xs: 6, md: 8 },
            backgroundImage: `url(${rentalHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.75),
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'primary.contrastText',
                mb: 2,
                textShadow: theme => `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`,
              }}
            >
              {t(Labels.rental_contact_hero_title)}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: theme => alpha(theme.palette.primary.contrastText, 0.9),
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              {t(Labels.rental_contact_hero_desc)}
            </Typography>
          </Container>
        </Box>

        <Section
          section={{
            id: 1,
            __component: SECTION_TYPES.SECTION_REFERENCE,
            sectionTitle: '',
            sectionType: SECTION_TYPES.RENTAL_CONTACT,
          }}
        />
        <Section
          section={{
            id: 2,
            __component: SECTION_TYPES.SECTION_REFERENCE,
            sectionTitle: '',
            sectionType: SECTION_TYPES.RENTAL_FAQ,
          }}
        />
      </Box>
    </>
  );
}
