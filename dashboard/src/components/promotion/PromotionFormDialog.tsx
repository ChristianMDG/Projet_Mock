import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useCreatePromotion, useUpdatePromotion } from '@/hooks/promotion.hook';
import { useProducts } from '@/hooks/product.hook';
import type { Promotion, PromotionPayload, Product } from '@/types/shop.types';
import { DiscountTypeEnum, DiscountTypeLabels } from '@/types/shop.types';
import Labels from '@/labelKeys.json';

interface PromotionFormDialogProps {
  open: boolean;
  onClose: () => void;
  promotion: Promotion | null;
}

interface FormState {
  name: string;
  code: string;
  discountType: DiscountTypeEnum;
  discountValue: string;
  buyQuantity: string;
  getQuantity: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
  productIds: number[];
  isActive: boolean;
}

const emptyForm: FormState = {
  name: '',
  code: '',
  discountType: DiscountTypeEnum.PERCENTAGE,
  discountValue: '',
  buyQuantity: '',
  getQuantity: '',
  startDate: '',
  endDate: '',
  usageLimit: '',
  productIds: [],
  isActive: true,
};

const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : '');

export default function PromotionFormDialog({ open, onClose, promotion }: PromotionFormDialogProps) {
  const { t } = useTranslation();
  const create = useCreatePromotion();
  const update = useUpdatePromotion();
  const { data: products = [] } = useProducts();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (!open) return;
    if (promotion) {
      setForm({
        name: promotion.name,
        code: promotion.code ?? '',
        discountType: promotion.discountType,
        discountValue: String(promotion.discountValue ?? ''),
        buyQuantity: promotion.buyQuantity !== undefined ? String(promotion.buyQuantity) : '',
        getQuantity: promotion.getQuantity !== undefined ? String(promotion.getQuantity) : '',
        startDate: toDateInput(promotion.startDate),
        endDate: toDateInput(promotion.endDate),
        usageLimit: promotion.usageLimit !== undefined ? String(promotion.usageLimit) : '',
        productIds: promotion.productIds ?? [],
        isActive: promotion.isActive,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [open, promotion]);

  const isEditing = Boolean(promotion?.id);
  const isBuyXGetY = form.discountType === DiscountTypeEnum.BUY_X_GET_Y;

  const selectedProducts = useMemo(
    () => products.filter((p) => form.productIds.includes(p.id)),
    [products, form.productIds]
  );

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = t(Labels.shop_promotion_error_name_required);
    const isDateRangeValid = form.startDate && form.endDate && form.startDate <= form.endDate;
    if (!isDateRangeValid) next.endDate = t(Labels.shop_promotion_error_dates_invalid);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = (): PromotionPayload => ({
    name: form.name.trim(),
    code: form.code.trim() || undefined,
    discountType: form.discountType,
    discountValue: Number(form.discountValue) || 0,
    buyQuantity: isBuyXGetY && form.buyQuantity ? Number(form.buyQuantity) : undefined,
    getQuantity: isBuyXGetY && form.getQuantity ? Number(form.getQuantity) : undefined,
    startDate: form.startDate,
    endDate: form.endDate,
    usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
    productIds: form.productIds,
    isActive: form.isActive,
  });

  const handleSave = async () => {
    if (!validate()) return;
    const payload = buildPayload();
    if (isEditing && promotion?.id) {
      await update.mutateAsync({ id: promotion.id, payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  };

  const isSaving = create.isPending || update.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? t(Labels.shop_promotion_edit) : t(Labels.shop_promotion_create)}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label={t(Labels.shop_promotion_field_name)}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={Boolean(errors.name)}
              helperText={errors.name}
              size="small"
              required
              fullWidth
            />
            <TextField
              label={t(Labels.shop_promotion_field_code)}
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              size="small"
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label={t(Labels.shop_promotion_field_type)}
              value={form.discountType}
              onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as DiscountTypeEnum }))}
              size="small"
              fullWidth
            >
              {Object.values(DiscountTypeEnum).map((dt) => (
                <MenuItem key={dt} value={dt}>
                  {t(DiscountTypeLabels[dt] ?? dt)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={t(Labels.shop_promotion_field_value)}
              value={form.discountValue}
              onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
              type="number"
              size="small"
              fullWidth
            />
          </Stack>
          {isBuyXGetY ? (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t(Labels.shop_promotion_field_buy_qty)}
                value={form.buyQuantity}
                onChange={(e) => setForm((f) => ({ ...f, buyQuantity: e.target.value }))}
                type="number"
                size="small"
                fullWidth
              />
              <TextField
                label={t(Labels.shop_promotion_field_get_qty)}
                value={form.getQuantity}
                onChange={(e) => setForm((f) => ({ ...f, getQuantity: e.target.value }))}
                type="number"
                size="small"
                fullWidth
              />
            </Stack>
          ) : null}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label={t(Labels.shop_promotion_field_start)}
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
              size="small"
              fullWidth
            />
            <TextField
              label={t(Labels.shop_promotion_field_end)}
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
              error={Boolean(errors.endDate)}
              helperText={errors.endDate}
              size="small"
              fullWidth
            />
            <TextField
              label={t(Labels.shop_promotion_field_usage_limit)}
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              type="number"
              size="small"
              fullWidth
            />
          </Stack>
          <Autocomplete<Product, true>
            multiple
            options={products}
            value={selectedProducts}
            onChange={(_, v) => setForm((f) => ({ ...f, productIds: v.map((p) => p.id) }))}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            renderInput={(params) => (
              <TextField {...params} label={t(Labels.shop_promotion_field_products)} size="small" />
            )}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
            }
            label={t(Labels.shop_promotion_field_active)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSaving}>
          {t(Labels.shop_common_cancel)}
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isSaving}>
          {t(Labels.shop_common_save)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
