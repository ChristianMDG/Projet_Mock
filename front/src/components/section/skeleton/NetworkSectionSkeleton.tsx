import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const NetworkSectionSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />

    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="85%" height={20} />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
      </Grid>
    </Grid>

    <Grid container spacing={3} sx={{ mt: 4 }}>
      {[1, 2, 3, 4].map(index => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center' }}>
            <CardContent>
              <Skeleton variant="text" width="30%" height={40} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default NetworkSectionSkeleton;
