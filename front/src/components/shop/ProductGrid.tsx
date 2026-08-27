import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/models/Shop';
import ProductCard from './ProductCard';
import Labels from '@/labelKeys.json';

interface ProductGridProps {
  products: Product[];
  parentCategorySlug?: string | null;
  subcategorySlugs?: string[];
  onProductClick?: (product: Product) => void;
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, subcategorySlugs, onProductClick, title }) => {
  const { t } = useTranslation();

  const displayedProducts = subcategorySlugs?.length
    ? products.filter(p => p.category?.slug && subcategorySlugs.includes(p.category.slug))
    : products;

  return (
    <Box sx={{ mb: 3 }}>
      {title && (
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      <Grid container spacing={2}>
        {displayedProducts.map(product => (
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <ProductCard product={product} onClick={onProductClick} />
          </Grid>
        ))}
      </Grid>

      {displayedProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {t(Labels.shop_no_products)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductGrid;
