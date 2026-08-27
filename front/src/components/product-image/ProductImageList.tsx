import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useProductImages } from '@/hooks/product-image.hooks';
import type { ProductImage } from '@/types/shop-admin.types';

interface ProductImageListProps {
  productId?: number;
}

const ProductImageList: React.FC<ProductImageListProps> = ({ productId }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useProductImages(productId);

  const images: ProductImage[] = data ?? [];
  const hasProduct = Boolean(productId);
  const isReady = hasProduct && !isLoading;
  const hasItems = images.length > 0;
  const showLoading = hasProduct && isLoading;
  const showError = isReady && isError;
  const showEmpty = !hasProduct || (isReady && !isError && !hasItems);
  const showList = isReady && !isError && hasItems;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.product_image_list_title)}
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
          {images.map(image => (
            <ListItem key={image.id}>
              <ListItemText
                primary={image.altText ?? image.url}
                secondary={image.isPrimary ? '★ primary' : `#${image.displayOrder ?? ''}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ProductImageList;
