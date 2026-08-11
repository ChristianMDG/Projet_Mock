import React from 'react';
import { Box, Divider, Grid, Skeleton } from '@mui/material';

const AdditionalServicesSkeleton: React.FC = () => (
  <Box>
    <Divider sx={{ my: 4 }} />
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 2 }} />
    <Grid container spacing={3}>
      {[1, 2, 3].map(index => (
        <Grid key={index} size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="60%" height={28} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default AdditionalServicesSkeleton;
