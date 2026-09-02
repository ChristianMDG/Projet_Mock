import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useOrder, useUpdateOrderStatus } from '@/hooks/order.hook';
import type { Order } from '@/types/shop.types';
import {
  OrderStatusEnum,
  OrderStatusLabels,
  OrderStatusChipColors,
  LOGISTICS_STATUS_FLOW,
  OPERATOR_SELECTABLE_STATUSES,
  suggestedNextStatus,
} from '@/types/shop.types';
import { formatCurrency, formatDateTime } from '@/utils/format';
import Labels from '@/labelKeys.json';

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const LOGISTICS_ICONS: Partial<Record<OrderStatusEnum, React.ReactNode>> = {
  [OrderStatusEnum.READY_IN_STORE]: <StorefrontIcon fontSize="small" />,
  [OrderStatusEnum.DELIVERY_TO_STATION]: <InventoryIcon fontSize="small" />,
  [OrderStatusEnum.DELIVERY_IN_PROGRESS]: <LocalShippingIcon fontSize="small" />,
  [OrderStatusEnum.AVAILABLE_AT_COUNTER]: <ConfirmationNumberIcon fontSize="small" />,
  [OrderStatusEnum.DELIVERED]: <CheckCircleIcon fontSize="small" />,
};

export default function OrderDetailDialog({ order, open, onClose }: OrderDetailDialogProps) {
  const { t } = useTranslation();
  const { data: detail } = useOrder(order?.id ?? null);
  const updateStatus = useUpdateOrderStatus();

  const current = detail ?? order;
  const [nextStatus, setNextStatus] = useState<OrderStatusEnum | ''>('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNextStatus('');
    setReason('');
    setError(null);
    setCopied(false);
  }, [open, current?.id]);

  const suggested = useMemo(
    () => suggestedNextStatus(current?.status ?? null),
    [current?.status],
  );

  const logisticsActiveStep = useMemo(() => {
    if (!current?.status) return -1;
    return LOGISTICS_STATUS_FLOW.indexOf(current.status);
  }, [current?.status]);

  if (!current) return null;

  const selectable = OPERATOR_SELECTABLE_STATUSES.filter((s) => s !== current.status);
  const isTerminalDelivered = current.status === OrderStatusEnum.DELIVERED;
  const isCancelled = current.status === OrderStatusEnum.CANCELLED;

  const handleUpdate = async (status: OrderStatusEnum, explicitReason?: string) => {
    setError(null);
    if (status === OrderStatusEnum.CANCELLED && !(explicitReason ?? reason).trim()) {
      setError(t(Labels.shop_order_status_reason_required));
      return;
    }
    try {
      await updateStatus.mutateAsync({
        id: current.id,
        status,
        reason: (explicitReason ?? reason).trim() || undefined,
      });
      setNextStatus('');
      setReason('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur';
      setError(msg);
    }
  };

  const handleAdvance = async () => {
    if (!suggested) return;
    await handleUpdate(suggested, reason.trim() || `Avancement → ${suggested}`);
  };

  const handleCopyCode = () => {
    if (!current.pickupCode) return;
    void navigator.clipboard.writeText(current.pickupCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const address = current.deliveryAddress;
  const addressText =
    typeof address === 'string'
      ? address
      : [address?.fullName, address?.addressLine1, address?.addressLine2, address?.fokotany, address?.ville]
          .filter(Boolean)
          .join(', ');
  const hasAddress = Boolean(addressText);
  const timeline = current.timeline ?? [];
  const hasTimeline = timeline.length > 0;
  const deliveryFee = current.deliveryFee ?? current.shipping;
  const discount = current.discount ?? current.discountAmount;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            {t(Labels.shop_order_detail_title)}
          </Typography>
          <Typography
            variant="body1"
            component="span"
            sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}
          >
            {current.orderNumber}
          </Typography>
          <Chip
            label={t(OrderStatusLabels[current.status] ?? current.status)}
            color={OrderStatusChipColors[current.status]}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {formatDateTime(current.createdAt)}
        </Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50', py: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Parcours logistique */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
              {t(Labels.shop_order_logistics_flow ?? 'Parcours livraison / gare')}
            </Typography>
            <Stepper
              activeStep={logisticsActiveStep < 0 ? 0 : logisticsActiveStep}
              alternativeLabel
              nonLinear
              sx={{ mb: 2, '& .MuiStepLabel-label': { typography: 'caption' } }}
            >
              {LOGISTICS_STATUS_FLOW.map((status, index) => (
                <Step
                  key={status}
                  completed={logisticsActiveStep > index || isTerminalDelivered}
                  active={current.status === status}
                >
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor:
                            current.status === status
                              ? 'primary.main'
                              : logisticsActiveStep > index || isTerminalDelivered
                                ? 'success.main'
                                : 'action.selected',
                          color:
                            current.status === status || logisticsActiveStep > index || isTerminalDelivered
                              ? 'common.white'
                              : 'text.secondary',
                        }}
                      >
                        {LOGISTICS_ICONS[status]}
                      </Box>
                    )}
                  >
                    <Typography variant="caption" sx={{ fontWeight: current.status === status ? 700 : 500 }}>
                      {t(OrderStatusLabels[status])}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {!isTerminalDelivered && !isCancelled && suggested && (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                endIcon={<NavigateNextIcon />}
                disabled={updateStatus.isPending}
                onClick={() => void handleAdvance()}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                {t(Labels.shop_order_status_advance ?? 'Passer au statut suivant')}
                {' — '}
                {t(OrderStatusLabels[suggested])}
              </Button>
            )}
            {isTerminalDelivered && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ borderRadius: 2 }}>
                {t(OrderStatusLabels[OrderStatusEnum.DELIVERED])}
              </Alert>
            )}
          </Paper>

          {/* Code de récupération */}
          {current.pickupCode && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'primary.main',
                bgcolor: 'primary.50',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {t(Labels.shop_order_pickup_code)}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: 'ui-monospace, monospace',
                      fontWeight: 800,
                      letterSpacing: 6,
                      color: 'primary.main',
                      lineHeight: 1.2,
                    }}
                  >
                    {current.pickupCode}
                  </Typography>
                </Box>
                <Tooltip title={copied ? 'Copié !' : t(Labels.shop_order_pickup_code_copy)}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyCode}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    {copied ? 'Copié' : t(Labels.shop_order_pickup_code_copy)}
                  </Button>
                </Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {t(Labels.shop_order_pickup_code_hint)}
              </Typography>
            </Paper>
          )}

          {/* Client / paiement */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  {t(Labels.shop_order_col_customer)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {current.customerName ?? '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {[current.customerEmail, current.customerPhone].filter(Boolean).join(' · ')}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  {t(Labels.shop_order_detail_payment)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {current.paymentMethod ?? '-'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Articles */}
          <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ px: 1.5, py: 1, bgcolor: 'action.hover' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {t(Labels.shop_order_detail_items)}
              </Typography>
            </Box>
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
                    <TableCell align="right">{formatCurrency(item.lineTotal ?? item.subtotal ?? 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t(Labels.shop_order_detail_subtotal)}</Typography>
                  <Typography variant="body2">{formatCurrency(current.subtotal)}</Typography>
                </Stack>
                {deliveryFee != null && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{t(Labels.shop_order_detail_delivery)}</Typography>
                    <Typography variant="body2">{formatCurrency(deliveryFee)}</Typography>
                  </Stack>
                )}
                {!!discount && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{t(Labels.shop_order_detail_discount)}</Typography>
                    <Typography variant="body2">-{formatCurrency(discount)}</Typography>
                  </Stack>
                )}
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2">{t(Labels.shop_order_detail_total)}</Typography>
                  <Typography variant="subtitle2" color="primary.main">
                    {formatCurrency(current.total)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Paper>

          {hasAddress && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                {t(Labels.shop_order_detail_address)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {addressText}
              </Typography>
            </Box>
          )}

          {hasTimeline && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                {t(Labels.shop_order_detail_timeline)}
              </Typography>
              <Stack spacing={0.5}>
                {timeline.map((step, idx) => (
                  <Typography key={idx} variant="caption" color="text.secondary">
                    {formatDateTime(step.at)} · {t(OrderStatusLabels[step.status] ?? step.status)}
                    {step.reason ? ` · ${step.reason}` : ''}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          {/* Dropdown statut */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              {t(Labels.shop_order_status_update)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              {t(
                Labels.shop_order_status_free_hint ??
                  'Vous pouvez passer librement d’un statut à un autre à tout moment.',
              )}
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 1.5, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={1.5}>
              <TextField
                select
                size="small"
                label={t(Labels.shop_common_status)}
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value as OrderStatusEnum)}
                fullWidth
                SelectProps={{
                  MenuProps: {
                    PaperProps: { sx: { borderRadius: 2, maxHeight: 360 } },
                  },
                  renderValue: (selected) => {
                    if (!selected) return '';
                    const s = selected as OrderStatusEnum;
                    return (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          size="small"
                          label={t(OrderStatusLabels[s] ?? s)}
                          color={OrderStatusChipColors[s]}
                          sx={{ fontWeight: 600, height: 22 }}
                        />
                      </Stack>
                    );
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {selectable.map((s) => (
                  <MenuItem key={s} value={s} sx={{ py: 1.25 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Chip
                        size="small"
                        label=" "
                        color={OrderStatusChipColors[s]}
                        sx={{ width: 12, height: 12, '& .MuiChip-label': { display: 'none' } }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(OrderStatusLabels[s] ?? s)}
                      secondary={
                        s === suggested ? t(Labels.shop_order_status_suggested ?? 'recommandé') : undefined
                      }
                      primaryTypographyProps={{ fontWeight: s === suggested ? 700 : 500 }}
                    />
                    {s === suggested && (
                      <Chip size="small" label="→" color="primary" variant="outlined" sx={{ ml: 1 }} />
                    )}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                size="small"
                label={t(Labels.shop_order_status_reason)}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                fullWidth
                required={nextStatus === OrderStatusEnum.CANCELLED}
                helperText={
                  nextStatus === OrderStatusEnum.CANCELLED
                    ? t(Labels.shop_order_status_reason_required)
                    : undefined
                }
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <Button
                variant="contained"
                onClick={() => nextStatus && void handleUpdate(nextStatus)}
                disabled={!nextStatus || updateStatus.isPending}
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
                }}
              >
                {t(Labels.shop_order_status_update_cta)}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', borderRadius: 2 }}>
          {t(Labels.shop_common_close)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
