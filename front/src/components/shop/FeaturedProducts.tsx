import React, { memo } from 'react';
import { Typography, Stack, Grid } from '@mui/material';
import type { Product } from '@/models/Shop';
import ProductCard from './ProductCard';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

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

interface FeaturedProductsProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, onProductClick }) => {
  const { t } = useTranslation();
  const featured = products.filter(p => p.isFeatured);
  const hasFeatured = featured.length > 0;

  if (hasFeatured) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: 700, px: { xs: 1, sm: 0 } }}>
          {t(Labels.shop_featured_title)}
        </Typography>
        <Grid container sx={BORDERED_GRID_SX}>
          {featured.map(product => (
            <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={product.id}>
              <ProductCard product={product} onClick={onProductClick} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }

  return null;
};

export default memo(FeaturedProducts);
