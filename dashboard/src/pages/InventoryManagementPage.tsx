import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Chip, FormControlLabel, IconButton, LinearProgress, Stack, Switch, Tooltip } from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Inventory2, Tune } from '@mui/icons-material';
import { SectionHeader, mrtTableProps } from '@/components/shared';
import StockAdjustmentDialog from '@/components/inventory/StockAdjustmentDialog';
import InventoryHistoryPanel from '@/components/inventory/InventoryHistoryPanel';
import { useInventory } from '@/hooks/inventory.hook';
import type { InventoryItem } from '@/types/shop.types';
import { InventoryStatusEnum, InventoryStatusChipColors, InventoryStatusLabels } from '@/types/shop.types';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

export default function InventoryManagementPage() {
  const { t } = useTranslation();
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [adjusting, setAdjusting] = useState<InventoryItem | null>(null);
  const { data: items = [], isLoading, error } = useInventory(lowStockOnly);

  const columns = useMemo<MRT_ColumnDef<InventoryItem>[]>(
    () => [
      { header: t(Labels.shop_inventory_col_product), accessorKey: 'productName', size: 260 },
      {
        header: t(Labels.shop_inventory_col_variant),
        accessorFn: (row) => row.variantLabel ?? '-',
        id: 'variantLabel',
        size: 180,
      },
      { header: t(Labels.shop_inventory_col_stock), accessorKey: 'quantity', size: 100 },
      {
        header: t(Labels.shop_inventory_col_threshold),
        accessorFn: (row) => row.threshold ?? '-',
        id: 'threshold',
        size: 100,
      },
      {
        header: t(Labels.shop_inventory_col_status),
        accessorKey: 'status',
        size: 140,
        Cell: ({ cell }) => {
          const value = cell.getValue<InventoryStatusEnum>();
          return (
            <Chip
              size="small"
              color={InventoryStatusChipColors[value]}
              label={t(InventoryStatusLabels[value] ?? value)}
              variant="filled"
            />
          );
        },
      },
      {
        header: t(Labels.shop_common_actions),
        id: 'actions',
        size: 100,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title={t(Labels.shop_inventory_action_adjust)}>
            <IconButton size="small" onClick={() => setAdjusting(row.original)}>
              <Tune fontSize="small" />
            </IconButton>
          </Tooltip>
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
          icon={<Inventory2 sx={{ color: paletteTokens.warning }} />}
          title={t(Labels.shop_inventory_title)}
          subtitle={t(Labels.shop_inventory_subtitle)}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControlLabel
            control={<Switch checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />}
            label={t(Labels.shop_inventory_filter_low_stock)}
          />
        </Stack>
      </Box>

      {isLoading ? <LinearProgress sx={{ mb: 1, borderRadius: 1 }} /> : null}

      <Box sx={{ width: 1 }}>
        <MaterialReactTable
          {...mrtTableProps}
          columns={columns}
          data={items}
          state={{ isLoading }}
          initialState={{ density: 'compact', pagination: { pageIndex: 0, pageSize: 20 } }}
          enableExpanding
          renderDetailPanel={({ row }) => <InventoryHistoryPanel inventoryId={row.original.id} />}
          renderEmptyRowsFallback={() => (
            <Box sx={{ width: 1, display: 'flex', justifyContent: 'center', py: 4 }}>
              {t(Labels.shop_inventory_none)}
            </Box>
          )}
        />
      </Box>

      <StockAdjustmentDialog item={adjusting} open={Boolean(adjusting)} onClose={() => setAdjusting(null)} />
    </Box>
  );
}
