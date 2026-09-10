import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography, alpha } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useConfirmOrderPickup } from '@/hooks/order.hooks';
import type { Order } from '@/types/order.types';
import { OrderStatus } from '@/types/shop-enums.types';

export interface OrderPickupVerificationProps {
  order: Order;
}

const OrderPickupVerification: React.FC<OrderPickupVerificationProps> = ({ order }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const confirmPickupMutation = useConfirmOrderPickup();

  const isDelivered = order.status === OrderStatus.DELIVERED;
  const isCancelled = order.status === OrderStatus.CANCELLED || order.status === OrderStatus.PAYMENT_FAILED;

  if (isDelivered) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: theme => alpha(theme.palette.success.main, 0.08),
          borderColor: 'success.light',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <CheckCircleIcon color="success" />
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
          {t(Labels.order_pickup_success)}
        </Typography>
      </Paper>
    );
  }

  if (isCancelled || !order.id) {
    return null;
  }

  const orderId = order.id;

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length !== 6) {
      return;
    }
    setErrorMsg(null);
    try {
      await confirmPickupMutation.mutateAsync({ id: orderId, code: code.trim() });
      setCode('');
    } catch {
      setErrorMsg(t(Labels.order_pickup_invalid_code));
    }
  };

  const isCodeValidLength = code.length === 6;
  const isPending = confirmPickupMutation.isPending;

  return (
    <Box component="form" onSubmit={handleVerify} sx={{ mt: 1 }}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          {t(Labels.order_pickup_section_desc)}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: 'stretch' }}>
          <TextField
            size="small"
            placeholder={t(Labels.order_pickup_code_placeholder)}
            value={code}
            onChange={e => {
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              if (errorMsg) {
                setErrorMsg(null);
              }
            }}
            slotProps={{
              htmlInput: {
                maxLength: 6,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                style: { fontFamily: 'monospace', letterSpacing: '2px', fontWeight: 600 },
              },
            }}
            disabled={isPending}
            fullWidth
          />
          <Button
            variant="contained"
            size="small"
            type="submit"
            disabled={!isCodeValidLength || isPending}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <VerifiedIcon />}
            sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {t(Labels.order_pickup_submit)}
          </Button>
        </Stack>
        {errorMsg ? (
          <Alert severity="error" sx={{ py: 0.5 }}>
            {errorMsg}
          </Alert>
        ) : null}
      </Stack>
    </Box>
  );
};

export default OrderPickupVerification;
