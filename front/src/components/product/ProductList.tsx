import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useProducts } from '@/hooks/product.hooks';
import type { Product } from '@/models/Shop';

const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useProducts({ page: 0, size: 20 });

  const products: Product[] = data?.content ?? [];
  const isReady = !isLoading;
  const hasItems = products.length > 0;
  const showLoading = isLoading;
  const showError = isReady && isError;
  const showEmpty = isReady && !isError && !hasItems;
  const showList = isReady && !isError && hasItems;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.product_list_title)}
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
          {products.map(product => (
            <ListItem key={product.id}>
              <ListItemText
                primary={product.name}
                secondary={`${product.sku ?? ''} — ${product.price ?? ''} ${product.currency ?? ''}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ProductList;
