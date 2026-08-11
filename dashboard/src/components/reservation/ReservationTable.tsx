import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import type { Reservation, ReservationStatusEnum } from '@/types/reservation.types';
import { ReservationStatusLabels, PaymentStatusLabels } from '@/types/reservation.types';
import { useUpdateReservationStatus, useCancelReservation, useConfirmReservation } from '@/hooks/reservation.hook';
import { resStatusColors, payStatusColors } from '@/utils/statusColors';
import ReservationActions from './ReservationActions';
import { mrtTableProps } from '@/components/shared';
import Labels from '@/labelKeys.json';

interface ReservationTableProps {
  data: Reservation[];
  loading?: boolean;
  onViewReservation?: (reservation: Reservation) => void;
  title?: string;
}

const formatDate = (dateStr?: string) => {
  if (dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  return '-';
};

function getColumns(
  t: (key: string) => string,
  handleView: (r: Reservation) => void,
  handleCancel: (r: Reservation) => void,
  handleConfirm: (r: Reservation) => void,
  cancelPending: boolean,
  confirmPending: boolean,
  updateStatus: (id: number, status: ReservationStatusEnum) => void
): MRT_ColumnDef<Reservation>[] {
  return [
    {
      header: t(Labels.reservation_col_ref),
      accessorKey: 'bookingReference',
      size: 120,
      Cell: ({ cell }) => (
        <Box component="span" sx={{ fontFamily: 'monospace' }}>
          {cell.getValue<string>()}
        </Box>
      ),
    },
    {
      header: t(Labels.reservation_col_name),
      accessorFn: (row) => `${row.voyageur?.firstName ?? ''} ${row.voyageur?.lastName ?? ''}`.trim(),
      id: 'fullName',
      size: 160,
    },
    {
      header: t(Labels.reservation_col_phone),
      accessorFn: (row) => row.voyageur?.phone ?? '-',
      id: 'phone',
      size: 140,
    },
    {
      header: t(Labels.reservation_col_route),
      accessorFn: (row) => {
        const v = row.voyage;
        if (v?.departureCity || v?.arrivalCity) {
          return `${v?.departureCity ?? '?'} → ${v?.arrivalCity ?? '?'}`;
        }
        return '-';
      },
      id: 'route',
      size: 180,
    },
    {
      header: t(Labels.reservation_col_date),
      accessorKey: 'bookingDate',
      size: 130,
      Cell: ({ cell }) => formatDate(cell.getValue<string>()),
    },
    {
      header: t(Labels.reservation_col_seats),
      accessorFn: (row) => row.seats?.length ?? 0,
      id: 'seats',
      size: 90,
      Cell: ({ cell }) => (
        <Box component="span" sx={{ display: 'block', textAlign: 'center' }}>
          {cell.getValue<number>()}
        </Box>
      ),
    },
    {
      header: t(Labels.reservation_col_amount),
      accessorKey: 'totalAmount',
      size: 130,
      Cell: ({ cell }) => (cell.getValue<number>() ? `${cell.getValue<number>().toLocaleString('fr-FR')} Ar` : '-'),
    },
    {
      header: t(Labels.reservation_col_status),
      accessorKey: 'status',
      size: 180,
      Cell: ({ cell, row }) => (
        <Select
          value={cell.getValue<ReservationStatusEnum>()}
          onChange={(e) => {
            const newStatus = e.target.value as ReservationStatusEnum;
            if (row.original.id) updateStatus(row.original.id, newStatus);
          }}
          size="small"
          variant="standard"
          disabled={cancelPending || confirmPending}
          sx={{
            fontWeight: 500,
            color: resStatusColors[cell.getValue<string>()],
            '&:before': { borderBottom: 'none' },
            '&:after': { borderBottom: 'none' },
            '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
          }}
        >
          {Object.entries(ReservationStatusLabels).map(([key, label]) => (
            <MenuItem key={key} value={key} sx={{ color: resStatusColors[key] }}>
              {t(label)}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      header: t(Labels.reservation_col_payment),
      accessorFn: (row) => row.facturation?.paymentStatus,
      id: 'paymentStatus',
      size: 150,
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return value ? (
          <Box component="span" sx={{ color: payStatusColors[value], fontWeight: 500 }}>
            {t(PaymentStatusLabels[value as keyof typeof PaymentStatusLabels])}
          </Box>
        ) : (
          '-'
        );
      },
    },
    {
      header: t(Labels.common_actions),
      id: 'actions',
      size: 140,
      grow: false,
      enableColumnFilter: false,
      enableSorting: false,
      enableResizing: false,
      muiTableBodyCellProps: { align: 'center', sx: { justifyContent: 'center', display: 'flex' } },
      muiTableHeadCellProps: { align: 'center', sx: { justifyContent: 'center', display: 'flex' } },
      Cell: ({ row }) => (
        <ReservationActions
          reservation={row.original}
          onView={handleView}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          cancelDisabled={cancelPending}
          confirmDisabled={confirmPending}
        />
      ),
    },
  ];
}

export default function ReservationTable({ data, loading = false, onViewReservation, title }: ReservationTableProps) {
  const { t } = useTranslation();
  const updateStatusMutation = useUpdateReservationStatus();
  const cancelMutation = useCancelReservation();
  const confirmMutation = useConfirmReservation();

  const handleView = useCallback((reservation: Reservation) => onViewReservation?.(reservation), [onViewReservation]);

  const handleCancel = useCallback(
    (reservation: Reservation) => {
      if (reservation.id) cancelMutation.mutate(reservation.id);
    },
    [cancelMutation]
  );

  const handleConfirm = useCallback(
    (reservation: Reservation) => {
      if (reservation.id) confirmMutation.mutate(reservation.id);
    },
    [confirmMutation]
  );

  const updateStatus = useCallback(
    (id: number, status: ReservationStatusEnum) => {
      updateStatusMutation.mutate({ id, status });
    },
    [updateStatusMutation]
  );

  const columns = useMemo(
    () =>
      getColumns(
        t,
        handleView,
        handleCancel,
        handleConfirm,
        cancelMutation.isPending,
        confirmMutation.isPending,
        updateStatus
      ),
    [t, handleView, handleCancel, handleConfirm, cancelMutation.isPending, confirmMutation.isPending, updateStatus]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <MaterialReactTable
        {...mrtTableProps}
        columns={columns}
        data={data}
        renderTopToolbarCustomActions={() =>
          title ? (
            <Typography variant="subtitle1" sx={{ fontWeight: 600, alignSelf: 'center', pl: 1 }}>
              {title}
            </Typography>
          ) : null
        }
        state={{ isLoading: loading }}
        initialState={{ pagination: { pageIndex: 0, pageSize: 15 }, density: 'compact' }}
        muiToolbarAlertBannerProps={loading ? { color: 'info', children: t(Labels.common_loading) } : undefined}
        renderEmptyRowsFallback={() => (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <span>{t(Labels.reservation_no_data)}</span>
          </Box>
        )}
      />
    </Box>
  );
}
