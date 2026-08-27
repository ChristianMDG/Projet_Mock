import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Select, MenuItem, Chip, alpha } from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef, type MRT_PaginationState } from 'material-react-table';
import type { Reservation, ReservationStatusEnum } from '@/types/reservation.types';
import { ReservationStatusLabels, PaymentStatusLabels } from '@/types/reservation.types';
import { useUpdateReservationStatus, useCancelReservation, useConfirmReservation } from '@/hooks/reservation.hook';
import { resStatusColors, payStatusColors } from '@/utils/statusColors';
import ReservationActions from './ReservationActions';
import { mrtTableProps } from '@/components/shared';
import { formatDateCustom, formatCurrency } from '@/utils/format';
import Labels from '@/labelKeys.json';

interface ReservationTableProps {
  data: Reservation[];
  loading?: boolean;
  onViewReservation?: (reservation: Reservation) => void;
  title?: string;
  pagination: MRT_PaginationState;
  onPaginationChange: (updater: MRT_PaginationState | ((old: MRT_PaginationState) => MRT_PaginationState)) => void;
  rowCount?: number;
}

const formatDateTime = (dateStr?: string) => formatDateCustom(dateStr, 'DD MMM YYYY HH:mm');

interface SeatsCellProps {
  readonly reservation: Reservation;
}

function SeatsCell({ reservation }: SeatsCellProps) {
  const seatCount = reservation.seatCount ?? reservation.seats?.length ?? 0;

  return (
    <Box component="span" sx={{ display: 'block', textAlign: 'center' }}>
      {seatCount}
    </Box>
  );
}

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
      size: 140,
      Cell: ({ cell }) => (
        <Box
          component="span"
          sx={(theme) => ({
            fontFamily: 'monospace',
            fontWeight: 600,
            fontSize: '0.78rem',
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            color: 'primary.main',
            letterSpacing: '0.02em',
          })}
        >
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
      header: t(Labels.reservation_col_koperative),
      accessorFn: (row) => row.voyage?.koperative?.name ?? '-',
      id: 'koperative',
      size: 150,
    },
    {
      header: t(Labels.reservation_col_route),
      accessorFn: (row) => {
        const v = row.voyage;
        const dep = v?.departureGare?.ville?.name ?? v?.departureCity;
        const arr = v?.arrivalGare?.ville?.name ?? v?.arrivalCity;
        if (dep || arr) {
          return `${dep ?? '?'} → ${arr ?? '?'}`;
        }
        return '-';
      },
      id: 'route',
      size: 180,
    },
    {
      header: t(Labels.reservation_col_date),
      accessorKey: 'bookingDate',
      size: 160,
      Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
    },
    {
      header: t(Labels.reservation_departure_date),
      accessorFn: (row) => row.voyage?.departureTime,
      id: 'departureTime',
      size: 160,
      Cell: ({ cell }) => {
        const val = cell.getValue<string>();
        return val ? formatDateTime(val) : '-';
      },
    },
    {
      header: t(Labels.reservation_col_seats),
      accessorFn: (row) => row.seatCount ?? row.seats?.length ?? 0,
      id: 'seats',
      size: 90,
      Cell: ({ row }) => <SeatsCell reservation={row.original} />,
    },
    {
      header: t(Labels.reservation_col_amount),
      accessorKey: 'totalAmount',
      size: 130,
      Cell: ({ cell }) => {
        const value = cell.getValue<number>();
        return value ? formatCurrency(value) : '-';
      },
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
          <Chip
            label={t(PaymentStatusLabels[value as keyof typeof PaymentStatusLabels])}
            size="small"
            variant="outlined"
            sx={{
              color: payStatusColors[value],
              borderColor: payStatusColors[value],
              fontWeight: 500,
              fontSize: '0.72rem',
            }}
          />
        ) : (
          '-'
        );
      },
    },
    {
      header: t(Labels.common_actions),
      id: 'actions',
      size: 160,
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

export default function ReservationTable({
  data,
  loading = false,
  onViewReservation,
  title,
  pagination,
  onPaginationChange,
  rowCount,
}: Readonly<ReservationTableProps>) {
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
        manualPagination
        rowCount={rowCount ?? 0}
        onPaginationChange={onPaginationChange}
        enablePagination
        muiPaginationProps={{
          showRowsPerPage: false,
        }}
        renderTopToolbarCustomActions={() =>
          title ? (
            <Typography variant="subtitle1" sx={{ fontWeight: 600, alignSelf: 'center', pl: 1 }}>
              {title}
            </Typography>
          ) : null
        }
        state={{
          isLoading: loading,
          pagination,
        }}
        initialState={{ density: 'compact' }}
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
