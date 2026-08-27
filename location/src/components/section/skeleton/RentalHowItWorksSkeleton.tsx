import React from 'react';
import { Box, Container, Grid, Skeleton, Paper } from '@mui/material';

const RentalHowItWorksSkeleton: React.FC = () => (
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
        <Skeleton variant="text" width="50%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="70%" height={30} />
      </Box>

      <Grid container spacing={{ xs: 4, md: 2, lg: 4 }} sx={{ position: 'relative' }}>
        {[1, 2, 3].map(item => (
          <Grid size={{ xs: 12, md: 4 }} key={item}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                bgcolor: 'transparent',
              }}
            >
              <Skeleton variant="circular" width={80} height={80} sx={{ mb: 3 }} />
              <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="90%" height={24} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default RentalHowItWorksSkeleton;
