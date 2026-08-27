import React from 'react';
import { Box, Grid, Skeleton, Stack } from '@mui/material';
import HeroLoadingSkeleton from './HeroLoadingSkeleton';
import ProductGridSkeleton from './ProductGridSkeleton';

const ShopPageSkeleton: React.FC = () => {
  return (
    <Box sx={{ py: 1 }}>
      {/* 1. Banner Skeleton */}
      <HeroLoadingSkeleton />

      {/* 2. Categories Tab Showcase Skeleton */}
      <Stack direction="row" spacing={1} sx={{ mt: 3, mb: 2, overflowX: 'auto', pb: 1 }}>
        {[80, 120, 100, 90, 110, 85].map((width, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            sx={{
              width,
              height: 40,
              borderRadius: 5,
              flexShrink: 0,
            }}
          />
        ))}
      </Stack>

      {/* 3. Products Grid */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Product Grid Skeleton */}
        <Grid size={12}>
          <ProductGridSkeleton count={8} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShopPageSkeleton;
