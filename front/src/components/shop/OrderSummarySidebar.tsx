import React from 'react';
import { Divider, List, ListItem, Paper, Stack, Typography } from '@mui/material';
import LocalShipping from '@mui/icons-material/LocalShipping';
import { useTranslation } from 'react-i18next';
import { StyledIcon } from '@/components/ui';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import { formatPrice } from './utils';
import Labels from '@/labelKeys.json';

const OrderSummarySidebar: React.FC = () => {
  const { t } = useTranslation();

  const cartItems = useCartStore(state => state.items);
  const cartSubtotal = useCartStore(state => state.getSubtotal());
  const cartDeliveryFee = useCartStore(state => state.getDeliveryFee());
  const cartTotal = useCartStore(state => state.getTotal());

  const paymentItems = useCheckoutStore(state => state.paymentItems);
  const paymentSubtotal = useCheckoutStore(state => state.paymentSubtotal);
  const paymentDeliveryFee = useCheckoutStore(state => state.paymentDeliveryFee);
  const paymentTotal = useCheckoutStore(state => state.paymentTotal);
  const deliveryDestination = useCheckoutStore(state => state.deliveryDestination);

  const hasCartItems = cartItems.length > 0;
  const items = hasCartItems ? cartItems : paymentItems;

  const fallbackSubtotal = paymentItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const subtotal = hasCartItems ? cartSubtotal : paymentSubtotal || fallbackSubtotal;

  const total = hasCartItems ? cartTotal : paymentTotal || subtotal;

  const fallbackDeliveryFee = Math.max(0, total - subtotal);
  const deliveryFee = hasCartItems ? cartDeliveryFee : paymentDeliveryFee || fallbackDeliveryFee;
  const hasDeliveryFee = deliveryFee > 0;
  const isDeliveryFree = deliveryFee === 0;

  return (
    <Paper
      variant="outlined"
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

      {/* Items list */}
      <List disablePadding sx={{ mb: 2 }}>
        {items.map(item => (
          <ListItem key={item.product.id} disableGutters sx={{ py: 0.5 }}>
            <Stack sx={{ flex: 1, minWidth: 0, mr: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                {item.product.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ×{item.quantity}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>
              {formatPrice(item.product.price * item.quantity)}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mb: 1.5 }} />
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t(Labels.shop_subtotal)}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatPrice(subtotal)}
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t(Labels.shop_delivery_fee)}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: hasDeliveryFee ? 'text.primary' : 'success.main' }}>
          {hasDeliveryFee ? formatPrice(deliveryFee) : t(Labels.shop_delivery_free)}
        </Typography>
      </Stack>
      <Divider sx={{ my: 1.5 }} />
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {t(Labels.shop_total)}
        </Typography>
        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
          {formatPrice(total)}
        </Typography>
      </Stack>

      {isDeliveryFree && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2,
            p: 1.25,
            borderRadius: 1,
            bgcolor: 'action.hover',
            alignItems: 'center',
          }}
        >
          <StyledIcon icon={LocalShipping} fontSize="small" color="primary" />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {t(Labels.shop_order_summary_delivery_helper)}
          </Typography>
        </Stack>
      )}

      {deliveryDestination && (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ mt: 1.5, p: 1.5, bgcolor: 'background.default', alignItems: 'center' }}
        >
          <StyledIcon icon={LocalShipping} fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {deliveryDestination.name}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default OrderSummarySidebar;
