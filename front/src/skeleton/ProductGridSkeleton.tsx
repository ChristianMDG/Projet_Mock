import React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
}

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 8 }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={i}>
            <ProductCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGridSkeleton;
