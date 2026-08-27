import React from 'react';
import { Box, Container, Grid, Skeleton, Card, CardContent } from '@mui/material';

const RentalCategoriesSectionSkeleton: React.FC = () => (
  <Box sx={{ py: { xs: 6, md: 10 } }}>
    <Container maxWidth="lg">
      <Box
        sx={{
          textAlign: 'center',
          mb: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={30} />
      </Box>

      <Grid container spacing={4}>
        {[1, 2, 3, 4].map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item}>
            <Card sx={{ height: '100%' }}>
              <Skeleton variant="rectangular" width="100%" height={160} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default RentalCategoriesSectionSkeleton;
