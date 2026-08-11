import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const ServiceTypesSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="35%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3].map(index => (
        <Grid key={index} size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" width="70%" height={28} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="85%" height={20} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ServiceTypesSkeleton;
