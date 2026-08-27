import { useAgencies } from '../hooks/agency.hooks';
import { Box, Container, Typography, Grid, Paper, alpha } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StyledIcon from '@/components/ui/StyledIcon';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

import rentalHero from '../assets/rental-hero.png';

import RentalAgencySkeleton from '../components/skeleton/RentalAgencySkeleton';

export default function RentalAgencesPage() {
  const { t } = useTranslation();
  const { data: agences, isLoading } = useAgencies();

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
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
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.6),
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
              {t(Labels.rental_agences_hero_title)}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: theme => alpha(theme.palette.primary.contrastText, 0.9),
                textShadow: theme => `0 1px 4px ${alpha(theme.palette.common.black, 0.3)}`,
                maxWidth: 600,
              }}
            >
              {t(Labels.rental_agences_hero_desc)}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            {isLoading
              ? Array.from(new Array(4)).map((_, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={index}>
                    <RentalAgencySkeleton />
                  </Grid>
                ))
              : agences?.map((agence, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                        {agence.name}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <StyledIcon icon={LocationOnIcon} color="primary" sx={{ mt: 0.5, mr: 2 }} />
                            <Typography variant="body1">{agence.address}</Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <StyledIcon icon={PhoneIcon} color="primary" sx={{ mr: 2 }} />
                            <Typography variant="body1">{agence.phone}</Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <StyledIcon icon={AccessTimeIcon} color="primary" sx={{ mt: 0.5, mr: 2 }} />
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                              {agence.hours}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
