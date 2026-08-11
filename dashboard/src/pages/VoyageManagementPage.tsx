import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Stack, LinearProgress, Alert, Typography } from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { DirectionsBus } from '@mui/icons-material';
import { SectionHeader, mrtTableProps } from '@/components/shared';
import VoyageDetailDialog from '@/components/voyage/VoyageDetailDialog';
import { useVoyages } from '@/hooks/voyage.hook';

import type { Voyage } from '@/types/voyage.types';
import { VoyageStatusEnum, VoyageStatusLabels } from '@/types/voyage.types';
import { voyStatusColors } from '@/utils/statusColors';
import Labels from '@/labelKeys.json';

const formatDateTime = (dateStr?: string) => {
  if (dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return '-';
};

const getMRTColumns = (t: (key: string) => string): MRT_ColumnDef<Voyage>[] => [
  {
    header: t(Labels.voyage_col_id),
    accessorKey: 'id',
    size: 70,
    Cell: ({ cell }) => (
      <Box component="span" sx={{ fontFamily: 'monospace' }}>
        {cell.getValue<number>()}
      </Box>
    ),
    enableColumnFilter: false,
  },
  {
    header: t(Labels.voyage_col_departure),
    accessorFn: (row) => row.departureGare?.name ?? '-',
    id: 'departureGare',
    size: 240,
  },
  {
    header: t(Labels.voyage_col_arrival),
    accessorFn: (row) => row.arrivalGare?.name ?? '-',
    id: 'arrivalGare',
    size: 240,
  },
  {
    header: t(Labels.voyage_col_departure_date),
    accessorKey: 'departureTime',
    size: 200,
    Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
    enableColumnFilter: false,
  },
  {
    header: t(Labels.voyage_col_seats),
    accessorKey: 'availableSeats',
    size: 140,
    Cell: ({ cell }) => (
      <Box component="span" sx={{ display: 'block', textAlign: 'center' }}>
        {cell.getValue<number>()}
      </Box>
    ),
    enableColumnFilter: false,
  },
  {
    header: t(Labels.voyage_col_price_per_seat),
    accessorKey: 'pricePerSeat',
    size: 140,
    Cell: ({ cell }) =>
      cell.getValue<number>() ? `${Number(cell.getValue<number>()).toLocaleString('fr-FR')} Ar` : '-',
    enableColumnFilter: false,
  },
  {
    header: t(Labels.voyage_koperative),
    accessorFn: (row) => row.koperative?.name ?? '-',
    id: 'koperative',
    size: 180,
  },
  {
    header: t(Labels.common_status),
    accessorKey: 'status',
    size: 200,
    Cell: ({ cell }) => {
      const value = cell.getValue<VoyageStatusEnum>();
      const color = voyStatusColors[value];
      return (
        <Box component="span" sx={{ color, fontWeight: 500 }}>
          {t(VoyageStatusLabels[value] ?? value ?? '-')}
        </Box>
      );
    },
    enableColumnFilter: false,
  },
];

export default function VoyageManagementPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const { data, isLoading, error } = useVoyages();

  const columns = useMemo(() => getMRTColumns(t), [t]);

  const statusFiltersI18n = [
    { label: t(Labels.voyage_filter_all), value: '' },
    { label: t(Labels.voyage_filter_scheduled), value: VoyageStatusEnum.SCHEDULED },
    { label: t(Labels.voyage_filter_in_progress), value: VoyageStatusEnum.IN_PROGRESS },
    { label: t(Labels.voyage_filter_completed), value: VoyageStatusEnum.COMPLETED },
    { label: t(Labels.voyage_filter_cancelled), value: VoyageStatusEnum.CANCELLED },
  ];

  const voyages = data?.content ?? [];
  const filtered = statusFilter ? voyages.filter((v) => v.status === statusFilter) : voyages;

  // MRT row selection
  const handleRowClick = useCallback((row: Voyage) => {
    setSelectedVoyage(row);
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t(Labels.voyage_error)}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 2 }}>
        <SectionHeader
          icon={<DirectionsBus />}
          title={t(Labels.voyage_title)}
          subtitle={`${filtered.length} ${filtered.length !== 1 ? t(Labels.voyage_count_plural) : t(Labels.voyage_count)}`}
        />
      </Box>

      {/* Status Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
        {statusFiltersI18n.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            variant={statusFilter === f.value ? 'filled' : 'outlined'}
            color={statusFilter === f.value ? 'primary' : 'default'}
            onClick={() => setStatusFilter(f.value)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>

      {/* Loading */}
      {isLoading && <LinearProgress sx={{ mb: 1, borderRadius: 1 }} />}

      {/* Material React Table */}
      <Box sx={{ width: '100%' }}>
        <MaterialReactTable
          {...mrtTableProps}
          columns={columns}
          data={filtered}
          state={{ isLoading }}
          initialState={{
            pagination: { pageIndex: 0, pageSize: 20 },
            density: 'compact',
          }}
          muiTableBodyRowProps={({ row }) => ({
            sx: { cursor: 'pointer' },
            onClick: () => handleRowClick(row.original),
          })}
          renderTopToolbarCustomActions={() => (
            <Typography variant="subtitle1" sx={{ fontWeight: 600, alignSelf: 'center', pl: 1 }}>
              {t(Labels.voyage_title)}
            </Typography>
          )}
          muiToolbarAlertBannerProps={error ? { color: 'error', children: t(Labels.voyage_error) } : undefined}
          renderEmptyRowsFallback={() => (
            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}
            >
              {t(Labels.voyage_no_data)}
            </Box>
          )}
        />
      </Box>

      {/* Detail Dialog */}
      <VoyageDetailDialog voyage={selectedVoyage} open={!!selectedVoyage} onClose={() => setSelectedVoyage(null)} />
    </Box>
  );
}
