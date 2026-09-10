import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useOrder, useUpdateOrderStatus } from '@/hooks/order.hook';
import type { Order } from '@/types/shop.types';
import { OrderStatusEnum, OrderStatusLabels, OrderStatusChipColors } from '@/types/shop.types';
import { formatCurrency, formatDateTime } from '@/utils/format';
import Labels from '@/labelKeys.json';
import { PhoneLink } from '@/components/shared';

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export default function OrderDetailDialog({ order, open, onClose }: OrderDetailDialogProps) {
  const { t } = useTranslation();
  const { data: detail } = useOrder(order?.id ?? null);
  const updateStatus = useUpdateOrderStatus();

  const current = detail ?? order;
  const [nextStatus, setNextStatus] = useState<OrderStatusEnum | ''>('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) return;
    setNextStatus('');
    setReason('');
  }, [open, current?.id]);

  if (!current) return null;

  const availableStatuses = [
    OrderStatusEnum.READY_IN_STORE,
    OrderStatusEnum.DELIVERY_TO_STATION,
    OrderStatusEnum.DELIVERY_IN_PROGRESS,
    OrderStatusEnum.AVAILABLE_AT_COUNTER,
    OrderStatusEnum.DELIVERED,
    OrderStatusEnum.CANCELLED,
    OrderStatusEnum.PENDING,
    OrderStatusEnum.PROCESSING,
    OrderStatusEnum.SHIPPED,
  ].filter((s) => s !== current.status);

  const handleUpdate = async () => {
    if (!nextStatus) return;
    await updateStatus.mutateAsync({
      id: current.id,
      status: nextStatus,
      reason: reason.trim() || undefined,
    });
    setNextStatus('');
    setReason('');
  };

  const address = current.deliveryAddress;
  const hasAddress = Boolean(
    address && (address.fullName || address.addressLine1 || address.ville || address.fokotany)
  );
  const timeline = current.timeline ?? [];
  const hasTimeline = timeline.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t(Labels.shop_order_detail_title)} · {current.orderNumber}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip
              label={t(OrderStatusLabels[current.status] ?? current.status)}
              color={OrderStatusChipColors[current.status]}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {formatDateTime(current.createdAt)}
            </Typography>
          </Stack>

          {current.pickupCode ? (
            <Box
              sx={{
                p: 1.5,
                bgcolor: 'action.hover',
                borderRadius: 1.5,
                border: '1px dashed',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block' }}>
                  {t(Labels.shop_order_pickup_code)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t(Labels.shop_order_pickup_code_desc)}
                </Typography>
              </Box>
              <Chip
                label={current.pickupCode}
                color="primary"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  letterSpacing: '3px',
                  fontFamily: 'monospace',
                  px: 1,
                }}
              />
            </Box>
          ) : null}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2">{t(Labels.shop_order_col_customer)}</Typography>
              <Typography variant="body2">{current.customerName ?? '-'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {current.customerEmail ?? ''}
                {current.customerPhone && (
                  <>
                    {' · '}
                    <PhoneLink phone={current.customerPhone} sx={{ display: 'inline', fontSize: 'inherit' }} />
                  </>
                )}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2">{t(Labels.shop_order_detail_payment)}</Typography>
              <Typography variant="body2">{current.paymentMethod ?? '-'}</Typography>
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="subtitle2">{t(Labels.shop_order_detail_items)}</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t(Labels.shop_product_col_name)}</TableCell>
                <TableCell align="right">{t(Labels.shop_order_col_total)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(current.items ?? []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.productName}
                    {item.variantLabel ? ` · ${item.variantLabel}` : ''}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t(Labels.shop_order_detail_totals)}
            </Typography>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">{t(Labels.shop_order_detail_subtotal)}</Typography>
                <Typography variant="body2">{formatCurrency(current.subtotal)}</Typography>
              </Stack>
              {current.deliveryFee !== undefined ? (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t(Labels.shop_order_detail_delivery)}</Typography>
                  <Typography variant="body2">{formatCurrency(current.deliveryFee)}</Typography>
                </Stack>
              ) : null}
              {current.discount ? (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t(Labels.shop_order_detail_discount)}</Typography>
                  <Typography variant="body2">-{formatCurrency(current.discount)}</Typography>
                </Stack>
              ) : null}
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2">{t(Labels.shop_order_detail_total)}</Typography>
                <Typography variant="subtitle2">{formatCurrency(current.total)}</Typography>
              </Stack>
            </Stack>
          </Box>

          {hasAddress ? (
            <>
              <Divider />
              <Typography variant="subtitle2">{t(Labels.shop_order_detail_address)}</Typography>
              <Typography variant="body2">{address?.fullName ?? ''}</Typography>
              <Typography variant="body2">
                {address?.addressLine1 ?? ''} {address?.addressLine2 ?? ''}
              </Typography>
              <Typography variant="body2">
                {address?.fokotany ?? ''} {address?.ville ?? ''}
              </Typography>
            </>
          ) : null}

          {hasTimeline ? (
            <>
              <Divider />
              <Typography variant="subtitle2">{t(Labels.shop_order_detail_timeline)}</Typography>
              <Stack spacing={0.5}>
                {timeline.map((step, idx) => (
                  <Typography key={idx} variant="caption" color="text.secondary">
                    {formatDateTime(step.at)} · {t(OrderStatusLabels[step.status] ?? step.status)}
                    {step.reason ? ` · ${step.reason}` : ''}
                  </Typography>
                ))}
              </Stack>
            </>
          ) : null}

          {availableStatuses.length > 0 ? (
            <>
              <Divider />
              <Typography variant="subtitle2">{t(Labels.shop_order_status_update)}</Typography>
              <Stack spacing={1.5}>
                <TextField
                  select
                  size="small"
                  label={t(Labels.shop_common_status)}
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value as OrderStatusEnum)}
                  fullWidth
                >
                  {availableStatuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {t(OrderStatusLabels[s] ?? s)}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  label={t(Labels.shop_order_status_reason)}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  disabled={!nextStatus || updateStatus.isPending}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {t(Labels.shop_order_status_update_cta)}
                </Button>
              </Stack>
            </>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>{t(Labels.shop_common_close)}</Button>
      </DialogActions>
    </Dialog>
  );
}
