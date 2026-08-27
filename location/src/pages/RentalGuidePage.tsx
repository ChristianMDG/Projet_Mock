import { useGuideSteps } from '../hooks/rental-content.hooks';
import { Box, Container, Typography, Grid, Paper, Divider, alpha } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningIcon from '@mui/icons-material/WarningAmber';
import StyledIcon from '@/components/ui/StyledIcon';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

import rentalHero from '../assets/rental-hero.png';
import { DynamicIcon } from '@/components/ui';

import RentalGuideStepSkeleton from '../components/skeleton/RentalGuideStepSkeleton';

export default function RentalGuidePage() {
  const { t } = useTranslation();
  const { data: guideSteps, isLoading } = useGuideSteps();

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            py: { xs: 8, md: 10 },
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
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.7),
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
              {t(Labels.rental_guide_hero_title)}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: theme => alpha(theme.palette.primary.contrastText, 0.9),
                textShadow: theme => `0 1px 4px ${alpha(theme.palette.common.black, 0.3)}`,
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              {t(Labels.rental_guide_hero_desc)}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 6 }}>
          {/* Main advice cards */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {isLoading
              ? Array.from(new Array(3)).map((_, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <RentalGuideStepSkeleton />
                  </Grid>
                ))
              : guideSteps?.map(step => {
                  return (
                    <Grid size={{ xs: 12, md: 4 }} key={step.id}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                          <Box
                            sx={{
                              bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                              p: 1.5,
                              borderRadius: 2,
                              display: 'flex',
                            }}
                          >
                            <DynamicIcon name={step.iconName} fallback="CheckCircle" fontSize="large" color="primary" />
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {step.title}
                          </Typography>
                        </Box>
                        <Box component="ul" sx={{ pl: 2, m: 0, flexGrow: 1 }}>
                          {step.items.map((item, i) => (
                            <Typography
                              component="li"
                              variant="body1"
                              sx={{ mb: 1.5, color: 'text.secondary' }}
                              key={i}
                            >
                              {item}
                            </Typography>
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
          </Grid>

          <Divider sx={{ my: 6 }} />

          {/* Important sections */}
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <StyledIcon icon={CheckIcon} variant="primary" />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {t(Labels.rental_guide_pickup_title)}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {t(Labels.rental_guide_pickup_desc)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <StyledIcon icon={WarningIcon} color="error" />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {t(Labels.rental_guide_incident_title)}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {t(Labels.rental_guide_incident_desc)}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
