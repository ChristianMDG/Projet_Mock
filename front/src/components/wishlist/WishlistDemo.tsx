import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useWishlist } from '@/hooks/wishlist.hooks';
import type { WishlistItem } from '@/types/wishlist.types';

interface WishlistDemoProps {
  enabled?: boolean;
}

const WishlistDemo: React.FC<WishlistDemoProps> = ({ enabled = true }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useWishlist(enabled);

  const items: WishlistItem[] = data?.items ?? [];
  const hasItems = items.length > 0;

  if (enabled && isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t(Labels.wishlist_demo_title)}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (enabled && isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t(Labels.wishlist_demo_title)}
        </Typography>
        <Typography color="error">{t(Labels.shop_error)}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.wishlist_demo_title)}
      </Typography>
      {enabled && hasItems ? (
        <List>
          {items.map(item => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.productName ?? `#${item.productId ?? ''}`}
                secondary={`${item.productPrice ?? ''}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">{t(Labels.shop_empty)}</Typography>
      )}
    </Box>
  );
};

export default WishlistDemo;
