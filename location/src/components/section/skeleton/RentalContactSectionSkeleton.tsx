import React from 'react';
import { Box, Container, Grid, Skeleton, Paper } from '@mui/material';

const RentalContactSectionSkeleton: React.FC = () => (
  <Box sx={{ py: { xs: 6, md: 10 } }}>
    <Container maxWidth="lg">
      <Box
        sx={{
          textAlign: 'center',
          mb: { xs: 6, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={30} />
      </Box>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ pr: { md: 4 } }}>
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 4 }} />
            {[1, 2, 3, 4, 5].map(item => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="40%" height={24} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="text" width="50%" height={40} sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Skeleton variant="rectangular" width={150} height={42} sx={{ borderRadius: 1 }} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default RentalContactSectionSkeleton;
