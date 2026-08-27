import { Box, Divider, Grid, Skeleton } from '@mui/material';

const ProductDetailSkeleton = () => (
  <Box sx={{ py: 3 }}>
    <Skeleton variant="text" sx={{ width: 320, height: 24, mb: 3 }} />
    <Skeleton variant="rectangular" sx={{ width: 120, height: 36, borderRadius: 1, mb: 3 }} />

    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton variant="rectangular" sx={{ width: 1, height: { xs: 300, md: 450 }, borderRadius: 3 }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton variant="rectangular" sx={{ width: 100, height: 24, borderRadius: 1, mb: 1 }} />
        <Skeleton variant="text" sx={{ width: '80%', height: 48, mb: 1 }} />
        <Skeleton variant="text" sx={{ width: 200, height: 24, mb: 2 }} />
        <Skeleton variant="text" sx={{ width: 220, height: 40, mb: 3 }} />
        <Divider sx={{ mb: 3 }} />
        <Skeleton variant="text" sx={{ width: 1, height: 20 }} />
        <Skeleton variant="text" sx={{ width: '95%', height: 20 }} />
        <Skeleton variant="text" sx={{ width: '90%', height: 20, mb: 3 }} />
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" sx={{ width: 140, height: 48, borderRadius: 2 }} />
          <Skeleton variant="rectangular" sx={{ flex: 1, height: 48, borderRadius: 2 }} />
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export default ProductDetailSkeleton;
