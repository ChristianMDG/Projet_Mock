import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { CloudUpload, Star, StarBorder } from '@mui/icons-material';
import { useProductCategories } from '@/hooks/productCategory.hook';
import { useCreateProduct, useSetPrimaryImage, useUpdateProduct, useUploadProductImage } from '@/hooks/product.hook';
import type { Product, ProductCategory, ProductPayload } from '@/types/shop.types';
import VariantManager from './VariantManager';
import ProductRoutesPanel from './ProductRoutesPanel';
import Labels from '@/labelKeys.json';

interface ProductFormDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly product: Product | null;
  readonly initialTab?: number;
}

interface FormState {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  sku: string;
  weight: string;
  categoryId: number | '';
  isActive: boolean;
  tags: string[];
}

const emptyForm: FormState = {
  name: '',
  description: '',
  shortDescription: '',
  price: '',
  sku: '',
  weight: '',
  categoryId: '',
  isActive: true,
  tags: [],
};

export default function ProductFormDialog({ open, onClose, product, initialTab = 0 }: ProductFormDialogProps) {
  const { t } = useTranslation();
  const { data: categories = [] } = useProductCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadProductImage();
  const setPrimary = useSetPrimaryImage();

  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(product?.id);
  const productId = product?.id ?? null;

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        name: product.name,
        description: product.description ?? '',
        shortDescription: product.shortDescription ?? '',
        price: String(product.price ?? ''),
        sku: product.sku ?? '',
        weight: product.weight === undefined ? '' : String(product.weight),
        categoryId: product.categoryId ?? '',
        isActive: product.isActive,
        tags: product.tags ?? [],
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setTab(initialTab);
  }, [open, product, initialTab]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = t(Labels.shop_product_error_name_required);
    const priceNum = Number(form.price);
    if (!form.price || Number.isNaN(priceNum) || priceNum < 0) {
      next.price = t(Labels.shop_product_error_price_invalid);
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = (): ProductPayload => ({
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    shortDescription: form.shortDescription.trim() || undefined,
    price: Number(form.price),
    sku: form.sku.trim() || undefined,
    weight: form.weight ? Number(form.weight) : undefined,
    isActive: form.isActive,
    categoryId: form.categoryId === '' ? undefined : Number(form.categoryId),
    tags: form.tags,
  });

  const handleSave = async () => {
    if (!validate()) return;
    const payload = buildPayload();
    if (isEditing && product?.id) {
      await updateProduct.mutateAsync({ id: product.id, payload });
    } else {
      await createProduct.mutateAsync(payload);
    }
    onClose();
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !productId) return;
    for (const file of Array.from(files)) {
      await uploadImage.mutateAsync({ productId, file });
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    await handleFiles(e.dataTransfer.files);
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? t(Labels.shop_product_edit) : t(Labels.shop_product_create)}</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={t(Labels.shop_product_tab_details)} />
          <Tab label={t(Labels.shop_product_tab_images)} disabled={!isEditing} />
          <Tab label={t(Labels.shop_product_tab_variants)} disabled={!isEditing} />
          <Tab label={t(Labels.shop_product_tab_routes)} disabled={!isEditing} />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              label={t(Labels.shop_product_field_name)}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={Boolean(errors.name)}
              helperText={errors.name}
              required
              size="small"
              fullWidth
            />
            <TextField
              label={t(Labels.shop_product_field_short_description)}
              value={form.shortDescription}
              onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
              size="small"
              fullWidth
            />
            <TextField
              label={t(Labels.shop_product_field_description)}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              multiline
              minRows={3}
              size="small"
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t(Labels.shop_product_field_price)}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                type="number"
                error={Boolean(errors.price)}
                helperText={errors.price}
                required
                size="small"
                fullWidth
              />
              <TextField
                label={t(Labels.shop_product_field_weight)}
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                type="number"
                size="small"
                fullWidth
              />
              <TextField
                label={t(Labels.shop_product_field_sku)}
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                size="small"
                fullWidth
              />
            </Stack>
            <Autocomplete<ProductCategory>
              options={categories}
              groupBy={(o) => o.category?.name ?? '-'}
              getOptionLabel={(o) => o.name}
              value={categories.find((c) => c.id === form.categoryId) ?? null}
              onChange={(_, v) => setForm((f) => ({ ...f, categoryId: v ? v.id : '' }))}
              renderInput={(params) => {
                const selected = categories.find((c) => c.id === form.categoryId);
                const helper = selected?.category?.name ? `${selected.category.name} › ${selected.name}` : undefined;
                return (
                  <TextField
                    {...params}
                    label={t(Labels.shop_product_field_category)}
                    size="small"
                    fullWidth
                    helperText={helper}
                  />
                );
              }}
            />
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={form.tags}
              onChange={(_, v) => setForm((f) => ({ ...f, tags: v as string[] }))}
              renderValue={(value, getItemProps) =>
                value.map((tag, index) => <Chip label={tag} size="small" {...getItemProps({ index })} key={tag} />)
              }
              renderInput={(params) => <TextField {...params} label={t(Labels.shop_product_field_tags)} size="small" />}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
              }
              label={t(Labels.shop_product_field_active)}
            />
          </Stack>
        )}

        {tab === 1 && productId && (
          <Box sx={{ p: 3 }}>
            <Box
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '2px dashed',
                borderColor: dragOver ? 'primary.main' : 'divider',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: dragOver ? 'action.hover' : 'background.paper',
                transition: 'all 0.2s',
              }}
            >
              <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {t(Labels.shop_product_image_dropzone)}
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
              />
            </Box>
            {uploadImage.isPending && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {t(Labels.shop_product_image_uploading)}
              </Alert>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t(Labels.shop_product_image_current)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {(product?.images ?? []).map((img) => (
                <Box
                  key={img.id}
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: img.primary ? '2px solid' : '1px solid',
                    borderColor: img.primary ? 'primary.main' : 'divider',
                  }}
                >
                  <Box
                    component="img"
                    src={img.url}
                    alt=""
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Tooltip title={t(Labels.shop_product_image_set_primary)}>
                    <IconButton
                      size="small"
                      onClick={() => setPrimary.mutate({ productId, imageId: img.id })}
                      sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'background.paper' }}
                    >
                      {img.primary ? <Star fontSize="small" color="primary" /> : <StarBorder fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
              {(product?.images ?? []).length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  {t(Labels.shop_product_image_empty)}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {tab === 2 && productId && <VariantManager productId={productId} variants={product?.variants ?? []} />}

        {tab === 3 && productId && <ProductRoutesPanel productId={productId} />}
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
