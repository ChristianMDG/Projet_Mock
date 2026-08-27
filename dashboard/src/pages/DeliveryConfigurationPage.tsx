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
import { Add, Delete, Edit, LocalShipping } from '@mui/icons-material';
import { SectionHeader, mrtTableProps } from '@/components/shared';
import DeliveryZoneFormDialog from '@/components/delivery/DeliveryZoneFormDialog';
import { useDeleteDeliveryZone, useDeliveryZones } from '@/hooks/delivery.hook';
import type { DeliveryZone } from '@/types/shop.types';
import { DeliveryMethodLabels } from '@/types/shop.types';
import { paletteTokens } from '@/themes/appTheme';
import { formatCurrency } from '@/utils/format';
import Labels from '@/labelKeys.json';

export default function DeliveryConfigurationPage() {
  const { t } = useTranslation();
  const { data: zones = [], isLoading, error } = useDeliveryZones();
  const deleteZone = useDeleteDeliveryZone();

  const [editing, setEditing] = useState<DeliveryZone | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DeliveryZone | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (z: DeliveryZone) => {
    setEditing(z);
    setFormOpen(true);
  };
  const confirmDelete = async () => {
    if (!toDelete) return;
    await deleteZone.mutateAsync(toDelete.id);
    setToDelete(null);
  };

  const columns = useMemo<MRT_ColumnDef<DeliveryZone>[]>(
    () => [
      { header: t(Labels.shop_delivery_zone_col_name), accessorKey: 'name', size: 200 },
      {
        header: t(Labels.shop_delivery_zone_col_scope),
        id: 'scope',
        size: 280,
        Cell: ({ row }) => {
          const { villes = [], fokotanys = [] } = row.original;
          const parts: string[] = [];
          if (villes.length > 0) parts.push(villes.join(', '));
          if (fokotanys.length > 0) parts.push(fokotanys.join(', '));
          return (
            <Typography variant="body2" noWrap>
              {parts.join(' · ') || '-'}
            </Typography>
          );
        },
      },
      {
        header: t(Labels.shop_delivery_zone_col_rates),
        id: 'rates',
        size: 260,
        Cell: ({ row }) => (
          <Stack spacing={0.25}>
            {row.original.rates.map((r) => (
              <Typography key={r.method} variant="caption">
                {t(DeliveryMethodLabels[r.method] ?? r.method)}: {formatCurrency(r.baseFee)} +{' '}
                {formatCurrency(r.perKgFee)}/kg
              </Typography>
            ))}
          </Stack>
        ),
      },
      {
        header: t(Labels.shop_delivery_zone_col_status),
        accessorKey: 'isActive',
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            size="small"
            color={cell.getValue<boolean>() ? 'success' : 'default'}
            label={t(cell.getValue<boolean>() ? Labels.shop_common_active : Labels.shop_common_inactive)}
          />
        ),
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
          icon={<LocalShipping sx={{ color: paletteTokens.info }} />}
          title={t(Labels.shop_delivery_title)}
          subtitle={t(Labels.shop_delivery_subtitle)}
        />
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          {t(Labels.shop_delivery_zone_create)}
        </Button>
      </Box>

      {isLoading ? <LinearProgress sx={{ mb: 1, borderRadius: 1 }} /> : null}

      <Box sx={{ width: '100%' }}>
        <MaterialReactTable
          {...mrtTableProps}
          columns={columns}
          data={zones}
          state={{ isLoading }}
          initialState={{ density: 'compact', pagination: { pageIndex: 0, pageSize: 20 } }}
          renderEmptyRowsFallback={() => (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
              {t(Labels.shop_delivery_none)}
            </Box>
          )}
        />
      </Box>

      <DeliveryZoneFormDialog open={formOpen} onClose={() => setFormOpen(false)} zone={editing} />

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t(Labels.shop_delivery_zone_delete_title)}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t(Labels.shop_delivery_zone_delete_message)}</Typography>
          {toDelete ? (
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              {toDelete.name}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToDelete(null)}>{t(Labels.shop_common_cancel)}</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleteZone.isPending}>
            {t(Labels.shop_common_delete)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
