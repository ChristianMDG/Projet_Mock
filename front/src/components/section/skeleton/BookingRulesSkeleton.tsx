import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const BookingRulesSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map(index => (
        <Grid key={index} size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="60%" height={28} />
              </Box>
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="90%" height={20} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default BookingRulesSkeleton;
