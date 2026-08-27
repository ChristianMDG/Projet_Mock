import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useProductCategories } from '@/hooks/product-category.hooks';
import type { ProductCategory } from '@/types/category.types';

const ProductCategoryList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useProductCategories();

  const items: ProductCategory[] = data ?? [];
  const isReady = !isLoading;
  const hasItems = items.length > 0;
  const showLoading = isLoading;
  const showError = isReady && isError;
  const showEmpty = isReady && !isError && !hasItems;
  const showList = isReady && !isError && hasItems;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.product_category_list_title)}
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
          {items.map(item => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.name}
                secondary={item.category?.name ? `${item.category.name} / ${item.slug}` : item.slug}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ProductCategoryList;
