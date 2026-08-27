import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useRelatedProducts } from '@/hooks/recommendation.hooks';
import type { Product } from '@/models/Shop';

interface RecommendationListProps {
  productId?: number;
  limit?: number;
}

const RecommendationList: React.FC<RecommendationListProps> = ({ productId, limit = 8 }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useRelatedProducts(productId, limit);

  const products: Product[] = data ?? [];
  const hasProduct = Boolean(productId);
  const isReady = hasProduct && !isLoading;
  const hasItems = products.length > 0;
  const showLoading = hasProduct && isLoading;
  const showError = isReady && isError;
  const showEmpty = !hasProduct || (isReady && !isError && !hasItems);
  const showList = isReady && !isError && hasItems;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.recommendation_list_title)}
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
              <ListItemText primary={product.name} secondary={`${product.price ?? ''} ${product.currency ?? ''}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default RecommendationList;
