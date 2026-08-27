import React, { useEffect, useMemo } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Receipt from '@mui/icons-material/Receipt';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Labels from '@/labelKeys.json';
import SEO from '@/components/shared/SEO';
import { ROUTES } from '@/constants';
import { getOrder } from '@/api/order.api';
import { useCartStore } from '@/stores/cart.store';
import { trackEvent } from '@/hooks/google-analytics.hook';

const ShopPaymentSuccessPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore(s => s.clearCart);

  const orderIdParam = searchParams.get('orderId');
  const transactionReference = searchParams.get('transactionReference');
  const status = searchParams.get('status');

  const orderId = useMemo(() => {
    const parsed = orderIdParam ? Number(orderIdParam) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [orderIdParam]);

  const orderQuery = useQuery({
    queryKey: ['order', orderId, 'shop-success'],
    queryFn: () => (orderId ? getOrder(orderId) : Promise.reject(new Error('missing orderId'))),
    enabled: Boolean(orderId),
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    const order = orderQuery.data;
    const isConfirmed = Boolean(order && order.status && order.status !== 'CANCELLED');
    if (isConfirmed) {
      clearCart();
      trackEvent('shop_purchase_confirmed', 'Shop', order!.orderNumber ?? undefined);
    }
  }, [orderQuery.data, clearCart]);

  const order = orderQuery.data;
  const displayRef = order?.transactionReference ?? transactionReference;
  const displayStatus = order?.status ?? status;
  const orderNumber = order?.orderNumber ?? (orderId ? String(orderId) : null);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: { xs: 3, md: 4 }, px: { xs: 2, md: 0 } }}>
      <SEO title={t(Labels.shop_payment_success_title)} />

      {/* Success header */}
      <Stack sx={{ alignItems: 'center', mb: 4 }} spacing={1.5}>
        <CheckCircle color="success" sx={{ fontSize: 72 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
          {t(Labels.shop_payment_success_title)}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          {t(Labels.shop_payment_success_description)}
        </Typography>
      </Stack>

      {/* Order details card */}
      <Card sx={{ mb: 3, borderRadius: 2 }} elevation={0}>
        <CardContent>
          <Stack direction="row" sx={{ alignItems: 'center', mb: 2 }} spacing={1}>
            <Receipt sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t(Labels.shop_order_summary)}
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />

          {orderQuery.isLoading && (
            <Stack direction="row" sx={{ alignItems: 'center', py: 1 }} spacing={1.5}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                {t(Labels.shop_payment_processing)}
              </Typography>
            </Stack>
          )}

          <Stack spacing={1.5}>
            {orderNumber && (
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  N° commande
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  #{orderNumber}
                </Typography>
              </Stack>
            )}
            {displayStatus && (
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t(Labels.shop_payment_status_label)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {displayStatus}
                </Typography>
              </Stack>
            )}
            {displayRef && (
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t(Labels.shop_payment_reference_label)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    textAlign: 'right',
                    maxWidth: '60%',
                  }}
                >
                  {displayRef}
                </Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Delivery info */}
      <Alert severity="info" icon={<LocalShipping />} sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {t(Labels.shop_delivery_info)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {t(Labels.shop_order_confirmed_desc)}
        </Typography>
      </Alert>

      {/* Actions */}
      <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate(ROUTES.shop[i18n.language])}
          sx={{ flex: { sm: 1 } }}
        >
          {t(Labels.shop_continue_shopping)}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(ROUTES.accountDetail[i18n.language])}
          sx={{ flex: { sm: 1 } }}
        >
          {t(Labels.shop_view_orders)}
        </Button>
      </Stack>
    </Box>
  );
};

export default ShopPaymentSuccessPage;
