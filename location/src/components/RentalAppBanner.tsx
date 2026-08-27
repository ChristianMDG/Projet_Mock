import { Box, Container, Typography, Grid, Button } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import ShopIcon from '@mui/icons-material/Shop';
import StyledIcon from '@/components/ui/StyledIcon';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export default function RentalAppBanner() {
  const { t } = useTranslation();
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'primary.main', color: 'primary.contrastText', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7 }} sx={{ zIndex: 1 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 3 }}>
              {t(Labels.rental_app_banner_title)}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, mb: 4, maxWidth: 500 }}>
              {t(Labels.rental_app_banner_desc)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<StyledIcon icon={AppleIcon} />}
                href="#"
                sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700 }}
              >
                App Store
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<StyledIcon icon={ShopIcon} />}
                href="#"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  borderColor: 'primary.contrastText',
                  color: 'primary.contrastText',
                  '&:hover': {
                    borderColor: 'primary.contrastText',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Google Play
              </Button>
            </Box>
          </Grid>

          {/* Mockup area - decorative */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: -120,
                right: -60,
                width: 380,
                height: 700,
                bgcolor: 'background.paper',
                borderRadius: '40px',
                boxShadow: 10,
                transform: 'rotate(-5deg)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '8px solid',
                borderColor: 'grey.900',
              }}
            >
              {/* Fake screen content */}
              <Box sx={{ height: 60, bgcolor: 'secondary.main' }} />
              <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
                <Box sx={{ width: '60%', height: 24, bgcolor: 'divider', borderRadius: 1, mb: 4 }} />
                <Box sx={{ width: '100%', height: 200, bgcolor: 'divider', borderRadius: 3, mb: 2 }} />
                <Box sx={{ width: '80%', height: 16, bgcolor: 'divider', borderRadius: 1, mb: 1 }} />
                <Box sx={{ width: '40%', height: 16, bgcolor: 'divider', borderRadius: 1 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
