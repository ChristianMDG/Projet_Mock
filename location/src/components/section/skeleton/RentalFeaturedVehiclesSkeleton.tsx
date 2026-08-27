import React from 'react';
import { Box, Container, Grid, Skeleton, Card, CardContent, CardActions } from '@mui/material';

const RentalFeaturedVehiclesSkeleton: React.FC = () => (
  <Box sx={{ py: { xs: 6, md: 10 } }}>
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'flex-end' },
          mb: { xs: 4, md: 6 },
          gap: 2,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Skeleton variant="text" width="80%" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={30} />
        </Box>
        <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
      </Box>

      <Grid container spacing={4}>
        {[1, 2, 3].map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="rectangular" width="100%" height={220} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="70%" height={40} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={60} />
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                <Box>
                  <Skeleton variant="text" width={80} height={32} />
                  <Skeleton variant="text" width={60} height={20} />
                </Box>
                <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default RentalFeaturedVehiclesSkeleton;
