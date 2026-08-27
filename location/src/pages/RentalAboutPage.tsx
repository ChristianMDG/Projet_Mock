import { useAboutValues } from '../hooks/rental-content.hooks';
import { Box, Container, Typography, Grid, Paper, alpha, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import rentalHero from '../assets/rental-hero.png';
import { DynamicIcon } from '@/components/ui';

import RentalAboutValueSkeleton from '../components/skeleton/RentalAboutValueSkeleton';

export default function RentalAboutPage() {
  const { t } = useTranslation();
  const { data: values, isLoading } = useAboutValues();

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            py: { xs: 6, md: 10 },
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
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.8),
            },
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'primary.contrastText',
                mb: 3,
                textShadow: theme => `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`,
              }}
            >
              {t(Labels.rental_about_hero_title)}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: theme => alpha(theme.palette.primary.contrastText, 0.9),
                lineHeight: 1.6,
              }}
            >
              {t(Labels.rental_about_hero_desc)}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Grid container spacing={6} sx={{ mb: 10, alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                {t(Labels.rental_about_history_title)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.8 }}>
                {t(Labels.rental_about_history_p1)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.8 }}>
                {t(Labels.rental_about_history_p2)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0729?auto=format&fit=crop&q=80"
                alt={t(Labels.rental_about_fleet_img_alt)}
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 4,
                  boxShadow: 4,
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              {t(Labels.rental_about_commitments_title)}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              {t(Labels.rental_about_commitments_desc)}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {isLoading
              ? Array.from(new Array(3)).map((_, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <RentalAboutValueSkeleton />
                  </Grid>
                ))
              : values?.map(value => {
                  return (
                    <Grid size={{ xs: 12, md: 4 }} key={value.id}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 4,
                          borderRadius: 3,
                          height: '100%',
                          textAlign: 'center',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                            mx: 'auto',
                            mb: 3,
                          }}
                        >
                          <DynamicIcon name={value.iconName} fallback="CheckCircle" fontSize="large" color="primary" />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                          {value.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {value.desc}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
