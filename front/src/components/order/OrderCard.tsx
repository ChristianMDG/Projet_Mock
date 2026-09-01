import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/types/order.types';
import { OrderStatus } from '@/types/shop-enums.types';
import dayjs from '@/utils/dayjs';
import { getStatusChipColor, getStatusLabel } from '@/utils/order.utils';
import { useConfirmOrderPickup } from '@/hooks/order.hooks';
import Labels from '@/labelKeys.json';

export interface OrderCardProps {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, expanded, onToggle }) => {
  const { t, i18n } = useTranslation();
  const hasItems = Boolean(order.items?.length);
  const orderRef = order.orderNumber ? `#${order.orderNumber}` : `#${order.id}`;
  const createdAt = order.createdAt ? dayjs(order.createdAt).locale(i18n.language).format('D MMMM YYYY') : null;

  const isDelivered = order.status === OrderStatus.DELIVERED;
  const canPickup =
    !isDelivered &&
    order.status !== OrderStatus.CANCELLED &&
    order.status !== OrderStatus.PENDING &&
    order.status !== OrderStatus.PAYMENT_FAILED;

  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const confirmPickup = useConfirmOrderPickup();

  const handleValidate = async () => {
    setLocalError(null);
    const trimmed = code.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setLocalError(t(Labels.order_pickup_invalid_format));
      return;
    }
    try {
      await confirmPickup.mutateAsync({ id: order.id!, code: trimmed });
      setSuccess(true);
      setCode('');
    } catch {
      setLocalError(t(Labels.order_pickup_invalid_code));
    }
  };

  const showSuccessAlert = isDelivered || success;
  const showPickupForm = canPickup && !success;

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggle}
      elevation={1}
      sx={{
        mb: 1,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ArrowDropDownIcon />} sx={{ px: 2, py: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, width: 1 }}>
          <ReceiptIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: 'monospace', flexGrow: 1 }}>
            {orderRef}
          </Typography>
          <Chip
            label={getStatusLabel(order.status, t)}
            color={getStatusChipColor(order.status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {order.total?.toLocaleString(i18n.language)} {order.currency ?? 'Ar'}
          </Typography>
        </Stack>
      </AccordionSummary>

      <Divider />

      <AccordionDetails sx={{ px: 2, py: 1.5 }}>
        <Stack spacing={1.5}>
          {createdAt && (
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Date
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {createdAt}
              </Typography>
            </Stack>
          )}

          {order.deliveryAddress && (
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <LocalShippingIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Livraison
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
                {order.deliveryAddress}
              </Typography>
            </Stack>
          )}

          {hasItems && (
            <Box>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mb: 1 }}>
                <Inventory2Icon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Articles
                </Typography>
              </Stack>
              <Stack spacing={0.5} sx={{ pl: 1 }}>
                {order.items.map((item, index) => {
                  const lineAmount =
                    item.lineTotal ?? (item.unitPrice && item.quantity ? item.unitPrice * item.quantity : 0);
                  return (
                    <Stack
                      key={item.id ?? index}
                      direction="row"
                      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <Typography variant="caption">
                        {item.productName} × {item.quantity}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {lineAmount.toLocaleString(i18n.language)} Ar
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Statut déjà récupéré / livré */}
          {showSuccessAlert && (
            <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>
              {t(Labels.order_pickup_success)}
            </Alert>
          )}

          {/* Saisie du code de récupération à 6 chiffres */}
          {showPickupForm && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {t(Labels.order_pickup_code_label)}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ alignItems: 'flex-start' }}
              >
                <TextField
                  size="small"
                  value={code}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(v);
                    setLocalError(null);
                  }}
                  placeholder={t(Labels.order_pickup_code_placeholder)}
                  slotProps={{
                    htmlInput: {
                      inputMode: 'numeric',
                      maxLength: 6,
                      pattern: '\\d{6}',
                    },
                  }}
                  error={Boolean(localError)}
                  helperText={localError}
                  sx={{ width: { xs: '100%', sm: 140 } }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleValidate}
                  disabled={confirmPickup.isPending || code.length !== 6}
                >
                  {t(Labels.order_pickup_submit)}
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderCard;
