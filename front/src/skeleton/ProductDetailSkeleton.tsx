import { Grid, Skeleton, Card, Stack } from '@mui/material';

const ProductDetailSkeleton = () => (
  <Stack spacing={3}>
    <Skeleton variant="text" sx={{ width: 280, height: 24 }} />

    <Grid container spacing={4}>
      {/* Left Column */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Skeleton variant="rectangular" sx={{ width: 1, height: { xs: 280, md: 440 }, mb: 2 }} />
        <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rectangular" sx={{ width: 72, height: 72 }} />
          ))}
        </Stack>
        <Skeleton variant="rectangular" sx={{ width: 1, height: 160 }} />
      </Grid>

      {/* Right Column: Buy Box */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Card sx={{ p: 3 }}>
          <Skeleton variant="rectangular" sx={{ width: 110, height: 24, mb: 2 }} />
          <Skeleton variant="text" sx={{ width: '85%', height: 40, mb: 1 }} />
          <Skeleton variant="text" sx={{ width: '60%', height: 24, mb: 2.5 }} />
          <Skeleton variant="rectangular" sx={{ width: 1, height: 72, mb: 2.5 }} />
          <Skeleton variant="rectangular" sx={{ width: 1, height: 48, mb: 1.5 }} />
          <Skeleton variant="rectangular" sx={{ width: 1, height: 48, mb: 2.5 }} />
          <Skeleton variant="rectangular" sx={{ width: 1, height: 90 }} />
        </Card>
      </Grid>
    </Grid>
  </Stack>
);

export default ProductDetailSkeleton;
