import React, { memo } from 'react';
import { Typography, Stack, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Product, SortOption } from '@/models/Shop';
import ProductCard from '@/components/shop/ProductCard';
import ProductGridEmpty from '@/components/shop/ProductGridEmpty';
import ShopSortSelect from '@/components/shop/ShopSortSelect';
import Labels from '@/labelKeys.json';

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  onClearFilters?: () => void;
  title?: string;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  searchQuery?: string;
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

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
  onClearFilters,
  title,
  sortBy,
  onSortChange,
  searchQuery,
}) => {
  const { t } = useTranslation();

  const hasProducts = products.length > 0;
  const hasNoProducts = products.length === 0;
  const hasTitle = Boolean(title);
  const hasSort = Boolean(sortBy && onSortChange);

  return (
    <Stack spacing={{ xs: 1.5, md: 2 }}>
      {(hasTitle || hasSort) && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: { xs: 0.75, sm: 1 },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
            {hasTitle && <Typography variant="h6">{title}</Typography>}
            {hasProducts && (
              <Typography variant="caption" color="text.secondary">
                ({t(Labels.shop_results_count, { count: products.length })})
              </Typography>
            )}
          </Stack>
          {hasSort && hasProducts && <ShopSortSelect value={sortBy!} onChange={onSortChange!} />}
        </Stack>
      )}

      {hasProducts && (
        <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 0, bgcolor: 'transparent' }}>
          <Grid container sx={BORDERED_GRID_SX}>
            {products.map(product => (
              <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={product.id}>
                <ProductCard product={product} onClick={onProductClick} searchQuery={searchQuery} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {hasNoProducts && <ProductGridEmpty onClearFilters={onClearFilters} searchQuery={searchQuery} />}
    </Stack>
  );
};

export default memo(ProductGrid);
