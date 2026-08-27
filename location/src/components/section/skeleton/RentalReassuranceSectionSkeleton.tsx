import React from 'react';
import { Box, Container, Grid, Skeleton } from '@mui/material';

const RentalReassuranceSectionSkeleton: React.FC = () => (
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

      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        {[1, 2, 3, 4].map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2 }}>
              <Skeleton variant="circular" width={60} height={60} sx={{ mb: 3 }} />
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width={100} height={24} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default RentalReassuranceSectionSkeleton;
