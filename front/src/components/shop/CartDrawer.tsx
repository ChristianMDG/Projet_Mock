import React from 'react';
import {
  Drawer,
  Typography,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  Avatar,
  Stack,
  ButtonGroup,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import ShoppingCartCheckout from '@mui/icons-material/ShoppingCartCheckout';
import DeleteSweep from '@mui/icons-material/DeleteSweep';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useAddCartItem } from '@/hooks/cart.hooks';
import { formatPrice } from './utils';
import { ROUTES } from '@/constants/routes';
import Labels from '@/labelKeys.json';

const CartDrawer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { items, drawerOpen, setDrawerOpen, removeItem, updateQuantity, clearCart, getTotal, getItemCount } =
    useCartStore();
  const setActiveStep = useCheckoutStore(state => state.setActiveStep);
  const { mutateAsync: addCartItemMutation } = useAddCartItem();
  const hasItems = items.length > 0;

  const handleClose = () => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setDrawerOpen(false);
  };

  const handleViewCart = () => {
    handleClose();
    setActiveStep(0);
    navigate(ROUTES.shopCheckout[i18n.language]);
  };

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={handleClose} disableRestoreFocus disableAutoFocus>
      <Stack sx={{ width: { xs: 320, sm: 400 }, height: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t(Labels.shop_cart_title)} ({getItemCount()})
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
        <Divider />

        {hasItems ? (
          <>
            <List sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              {items.map(item => (
                <ListItem key={item.product.id} sx={{ py: 1.5, px: 2, mb: 1, bgcolor: 'background.default' }}>
                  <Avatar
                    variant="rounded"
                    src={item.product.images?.[0]?.formats?.thumbnail?.url ?? item.product.images?.[0]?.url}
                    alt={item.product.name}
                    sx={{ bgcolor: 'action.hover', mr: 2, width: 56, height: 56, fontSize: 24 }}
                  >
                    <ShoppingBag fontSize="small" />
                  </Avatar>
                  <Stack sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                      {formatPrice(item.product.price)}
                    </Typography>
                    <ButtonGroup size="small" variant="outlined" sx={{ mt: 0.5 }}>
                      <Button
                        onClick={() => {
                          updateQuantity(item.product.id, item.quantity - 1);
                          addCartItemMutation({ productId: item.product.id, quantity: -1 }).catch(console.error);
                        }}
                        sx={{ minWidth: 28 }}
                      >
                        <Remove fontSize="small" />
                      </Button>
                      <Button disabled sx={{ minWidth: 36 }}>
                        {item.quantity}
                      </Button>
                      <Button
                        onClick={() => {
                          updateQuantity(item.product.id, item.quantity + 1);
                          addCartItemMutation({ productId: item.product.id, quantity: 1 }).catch(console.error);
                        }}
                        sx={{ minWidth: 28 }}
                      >
                        <Add fontSize="small" />
                      </Button>
                    </ButtonGroup>
                  </Stack>
                  <Stack sx={{ textAlign: 'right', ml: 1, flexShrink: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        removeItem(item.product.id);
                        addCartItemMutation({ productId: item.product.id, quantity: -item.quantity }).catch(
                          console.error,
                        );
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Stack sx={{ p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {t(Labels.shop_total)}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatPrice(getTotal())}
                </Typography>
              </Stack>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ShoppingCartCheckout />}
                onClick={handleViewCart}
                sx={{ py: 1.5, mb: 1 }}
              >
                {t(Labels.shop_view_cart)}
              </Button>
              <Button variant="outlined" fullWidth size="medium" onClick={handleClose} sx={{ mb: 1 }}>
                {t(Labels.shop_continue_shopping)}
              </Button>
              <Button
                variant="text"
                fullWidth
                size="small"
                color="error"
                startIcon={<DeleteSweep />}
                onClick={clearCart}
              >
                {t(Labels.shop_clear_cart)}
              </Button>
            </Stack>
          </>
        ) : (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', p: 4, gap: 2 }}>
            <ShoppingBag sx={{ fontSize: 56, color: 'text.disabled' }} />
            <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
              {t(Labels.shop_cart_empty)}
            </Typography>
            <Button variant="contained" onClick={handleClose}>
              {t(Labels.shop_back_to_shop)}
            </Button>
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
};

export default CartDrawer;
