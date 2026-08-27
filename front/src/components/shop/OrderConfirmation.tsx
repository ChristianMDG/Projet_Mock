import React from 'react';
import { Alert, Button, Paper, Typography } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { useCheckoutStore } from '@/stores/checkout.store';
import { formatPrice } from '@/components/shop/utils';
import Labels from '@/labelKeys.json';

export interface OrderConfirmationProps {
  onContinueShopping: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onContinueShopping }) => {
  const { t } = useTranslation();
  const { confirmedOrderNumber, deliveryDestination, paymentTotal, selectedPaymentMethod } = useCheckoutStore();

  const hasDeliveryDestination = Boolean(deliveryDestination);

  return (
    <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
      <CheckCircle color="success" sx={{ fontSize: { xs: 56, md: 64 }, mb: 2 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        {t(Labels.shop_order_confirmed)}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t(Labels.shop_order_confirmed_desc)}
      </Typography>

      {hasDeliveryDestination && (
        <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
          {confirmedOrderNumber && (
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {t(Labels.shop_order_summary)}: #{confirmedOrderNumber}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {t(Labels.shop_delivery_destination)}: {deliveryDestination?.name}
            {deliveryDestination?.province && ` • ${deliveryDestination.province}`}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {t(Labels.shop_total)}: {formatPrice(paymentTotal)}
          </Typography>
          {selectedPaymentMethod && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {t(Labels.shop_payment_method_used)}: {selectedPaymentMethod}
            </Typography>
          )}
        </Alert>
      )}

      <Button variant="contained" size="large" onClick={onContinueShopping}>
        {t(Labels.shop_continue_shopping)}
      </Button>
    </Paper>
  );
};

export default OrderConfirmation;
