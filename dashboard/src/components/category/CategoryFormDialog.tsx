import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useCreateCategory, useUpdateCategory } from '@/hooks/category.hook';
import type { Category, CategoryPayload } from '@/types/shop.types';
import Labels from '@/labelKeys.json';

interface CategoryFormDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly category: Category | null;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  displayOrder: string;
  isActive: boolean;
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  description: '',
  displayOrder: '',
  isActive: true,
};

export default function CategoryFormDialog({ open, onClose, category }: CategoryFormDialogProps) {
  const { t } = useTranslation();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (!open) return;
    if (category) {
      setForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        displayOrder: category.displayOrder === undefined ? '' : String(category.displayOrder),
        isActive: category.isActive ?? true,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [open, category]);

  const isEditing = Boolean(category?.id);

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = t(Labels.shop_category_error_name_required);
    if (!form.slug.trim()) next.slug = t(Labels.shop_category_error_slug_required);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = (): CategoryPayload => ({
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim() || undefined,
    displayOrder: form.displayOrder ? Number(form.displayOrder) : undefined,
    isActive: form.isActive,
  });

  const handleSave = async () => {
    if (!validate()) return;
    const payload = buildPayload();
    if (isEditing && category?.id) {
      await update.mutateAsync({ id: category.id, payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  };

  const isSaving = create.isPending || update.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? t(Labels.shop_category_edit) : t(Labels.shop_category_create)}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label={t(Labels.shop_category_field_name)}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={Boolean(errors.name)}
            helperText={errors.name}
            size="small"
            required
            fullWidth
          />
          <TextField
            label={t(Labels.shop_category_field_slug)}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            error={Boolean(errors.slug)}
            helperText={errors.slug}
            size="small"
            required
            fullWidth
          />
          <TextField
            label={t(Labels.shop_category_field_description)}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            multiline
            minRows={2}
            size="small"
            fullWidth
          />
          <TextField
            label={t(Labels.shop_category_field_order)}
            value={form.displayOrder}
            onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
            type="number"
            size="small"
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
            }
            label={t(Labels.shop_category_field_active)}
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
