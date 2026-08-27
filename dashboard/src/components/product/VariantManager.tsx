import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, AutoAwesomeMotion, Delete, Save } from '@mui/icons-material';
import { useCreateVariant, useDeleteVariant, useUpdateVariant } from '@/hooks/product.hook';
import type { ProductVariant } from '@/types/shop.types';
import type { VariantPayload } from '@/api/product.api';
import Labels from '@/labelKeys.json';

interface VariantManagerProps {
  productId: number;
  variants: ProductVariant[];
}

interface VariantDraft {
  id?: number;
  sku: string;
  size: string;
  color: string;
  material: string;
  priceOverride: string;
  weight: string;
  initialStock: string;
}

const toDraft = (v: ProductVariant): VariantDraft => ({
  id: v.id,
  sku: v.sku,
  size: v.attributes?.size ?? '',
  color: v.attributes?.color ?? '',
  material: v.attributes?.material ?? '',
  priceOverride: v.priceOverride !== undefined ? String(v.priceOverride) : '',
  weight: v.weight !== undefined ? String(v.weight) : '',
  initialStock: v.stock !== undefined ? String(v.stock) : '',
});

const toPayload = (d: VariantDraft): VariantPayload => ({
  sku: d.sku.trim(),
  priceOverride: d.priceOverride ? Number(d.priceOverride) : undefined,
  weight: d.weight ? Number(d.weight) : undefined,
  attributes: {
    ...(d.size ? { size: d.size } : {}),
    ...(d.color ? { color: d.color } : {}),
    ...(d.material ? { material: d.material } : {}),
  },
  initialStock: d.initialStock ? Number(d.initialStock) : undefined,
});

export default function VariantManager({ productId, variants }: VariantManagerProps) {
  const { t } = useTranslation();
  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();
  const deleteVariant = useDeleteVariant();

  const [drafts, setDrafts] = useState<VariantDraft[]>(variants.map(toDraft));
  const [matrixSizes, setMatrixSizes] = useState('');
  const [matrixColors, setMatrixColors] = useState('');

  const hasDrafts = drafts.length > 0;

  const existingIds = useMemo(() => new Set(variants.map((v) => v.id)), [variants]);

  const addEmpty = () => {
    setDrafts((prev) => [
      ...prev,
      { sku: '', size: '', color: '', material: '', priceOverride: '', weight: '', initialStock: '' },
    ]);
  };

  const generateMatrix = () => {
    const sizes = matrixSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = matrixColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const hasSizes = sizes.length > 0;
    const hasColors = colors.length > 0;
    if (!hasSizes && !hasColors) return;
    const combos: VariantDraft[] = [];
    const sizeList = hasSizes ? sizes : [''];
    const colorList = hasColors ? colors : [''];
    for (const s of sizeList) {
      for (const c of colorList) {
        combos.push({
          sku: `${s}${s && c ? '-' : ''}${c}`.trim(),
          size: s,
          color: c,
          material: '',
          priceOverride: '',
          weight: '',
          initialStock: '',
        });
      }
    }
    setDrafts((prev) => [...prev, ...combos]);
    setMatrixSizes('');
    setMatrixColors('');
  };

  const updateDraft = (index: number, patch: Partial<VariantDraft>) => {
    setDrafts((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  };

  const removeDraft = async (index: number) => {
    const draft = drafts[index];
    const hasServerId = draft.id !== undefined && existingIds.has(draft.id);
    if (hasServerId && draft.id) {
      await deleteVariant.mutateAsync({ productId, variantId: draft.id });
    }
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  const saveDraft = async (index: number) => {
    const draft = drafts[index];
    if (!draft.sku.trim()) return;
    const payload = toPayload(draft);
    const isUpdate = draft.id !== undefined && existingIds.has(draft.id);
    if (isUpdate && draft.id) {
      await updateVariant.mutateAsync({ productId, variantId: draft.id, payload });
    } else {
      const created = await createVariant.mutateAsync({ productId, payload });
      updateDraft(index, { id: created.id });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label={t(Labels.shop_variant_matrix_sizes)}
          value={matrixSizes}
          onChange={(e) => setMatrixSizes(e.target.value)}
          size="small"
          placeholder="S, M, L, XL"
          fullWidth
        />
        <TextField
          label={t(Labels.shop_variant_matrix_colors)}
          value={matrixColors}
          onChange={(e) => setMatrixColors(e.target.value)}
          size="small"
          placeholder="Red, Blue"
          fullWidth
        />
        <Button
          variant="outlined"
          startIcon={<AutoAwesomeMotion />}
          onClick={generateMatrix}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {t(Labels.shop_variant_generate)}
        </Button>
        <Button variant="contained" startIcon={<Add />} onClick={addEmpty} sx={{ whiteSpace: 'nowrap' }}>
          {t(Labels.shop_variant_add)}
        </Button>
      </Stack>

      {!hasDrafts && <Alert severity="info">{t(Labels.shop_variant_empty)}</Alert>}

      {hasDrafts && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t(Labels.shop_variant_col_sku)}</TableCell>
              <TableCell>{t(Labels.shop_variant_col_size)}</TableCell>
              <TableCell>{t(Labels.shop_variant_col_color)}</TableCell>
              <TableCell>{t(Labels.shop_variant_col_material)}</TableCell>
              <TableCell>{t(Labels.shop_variant_col_price_override)}</TableCell>
              <TableCell>{t(Labels.shop_variant_col_weight)}</TableCell>
              <TableCell>{t(Labels.shop_variant_col_initial_stock)}</TableCell>
              <TableCell align="right">
                <Chip size="small" label={drafts.length} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drafts.map((d, i) => (
              <TableRow key={d.id ?? `new-${i}`}>
                <TableCell>
                  <TextField
                    value={d.sku}
                    onChange={(e) => updateDraft(i, { sku: e.target.value })}
                    size="small"
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={d.size}
                    onChange={(e) => updateDraft(i, { size: e.target.value })}
                    size="small"
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={d.color}
                    onChange={(e) => updateDraft(i, { color: e.target.value })}
                    size="small"
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={d.material}
                    onChange={(e) => updateDraft(i, { material: e.target.value })}
                    size="small"
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={d.priceOverride}
                    onChange={(e) => updateDraft(i, { priceOverride: e.target.value })}
                    size="small"
                    variant="standard"
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={d.weight}
                    onChange={(e) => updateDraft(i, { weight: e.target.value })}
                    size="small"
                    variant="standard"
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={d.initialStock}
                    onChange={(e) => updateDraft(i, { initialStock: e.target.value })}
                    size="small"
                    variant="standard"
                    type="number"
                    disabled={d.id !== undefined && existingIds.has(d.id)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={t(Labels.shop_common_save)}>
                    <span>
                      <IconButton size="small" color="primary" onClick={() => saveDraft(i)}>
                        <Save fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={t(Labels.shop_common_delete)}>
                    <span>
                      <IconButton size="small" color="error" onClick={() => removeDraft(i)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        {t(Labels.shop_variant_hint_save)}
      </Typography>
    </Box>
  );
}
