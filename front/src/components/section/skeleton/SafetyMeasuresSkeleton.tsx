import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const SafetyMeasuresSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map(index => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 2, mx: 'auto' }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default SafetyMeasuresSkeleton;
