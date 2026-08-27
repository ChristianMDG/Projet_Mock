import React from 'react';
import { Box, Container, Grid, Skeleton, Card } from '@mui/material';

const RentalOffersSectionSkeleton: React.FC = () => (
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
        <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="50%" height={30} />
      </Box>

      <Grid container spacing={4}>
        {[1, 2].map(item => (
          <Grid size={{ xs: 12, md: 6 }} key={item}>
            <Card sx={{ height: 250, display: 'flex' }}>
              <Skeleton variant="rectangular" width="40%" height="100%" />
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="100%" height={20} />
                <Box sx={{ mt: 'auto' }}>
                  <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default RentalOffersSectionSkeleton;
