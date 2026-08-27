import { Box, Container, Grid, Skeleton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StyledIcon from '@/components/ui/StyledIcon';

export default function RentalVehicleDetailSkeleton() {
  return (
    <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button startIcon={<StyledIcon icon={ArrowBackIcon} />} sx={{ mb: 3, color: 'text.secondary' }} disabled>
          Retour
        </Button>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                p: 3,
                mb: 4,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 1 }} />
            </Box>

            <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 4 }} />

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 4 }} />
              <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 4 }} />
              <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 4 }} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 24,
              }}
            >
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="70%" height={48} sx={{ mb: 3 }} />

              <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 3, borderRadius: 1 }} />

              <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1 }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
