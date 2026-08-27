import { useMemo, useState } from 'react';
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
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Add, Delete, Edit, LocalOffer } from '@mui/icons-material';
import { SectionHeader, mrtTableProps } from '@/components/shared';
import PromotionFormDialog from '@/components/promotion/PromotionFormDialog';
import { useDeletePromotion, usePromotions } from '@/hooks/promotion.hook';
import type { Promotion } from '@/types/shop.types';
import {
  DiscountTypeEnum,
  DiscountTypeLabels,
  PromotionStatusChipColors,
  PromotionStatusLabels,
} from '@/types/shop.types';
import { paletteTokens } from '@/themes/appTheme';
import { formatCurrency, formatDate } from '@/utils/format';
import Labels from '@/labelKeys.json';

const formatValue = (p: Promotion) => {
  if (p.discountType === DiscountTypeEnum.PERCENTAGE) return `${p.discountValue}%`;
  if (p.discountType === DiscountTypeEnum.FIXED) return formatCurrency(p.discountValue);
  return `${p.buyQuantity ?? '?'}→${p.getQuantity ?? '?'}`;
};

export default function PromotionManagementPage() {
  const { t } = useTranslation();
  const { data: promotions = [], isLoading, error } = usePromotions();
  const deletePromotion = useDeletePromotion();

  const [editing, setEditing] = useState<Promotion | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Promotion | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (p: Promotion) => {
    setEditing(p);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await deletePromotion.mutateAsync(toDelete.id);
    setToDelete(null);
  };

  const columns = useMemo<MRT_ColumnDef<Promotion>[]>(
    () => [
      { header: t(Labels.shop_promotion_col_name), accessorKey: 'name', size: 220 },
      {
        header: t(Labels.shop_promotion_col_type),
        accessorFn: (row) => t(DiscountTypeLabels[row.discountType] ?? row.discountType),
        id: 'discountType',
        size: 160,
      },
      {
        header: t(Labels.shop_promotion_col_value),
        accessorFn: formatValue,
        id: 'discountValue',
        size: 120,
      },
      {
        header: t(Labels.shop_promotion_col_start),
        accessorFn: (row) => formatDate(row.startDate),
        id: 'startDate',
        size: 120,
      },
      {
        header: t(Labels.shop_promotion_col_end),
        accessorFn: (row) => formatDate(row.endDate),
        id: 'endDate',
        size: 120,
      },
      {
        header: t(Labels.shop_promotion_col_status),
        id: 'status',
        size: 140,
        Cell: ({ row }) => {
          const s = row.original.status;
          if (!s) return '-';
          return <Chip size="small" color={PromotionStatusChipColors[s]} label={t(PromotionStatusLabels[s])} />;
        },
      },
      {
        header: t(Labels.shop_promotion_col_usage),
        accessorFn: (row) => `${row.usageCount ?? 0}${row.usageLimit ? ` / ${row.usageLimit}` : ''}`,
        id: 'usage',
        size: 120,
      },
      {
        header: t(Labels.shop_common_actions),
        id: 'actions',
        size: 120,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={t(Labels.shop_common_edit)}>
              <IconButton size="small" onClick={() => openEdit(row.original)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t(Labels.shop_common_delete)}>
              <IconButton size="small" color="error" onClick={() => setToDelete(row.original)}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [t]
  );

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t(Labels.shop_common_error)}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <SectionHeader
          icon={<LocalOffer sx={{ color: paletteTokens.pink }} />}
          title={t(Labels.shop_promotion_title)}
          subtitle={t(Labels.shop_promotion_subtitle)}
        />
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          {t(Labels.shop_promotion_create)}
        </Button>
      </Box>

      {isLoading ? <LinearProgress sx={{ mb: 1, borderRadius: 1 }} /> : null}

      <Box sx={{ width: '100%' }}>
        <MaterialReactTable
          {...mrtTableProps}
          columns={columns}
          data={promotions}
          state={{ isLoading }}
          initialState={{ density: 'compact', pagination: { pageIndex: 0, pageSize: 20 } }}
          renderEmptyRowsFallback={() => (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
              {t(Labels.shop_promotion_none)}
            </Box>
          )}
        />
      </Box>

      <PromotionFormDialog open={formOpen} onClose={() => setFormOpen(false)} promotion={editing} />

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t(Labels.shop_promotion_delete_title)}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t(Labels.shop_promotion_delete_message)}</Typography>
          {toDelete ? (
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              {toDelete.name}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToDelete(null)}>{t(Labels.shop_common_cancel)}</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deletePromotion.isPending}>
            {t(Labels.shop_common_delete)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
