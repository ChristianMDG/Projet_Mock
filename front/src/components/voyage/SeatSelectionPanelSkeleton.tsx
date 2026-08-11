import React from 'react';
import { Box, Grid, Skeleton } from '@mui/material';
import { SeatGridSkeleton } from '@/components/seats/SeatGridSkeleton';

const SeatSelectionPanelSkeleton: React.FC = () => (
  <Box sx={{ mt: { xs: 2, md: 4 } }}>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <SeatGridSkeleton />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Skeleton variant="rounded" width={120} height={24} sx={{ borderRadius: '16px' }} />
          <Skeleton variant="rounded" width={120} height={24} sx={{ borderRadius: '16px' }} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1 }} />
      </Grid>
    </Grid>
  </Box>
);

export default SeatSelectionPanelSkeleton;
