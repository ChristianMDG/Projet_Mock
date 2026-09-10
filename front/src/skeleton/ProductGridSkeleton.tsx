import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
}

const BORDERED_GRID_SX = {
  '--Grid-borderWidth': '1px',
  borderTop: 'var(--Grid-borderWidth) solid',
  borderLeft: 'var(--Grid-borderWidth) solid',
  borderColor: 'divider',
  '& > div': {
    borderRight: 'var(--Grid-borderWidth) solid',
    borderBottom: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider',
  },
} as const;

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 8 }) => {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Grid container sx={BORDERED_GRID_SX}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={i}>
            <ProductCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGridSkeleton;
