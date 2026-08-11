import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const HelpCenterSectionSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3].map(index => (
        <Grid key={index} size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width="70%" height={28} sx={{ mb: 2, mx: 'auto' }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width={120} height={36} sx={{ mx: 'auto', borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default HelpCenterSectionSkeleton;
