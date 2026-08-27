import { Box, Grid, Skeleton } from '@mui/material';

const SimpleSearchSkeleton = () => (
  <Box sx={{ py: 4 }}>
    <Skeleton variant="text" sx={{ mx: 'auto', width: '40%', height: 40, mb: 1 }} />
    <Skeleton variant="text" sx={{ mx: 'auto', width: '60%', height: 24, mb: 3 }} />
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 'grow' }}>
        <Skeleton variant="rounded" height={56} />
      </Grid>
      <Grid size={{ xs: 12, sm: 'grow' }}>
        <Skeleton variant="rounded" height={56} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Skeleton variant="rounded" height={42} />
      </Grid>
    </Grid>
  </Box>
);

export default SimpleSearchSkeleton;
