import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useCart } from '@/hooks/cart.hooks';
import type { CartItem } from '@/types/cart.types';

const CartDemo: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useCart();

  const items: CartItem[] = data?.items ?? [];
  const hasItems = items.length > 0;

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t(Labels.cart_demo_title)}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t(Labels.cart_demo_title)}
        </Typography>
        <Typography color="error">{t(Labels.shop_error)}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.cart_demo_title)}
      </Typography>
      {hasItems ? (
        <List>
          {items.map(item => (
            <ListItem key={item.id}>
              <ListItemText
                primary={`${item.productName ?? ''} × ${item.quantity}`}
                secondary={`${item.lineTotal ?? ''}`}
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

export default CartDemo;
