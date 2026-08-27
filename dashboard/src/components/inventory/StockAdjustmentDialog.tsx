import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAdjustInventory } from '@/hooks/inventory.hook';
import type { InventoryItem } from '@/types/shop.types';
import Labels from '@/labelKeys.json';

interface StockAdjustmentDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
}

type Mode = 'delta' | 'absolute';

export default function StockAdjustmentDialog({ item, open, onClose }: StockAdjustmentDialogProps) {
  const { t } = useTranslation();
  const adjust = useAdjustInventory();
  const [mode, setMode] = useState<Mode>('delta');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  useEffect(() => {
    if (!open) return;
    setMode('delta');
    setQuantity('');
    setReason('');
    setReasonError('');
  }, [open, item?.id]);

  if (!item) return null;

  const handleSave = async () => {
    if (!reason.trim()) {
      setReasonError(t(Labels.shop_inventory_adjust_reason_required));
      return;
    }
    const raw = Number(quantity);
    if (Number.isNaN(raw)) return;
    const finalQuantity = mode === 'delta' ? raw : raw - item.quantity;
    await adjust.mutateAsync({ id: item.id, payload: { quantity: finalQuantity, reason: reason.trim() } });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t(Labels.shop_inventory_adjust_title)}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2">{item.productName}</Typography>
        {item.variantLabel ? (
          <Typography variant="caption" color="text.secondary">
            {item.variantLabel}
          </Typography>
        ) : null}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {t(Labels.shop_inventory_col_stock)}: {item.quantity}
        </Typography>
        <Stack spacing={2}>
          <TextField select size="small" value={mode} onChange={(e) => setMode(e.target.value as Mode)} fullWidth>
            <MenuItem value="delta">{t(Labels.shop_inventory_adjust_mode_delta)}</MenuItem>
            <MenuItem value="absolute">{t(Labels.shop_inventory_adjust_mode_absolute)}</MenuItem>
          </TextField>
          <TextField
            label={t(Labels.shop_inventory_adjust_quantity)}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            size="small"
            fullWidth
          />
          <TextField
            label={t(Labels.shop_inventory_adjust_reason)}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setReasonError('');
            }}
            error={Boolean(reasonError)}
            helperText={reasonError}
            size="small"
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={adjust.isPending}>
          {t(Labels.shop_common_cancel)}
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={adjust.isPending}>
          {t(Labels.shop_common_save)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
