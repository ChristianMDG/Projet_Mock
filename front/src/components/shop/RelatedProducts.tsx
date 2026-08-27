import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/models/Shop';
import { useProducts } from '@/hooks/cms.hooks';
import ProductCard from './ProductCard';
import Labels from '@/labelKeys.json';

interface RelatedProductsProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ product, onProductClick }) => {
  const { t } = useTranslation();
  const { data: allProducts = [] } = useProducts();

  const relatedProducts = (product.relatedProductIds ?? [])
    .map(id => allProducts.find(p => p.id === id))
    .filter((p): p is Product => !!p)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {t(Labels.shop_related_products)}
      </Typography>
      <Grid container spacing={2}>
        {relatedProducts.map(p => (
          <Grid key={p.id} size={{ xs: 6, sm: 6, md: 3 }}>
            <ProductCard product={p} onClick={onProductClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;
