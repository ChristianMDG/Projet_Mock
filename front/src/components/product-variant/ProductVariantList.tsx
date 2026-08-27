import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useProductVariants } from '@/hooks/product-variant.hooks';
import type { ProductVariant } from '@/types/shop-admin.types';

interface ProductVariantListProps {
  productId?: number;
}

const ProductVariantList: React.FC<ProductVariantListProps> = ({ productId }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useProductVariants(productId);

  const variants: ProductVariant[] = data ?? [];
  const hasProduct = Boolean(productId);
  const isReady = hasProduct && !isLoading;
  const hasItems = variants.length > 0;
  const showLoading = hasProduct && isLoading;
  const showError = isReady && isError;
  const showEmpty = !hasProduct || (isReady && !isError && !hasItems);
  const showList = isReady && !isError && hasItems;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.product_variant_list_title)}
      </Typography>
      {showLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {showError && <Typography color="error">{t(Labels.shop_error)}</Typography>}
      {showEmpty && <Typography color="text.secondary">{t(Labels.shop_empty)}</Typography>}
      {showList && (
        <List>
          {variants.map(variant => {
            const label = variant.sku ?? `#${variant.id}`;
            const stock = `stock: ${variant.stock ?? 0}`;
            return (
              <ListItem key={variant.id}>
                <ListItemText primary={label} secondary={stock} />
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default ProductVariantList;
