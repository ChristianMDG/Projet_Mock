import React from 'react';
import { Typography, Box, Chip, Grid } from '@mui/material';
import type { Product } from '@/models/Shop';
import ProductCard from './ProductCard';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface FeaturedProductsProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, onProductClick }) => {
  const { t } = useTranslation();
  const featured = products.filter(p => p.isFeatured);

  if (featured.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {t(Labels.shop_featured_title)}
        </Typography>
        <Chip label="⭐" size="small" variant="outlined" />
      </Box>
      <Grid container spacing={2}>
        {featured.map(product => (
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <ProductCard product={product} onClick={onProductClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedProducts;
