import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Download, ReceiptLong, Refresh, Visibility } from '@mui/icons-material';
import { SectionHeader, mrtTableProps } from '@/components/shared';
import OrderDetailDialog from '@/components/order/OrderDetailDialog';
import { useExportOrders, useOrders } from '@/hooks/order.hook';
import type { Order, OrderStatusEnum as OrderStatus } from '@/types/shop.types';
import { OrderStatusEnum, OrderStatusLabels, OrderStatusChipColors } from '@/types/shop.types';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export default function OrderManagementPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const filters = useMemo(
    () => ({
      status: statusFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
    [statusFilter, dateFrom, dateTo]
  );

  const { data: orders = [], isLoading, isFetching, error, refetch } = useOrders(filters);
  const exportOrders = useExportOrders();

  const filteredOrders = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    const needle = search.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (o) =>
        (o.orderNumber ?? '').toLowerCase().includes(needle) ||
        (o.customerName ?? '').toLowerCase().includes(needle) ||
        (o.customerEmail ?? '').toLowerCase().includes(needle) ||
        (o.customerPhone ?? '').toLowerCase().includes(needle)
    );
  }, [orders, search]);

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      { header: t(Labels.shop_order_col_number), accessorKey: 'orderNumber', size: 160 },
      {
        header: t(Labels.shop_order_col_customer),
        accessorFn: (row) => row.customerName ?? '-',
        id: 'customerName',
        size: 200,
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.original.customerName ?? '-'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.original.customerEmail ?? row.original.customerPhone ?? ''}
            </Typography>
          </Box>
        ),
      },
      {
        header: t(Labels.shop_order_col_created),
        accessorKey: 'createdAt',
        size: 180,
        Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
      },
      {
        header: t(Labels.shop_order_col_total),
        accessorKey: 'total',
        size: 140,
        Cell: ({ cell }) => formatCurrency(Number(cell.getValue<number>() ?? 0)),
      },
      {
        header: t(Labels.shop_order_col_status),
        accessorKey: 'status',
        size: 160,
        Cell: ({ cell }) => {
          const value = cell.getValue<OrderStatus>();
          return (
            <Chip
              size="small"
              label={t(OrderStatusLabels[value] ?? value)}
              color={OrderStatusChipColors[value]}
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
          <Tooltip title={t(Labels.shop_common_edit)}>
            <IconButton size="small" onClick={() => setSelected(row.original)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [t]
  );

  const handleExport = async (format: 'csv' | 'pdf') => {
    const blob = await exportOrders.mutateAsync(format);
    downloadBlob(blob, `orders-${Date.now()}.${format}`);
  };

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
          icon={<ReceiptLong sx={{ color: paletteTokens.info }} />}
          title={t(Labels.shop_order_title)}
          subtitle={t(Labels.shop_order_subtitle)}
        />
        <Stack direction="row" spacing={1}>
          <Tooltip title={t(Labels.shop_common_refresh)}>
            <span>
              <IconButton onClick={() => refetch()} disabled={isFetching} color="primary">
                <Refresh />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleExport('csv')}
            disabled={exportOrders.isPending}
          >
            {t(Labels.shop_common_export_csv)}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleExport('pdf')}
            disabled={exportOrders.isPending}
          >
            {t(Labels.shop_common_export_pdf)}
          </Button>
        </Stack>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label={t(Labels.shop_order_filter_search)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240 }}
        />
        <TextField
          select
          size="small"
          label={t(Labels.shop_order_filter_status)}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">{t(Labels.shop_common_all)}</MenuItem>
          {Object.values(OrderStatusEnum).map((s) => (
            <MenuItem key={s} value={s}>
              {t(OrderStatusLabels[s] ?? s)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          type="date"
          label={t(Labels.shop_order_filter_date_from)}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          size="small"
          type="date"
          label={t(Labels.shop_order_filter_date_to)}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />
      </Stack>

      {isFetching ? <LinearProgress sx={{ mb: 1, borderRadius: 1 }} /> : null}

      <Box sx={{ width: '100%' }}>
        <MaterialReactTable
          {...mrtTableProps}
          columns={columns}
          data={filteredOrders}
          state={{ isLoading }}
          initialState={{ density: 'compact', pagination: { pageIndex: 0, pageSize: 20 } }}
          muiTableBodyRowProps={({ row }) => ({
            sx: { cursor: 'pointer' },
            onClick: () => setSelected(row.original),
          })}
          renderEmptyRowsFallback={() => (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
              {t(Labels.shop_order_none)}
            </Box>
          )}
        />
      </Box>

      <OrderDetailDialog order={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </Box>
  );
}
