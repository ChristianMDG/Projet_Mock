import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const EmergencyContactsSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map(index => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1, mx: 'auto' }} />
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1, mx: 'auto' }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default EmergencyContactsSkeleton;
