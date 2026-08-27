import { useEffect, useState } from 'react';
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
  TextField,
} from '@mui/material';
import { useCreateProductCategory, useUpdateProductCategory } from '@/hooks/productCategory.hook';
import { useCategories } from '@/hooks/category.hook';
import type { Category, ProductCategory, ProductCategoryPayload } from '@/types/shop.types';
import Labels from '@/labelKeys.json';

interface SubcategoryFormDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly subcategory: ProductCategory | null;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  parentId: number | null;
  displayOrder: string;
  isActive: boolean;
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  description: '',
  parentId: null,
  displayOrder: '',
  isActive: true,
};

export default function SubcategoryFormDialog({ open, onClose, subcategory }: SubcategoryFormDialogProps) {
  const { t } = useTranslation();
  const { data: parents = [] } = useCategories();
  const create = useCreateProductCategory();
  const update = useUpdateProductCategory();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (!open) return;
    if (subcategory) {
      setForm({
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description ?? '',
        parentId: subcategory.parentId ?? subcategory.category?.id ?? null,
        displayOrder: subcategory.displayOrder === undefined ? '' : String(subcategory.displayOrder),
        isActive: subcategory.isActive ?? true,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [open, subcategory]);

  const isEditing = Boolean(subcategory?.id);

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = t(Labels.shop_category_error_name_required);
    if (!form.slug.trim()) next.slug = t(Labels.shop_category_error_slug_required);
    if (!form.parentId) next.parentId = t(Labels.shop_subcategory_error_parent_required);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = (): ProductCategoryPayload => ({
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim() || undefined,
    parentId: form.parentId as number,
    displayOrder: form.displayOrder ? Number(form.displayOrder) : undefined,
    isActive: form.isActive,
  });

  const handleSave = async () => {
    if (!validate()) return;
    const payload = buildPayload();
    if (isEditing && subcategory?.id) {
      await update.mutateAsync({ id: subcategory.id, payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  };

  const isSaving = create.isPending || update.isPending;
  const selectedParent = parents.find((p) => p.id === form.parentId) ?? null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? t(Labels.shop_subcategory_edit) : t(Labels.shop_subcategory_create)}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Autocomplete<Category>
            options={parents}
            getOptionLabel={(o) => o.name}
            value={selectedParent}
            onChange={(_, v) => setForm((f) => ({ ...f, parentId: v ? v.id : null }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t(Labels.shop_subcategory_field_parent)}
                size="small"
                required
                error={Boolean(errors.parentId)}
                helperText={errors.parentId}
                fullWidth
              />
            )}
          />
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
