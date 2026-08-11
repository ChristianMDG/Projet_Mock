import React from 'react';
import { Box, Grid, Card, CardContent, Skeleton } from '@mui/material';

const DestinationsGridSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map(index => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default DestinationsGridSkeleton;
