import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const TestimonialsSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3].map(index => (
        <Grid key={index} size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', mb: 2 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Skeleton key={star} variant="circular" width={20} height={20} sx={{ mr: 0.5 }} />
                ))}
              </Box>
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="95%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default TestimonialsSkeleton;
