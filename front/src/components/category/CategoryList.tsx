import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useCategories } from '@/hooks/category.hooks';
import type { Category } from '@/types/category.types';

const CategoryList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useCategories();

  const categories: Category[] = data ?? [];
  const isReady = !isLoading;
  const hasItems = categories.length > 0;
  const showLoading = isLoading;
  const showError = isReady && isError;
  const showEmpty = isReady && !isError && !hasItems;
  const showList = isReady && !isError && hasItems;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.category_list_title)}
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
          {categories.map(category => (
            <ListItem key={category.id}>
              <ListItemText primary={category.name} secondary={category.slug} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default CategoryList;
