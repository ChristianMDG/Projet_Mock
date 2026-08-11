import React from 'react';
import { Box, Grid, Card, CardContent, Skeleton } from '@mui/material';

const CurrentPromotionsSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 3 }} />
    <Grid container spacing={4}>
      {[1, 2, 3].map(index => (
        <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
              </Box>
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="rectangular" width={50} height={24} sx={{ borderRadius: 3 }} />
              </Box>
              <Skeleton variant="rectangular" width="100%" height={8} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default CurrentPromotionsSkeleton;
