import React from 'react';
import { Box, Divider, List, ListItem, Paper, Typography } from '@mui/material';
import LocalShipping from '@mui/icons-material/LocalShipping';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import { formatPrice } from './utils';
import Labels from '@/labelKeys.json';

const OrderSummarySidebar: React.FC = () => {
  const { t } = useTranslation();

  const items = useCartStore(state => state.items);
  const subtotal = useCartStore(state => state.getSubtotal());
  const deliveryFee = useCartStore(state => state.getDeliveryFee());
  const total = useCartStore(state => state.getTotal());
  const deliveryDestination = useCheckoutStore(state => state.deliveryDestination);

  const hasDeliveryFee = deliveryFee > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        position: { md: 'sticky' },
        top: { md: 80 },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {t(Labels.shop_order_summary)}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Items list — compact on sidebar */}
      <List disablePadding sx={{ mb: 2 }}>
        {items.map(item => (
          <ListItem key={item.product.id} disableGutters sx={{ py: 0.5 }}>
            <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                {item.product.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ×{item.quantity}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>
              {formatPrice(item.product.price * item.quantity)}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mb: 1.5 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t(Labels.shop_subtotal)}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatPrice(subtotal)}
        </Typography>
      </Box>
      {hasDeliveryFee && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t(Labels.shop_delivery_fee)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatPrice(deliveryFee)}
          </Typography>
        </Box>
      )}
      <Divider sx={{ my: 1.5 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {t(Labels.shop_total)}
        </Typography>
        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
          {formatPrice(total)}
        </Typography>
      </Box>

      {deliveryDestination && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: 'background.default',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocalShipping fontSize="small" />
            {deliveryDestination.name}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default OrderSummarySidebar;
