import { useVehicles } from '../hooks/vehicle.hooks';
import { Box, Container, Typography, Grid, Divider, alpha } from '@mui/material';
import RentalVehicleCard from '../components/RentalVehicleCard';
import RentalSearchForm from '../components/RentalSearchForm';
import Section from '../components/section/Section';
import { SECTION_TYPES } from '../constants/section.types';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

import RentalVehicleCardSkeleton from '../components/skeleton/RentalVehicleCardSkeleton';

export default function RentalVoituresPage() {
  const { t } = useTranslation();
  const { data: voitures, isLoading } = useVehicles('VOITURE');

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section Voitures */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: { xs: 6, md: 10 },
            textAlign: 'center',
            backgroundImage: theme =>
              `linear-gradient(${alpha(theme.palette.primary.main, 0.7)}, ${alpha(theme.palette.primary.main, 0.8)}), url(https://images.unsplash.com/photo-1511895426328-dc8714191011?auto=format&fit=crop&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
              {t(Labels.rental_voitures_title)}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, mb: 4 }}>
              {t(Labels.rental_voitures_desc)}
            </Typography>
          </Container>
        </Box>

        {/* Search Form */}
        <Box sx={{ mt: -4, mb: 6, position: 'relative', zIndex: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 3, boxShadow: 3 }}>
              <RentalSearchForm />
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
              {t(Labels.rental_voitures_list_title)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t(Labels.rental_voitures_list_desc)}
            </Typography>
            <Divider sx={{ my: 3 }} />
          </Box>

          <Grid container spacing={3}>
            {isLoading
              ? Array.from(new Array(6)).map((_, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <RentalVehicleCardSkeleton />
                  </Grid>
                ))
              : voitures?.map(vehicle => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vehicle.id}>
                    <RentalVehicleCard {...vehicle} />
                  </Grid>
                ))}
          </Grid>
        </Container>

        <Section
          section={{
            id: 0,
            __component: SECTION_TYPES.SECTION_REFERENCE,
            sectionTitle: '',
            sectionType: SECTION_TYPES.RENTAL_REASSURANCE,
          }}
        />
      </Box>
    </>
  );
}
