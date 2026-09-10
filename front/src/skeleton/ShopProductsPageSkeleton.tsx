import React from 'react';
import { Stack, Skeleton, Container } from '@mui/material';
import ProductGridSkeleton from './ProductGridSkeleton';

const ShopProductsPageSkeleton: React.FC = () => {
  return (
    <Stack sx={{ pb: 4 }}>
      {/* Category Tabs Skeleton */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          py: 1,
          borderBottom: 1,
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} variant="text" sx={{ width: { xs: 60, sm: 80 }, height: 28, flexShrink: 0 }} />
        ))}
      </Stack>

      <Container maxWidth="lg" sx={{ px: '0 !important', mt: { xs: 1.5, md: 2 } }}>
        <Stack spacing={2}>
          {/* Back button skeleton */}
          <Skeleton variant="text" sx={{ width: 120, height: 24 }} />

          {/* Title + sort skeleton */}
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Skeleton variant="text" sx={{ width: 160, height: 28 }} />
            <Skeleton variant="rounded" sx={{ width: 140, height: 36, borderRadius: 1 }} />
          </Stack>

          {/* Products Grid Skeleton */}
          <ProductGridSkeleton count={8} />
        </Stack>
      </Container>
    </Stack>
  );
};

export default ShopProductsPageSkeleton;
