import React from 'react';
import { Avatar, Button, ButtonGroup, Divider, List, ListItem, Paper, Stack, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { StyledIcon } from '@/components/ui';
import { useCartStore } from '@/stores/cart.store';
import { useAddCartItem } from '@/hooks/cart.hooks';
import { formatPrice } from './utils';
import type { CartItem } from '@/models/Shop';
import Labels from '@/labelKeys.json';

interface CartReviewProps {
  onContinue: () => void;
}

const CartReview: React.FC<CartReviewProps> = ({ onContinue }) => {
  const { t } = useTranslation();
  const { items, getSubtotal, getItemCount, updateQuantity, removeItem } = useCartStore();
  const { mutateAsync: addCartItemMutation } = useAddCartItem();

  const subtotal = getSubtotal();

  const handleIncrease = (item: CartItem) => {
    updateQuantity(item.product.id, item.quantity + 1);
    addCartItemMutation({ productId: item.product.id, quantity: 1 }).catch(console.error);
  };

  const handleDecrease = (item: CartItem) => {
    const isLastUnit = item.quantity <= 1;
    if (isLastUnit) {
      removeItem(item.product.id);
      addCartItemMutation({ productId: item.product.id, quantity: -item.quantity }).catch(console.error);
    } else {
      updateQuantity(item.product.id, item.quantity - 1);
      addCartItemMutation({ productId: item.product.id, quantity: -1 }).catch(console.error);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {t(Labels.shop_cart_review)} ({getItemCount()} {t(Labels.shop_items)})
      </Typography>
      <List disablePadding>
        {items.map(item => (
          <ListItem key={item.product.id} sx={{ py: 2, px: 0, alignItems: 'flex-start' }} disableGutters>
            <Avatar
              variant="rounded"
              src={item.product.images?.[0]?.formats?.thumbnail?.url ?? item.product.images?.[0]?.url}
              alt={item.product.name}
              sx={{
                bgcolor: 'action.hover',
                mr: 2,
                width: { xs: 56, md: 64 },
                height: { xs: 56, md: 64 },
                fontSize: 24,
              }}
            >
              <ShoppingBag fontSize="small" />
            </Avatar>
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
                {item.product.name}
              </Typography>
              <ButtonGroup size="small" variant="outlined" sx={{ mt: 1 }}>
                <Button onClick={() => handleDecrease(item)} sx={{ minWidth: 28 }}>
                  <Remove fontSize="small" />
                </Button>
                <Button disabled sx={{ minWidth: 36 }}>
                  {item.quantity}
                </Button>
                <Button onClick={() => handleIncrease(item)} sx={{ minWidth: 28 }}>
                  <Add fontSize="small" />
                </Button>
              </ButtonGroup>
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 2, flexShrink: 0 }}>
              {formatPrice(item.product.price * item.quantity)}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {t(Labels.shop_subtotal)}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {formatPrice(subtotal)}
        </Typography>
      </Stack>
      <Stack sx={{ alignItems: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={onContinue}
          sx={{ px: 4 }}
          endIcon={<StyledIcon icon={ArrowForward} />}
        >
          {t(Labels.shop_continue)}
        </Button>
      </Stack>
    </Paper>
  );
};

export default CartReview;
