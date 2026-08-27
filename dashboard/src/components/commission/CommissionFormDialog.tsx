import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import type { Commission } from '@/models';
import type { Koperative } from '@/types/koperative.types';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';
import Labels from '@/labelKeys.json';

interface CommissionFormState {
  minAmount: string;
  maxAmount: string;
  frais: string;
  koperativeId: number | '';
}

interface CommissionFormErrors {
  minAmount?: string;
  maxAmount?: string;
  frais?: string;
}

const emptyForm: CommissionFormState = {
  minAmount: '',
  maxAmount: '',
  frais: '',
  koperativeId: '',
};

interface CommissionFormDialogProps {
  readonly open: boolean;
  readonly editing: Commission | null;
  readonly onClose: () => void;
  readonly onSubmit: (commission: Commission) => void;
  readonly koperatives: Koperative[];
  readonly isMutating?: boolean;
}

export default function CommissionFormDialog({
  open,
  editing,
  onClose,
  onSubmit,
  koperatives,
  isMutating = false,
}: Readonly<CommissionFormDialogProps>) {
  const { t } = useTranslation();
  const [form, setForm] = useState<CommissionFormState>(emptyForm);
  const [errors, setErrors] = useState<CommissionFormErrors>({});

  useEffect(() => {
    if (editing) {
      setForm({
        minAmount: String(editing.minAmount ?? ''),
        maxAmount: String(editing.maxAmount ?? ''),
        frais: String(editing.frais ?? ''),
        koperativeId: editing.koperativeId ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editing, open]);

  const isInvalidAmount = (val: string, num: number) => val === '' || Number.isNaN(num) || num < 0;

  const validate = (): boolean => {
    const errs: CommissionFormErrors = {};
    const min = Number(form.minAmount);
    const max = Number(form.maxAmount);
    const frais = Number(form.frais);

    if (isInvalidAmount(form.minAmount, min)) {
      errs.minAmount = t(Labels.commission_min_amount_required);
    }
    if (isInvalidAmount(form.maxAmount, max)) {
      errs.maxAmount = t(Labels.commission_max_amount_required);
    }
    if (form.minAmount && form.maxAmount && max < min) {
      errs.maxAmount = t(Labels.commission_max_amount_invalid);
    }
    if (isInvalidAmount(form.frais, frais)) {
      errs.frais = t(Labels.commission_frais_required);
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const payload: Commission = {
        id: editing?.id,
        minAmount: Number(form.minAmount),
        maxAmount: Number(form.maxAmount),
        frais: Number(form.frais),
        koperativeId: form.koperativeId ? Number(form.koperativeId) : undefined,
      };
      onSubmit(payload);
    }
  };

  const selectedKoperative = form.koperativeId ? (koperatives.find((k) => k.id === form.koperativeId) ?? null) : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{editing ? t(Labels.commission_dialog_edit) : t(Labels.commission_dialog_create)}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <KoperativeAutocomplete
            value={selectedKoperative}
            onChange={(k) => setForm((f) => ({ ...f, koperativeId: k ? k.id : '' }))}
            options={koperatives}
            label={t(Labels.commission_field_koperative)}
            placeholder={t(Labels.commission_select_koperative)}
          />

          <TextField
            label={t(Labels.commission_field_min_amount)}
            type="number"
            value={form.minAmount}
            onChange={(e) => setForm((f) => ({ ...f, minAmount: e.target.value }))}
            error={Boolean(errors.minAmount)}
            helperText={errors.minAmount}
            required
            fullWidth
            size="small"
          />

          <TextField
            label={t(Labels.commission_field_max_amount)}
            type="number"
            value={form.maxAmount}
            onChange={(e) => setForm((f) => ({ ...f, maxAmount: e.target.value }))}
            error={Boolean(errors.maxAmount)}
            helperText={errors.maxAmount}
            required
            fullWidth
            size="small"
          />

          <TextField
            label={t(Labels.commission_field_frais)}
            type="number"
            value={form.frais}
            onChange={(e) => setForm((f) => ({ ...f, frais: e.target.value }))}
            error={Boolean(errors.frais)}
            helperText={errors.frais}
            required
            fullWidth
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isMutating}>
          {t(Labels.commission_cancel)}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isMutating}>
          {t(Labels.commission_save)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
