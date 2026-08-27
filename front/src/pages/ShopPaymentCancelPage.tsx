import React from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import Cancel from '@mui/icons-material/Cancel';
import Refresh from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Labels from '@/labelKeys.json';
import SEO from '@/components/shared/SEO';
import { ROUTES } from '@/constants';

const ShopPaymentCancelPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason');

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', py: { xs: 3, md: 4 }, px: { xs: 2, md: 0 } }}>
      <SEO title={t(Labels.shop_payment_cancel_title)} />

      {/* Cancel icon + title */}
      <Stack sx={{ alignItems: 'center', mb: 4 }} spacing={1.5}>
        <Cancel color="warning" sx={{ fontSize: 72 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
          {t(Labels.shop_payment_cancel_title)}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          {t(Labels.shop_payment_cancel_description)}
        </Typography>
      </Stack>

      {/* Details */}
      <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
        {orderId && (
          <Typography variant="body2" sx={{ mb: reason ? 0.5 : 0 }}>
            {t(Labels.shop_order_summary)} #{orderId}
          </Typography>
        )}
        {reason && (
          <Typography variant="body2" color="text.secondary">
            Motif : {reason}
          </Typography>
        )}
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
          startIcon={<Refresh />}
          onClick={() => navigate(ROUTES.shopCheckout[i18n.language])}
          sx={{ flex: { sm: 1 } }}
        >
          {t(Labels.shop_checkout)}
        </Button>
      </Stack>
    </Box>
  );
};

export default ShopPaymentCancelPage;
