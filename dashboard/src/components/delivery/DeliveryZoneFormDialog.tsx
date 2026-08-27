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
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useCreateDeliveryZone, useUpdateDeliveryZone } from '@/hooks/delivery.hook';
import { useVilles } from '@/hooks/ville.hook';
import type { DeliveryRate, DeliveryZone, DeliveryZonePayload } from '@/types/shop.types';
import { DeliveryMethodEnum, DeliveryMethodLabels } from '@/types/shop.types';
import Labels from '@/labelKeys.json';

interface DeliveryZoneFormDialogProps {
  open: boolean;
  onClose: () => void;
  zone: DeliveryZone | null;
}

const emptyRates: DeliveryRate[] = [
  { method: DeliveryMethodEnum.STANDARD, baseFee: 0, perKgFee: 0 },
  { method: DeliveryMethodEnum.EXPRESS, baseFee: 0, perKgFee: 0 },
  { method: DeliveryMethodEnum.PICKUP, baseFee: 0, perKgFee: 0 },
];

const normalizeRates = (existing: DeliveryRate[] = []): DeliveryRate[] =>
  emptyRates.map((base) => existing.find((r) => r.method === base.method) ?? base);

interface FormState {
  name: string;
  villes: string[];
  fokotanys: string[];
  rates: DeliveryRate[];
  isActive: boolean;
}

export default function DeliveryZoneFormDialog({ open, onClose, zone }: DeliveryZoneFormDialogProps) {
  const { t } = useTranslation();
  const create = useCreateDeliveryZone();
  const update = useUpdateDeliveryZone();
  const { data: villes = [] } = useVilles();

  const villeNames = useMemo(() => villes.map((v) => v.name).sort(), [villes]);

  const [form, setForm] = useState<FormState>({
    name: '',
    villes: [],
    fokotanys: [],
    rates: emptyRates,
    isActive: true,
  });
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (zone) {
      setForm({
        name: zone.name,
        villes: zone.villes ?? [],
        fokotanys: zone.fokotanys ?? [],
        rates: normalizeRates(zone.rates),
        isActive: zone.isActive,
      });
    } else {
      setForm({ name: '', villes: [], fokotanys: [], rates: emptyRates, isActive: true });
    }
    setNameError('');
  }, [open, zone]);

  const isEditing = Boolean(zone?.id);

  const updateRate = (method: DeliveryMethodEnum, field: 'baseFee' | 'perKgFee', value: string) => {
    setForm((f) => ({
      ...f,
      rates: f.rates.map((r) => (r.method === method ? { ...r, [field]: Number(value) || 0 } : r)),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setNameError(t(Labels.shop_delivery_zone_error_name_required));
      return;
    }
    const payload: DeliveryZonePayload = {
      name: form.name.trim(),
      villes: form.villes,
      fokotanys: form.fokotanys,
      rates: form.rates,
      isActive: form.isActive,
    };
    if (isEditing && zone?.id) {
      await update.mutateAsync({ id: zone.id, payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  };

  const isSaving = create.isPending || update.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? t(Labels.shop_delivery_zone_edit) : t(Labels.shop_delivery_zone_create)}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label={t(Labels.shop_delivery_zone_field_name)}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={Boolean(nameError)}
            helperText={nameError}
            size="small"
            required
            fullWidth
          />
          <Autocomplete
            multiple
            options={villeNames}
            value={form.villes}
            onChange={(_, v) => setForm((f) => ({ ...f, villes: v }))}
            renderInput={(params) => (
              <TextField {...params} label={t(Labels.shop_delivery_zone_field_villes)} size="small" />
            )}
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={form.fokotanys}
            onChange={(_, v) => setForm((f) => ({ ...f, fokotanys: v as string[] }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t(Labels.shop_delivery_zone_field_fokotanys)}
                helperText={t(Labels.shop_delivery_zone_field_fokotanys_hint)}
                size="small"
              />
            )}
          />
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            {t(Labels.shop_delivery_zone_rates_title)}
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t(Labels.shop_delivery_zone_rate_method)}</TableCell>
                <TableCell>{t(Labels.shop_delivery_zone_rate_base)}</TableCell>
                <TableCell>{t(Labels.shop_delivery_zone_rate_per_kg)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.rates.map((r) => (
                <TableRow key={r.method}>
                  <TableCell>{t(DeliveryMethodLabels[r.method] ?? r.method)}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={r.baseFee}
                      onChange={(e) => updateRate(r.method, 'baseFee', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={r.perKgFee}
                      onChange={(e) => updateRate(r.method, 'perKgFee', e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
            }
            label={t(Labels.shop_delivery_zone_field_active)}
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
