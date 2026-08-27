import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef, type MRT_PaginationState } from 'material-react-table';
import type { Commission } from '@/models';
import type { Koperative } from '@/types/koperative.types';
import { mrtTableProps } from '@/components/shared';
import CommissionActions from './CommissionActions';
import { formatCurrency } from '@/utils/format';
import Labels from '@/labelKeys.json';

interface CommissionTableProps {
  readonly data: Commission[];
  readonly loading?: boolean;
  readonly onEdit?: (commission: Commission) => void;
  readonly onDelete?: (commission: Commission) => void;
  readonly title?: string;
  readonly pagination: MRT_PaginationState;
  readonly onPaginationChange: (
    updater: MRT_PaginationState | ((old: MRT_PaginationState) => MRT_PaginationState)
  ) => void;
  readonly rowCount?: number;
  readonly koperativeMap?: Record<number, Koperative>;
  readonly isMutating?: boolean;
}

function getColumns(
  t: (key: string) => string,
  koperativeMap: Record<number, Koperative>,
  handleEdit: (commission: Commission) => void,
  handleDelete: (commission: Commission) => void,
  isMutating?: boolean
): MRT_ColumnDef<Commission>[] {
  return [
    {
      header: t(Labels.commission_col_id),
      accessorKey: 'id',
      size: 80,
    },
    {
      header: t(Labels.commission_col_koperative),
      accessorFn: (row) =>
        row.koperativeId
          ? (koperativeMap[row.koperativeId]?.name ?? `ID ${row.koperativeId}`)
          : t(Labels.commission_all_koperatives),
      id: 'koperative',
      size: 200,
    },
    {
      header: t(Labels.commission_col_min_amount),
      accessorKey: 'minAmount',
      size: 150,
      Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
    },
    {
      header: t(Labels.commission_col_max_amount),
      accessorKey: 'maxAmount',
      size: 150,
      Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
    },
    {
      header: t(Labels.commission_col_frais),
      accessorKey: 'frais',
      size: 150,
      Cell: ({ cell }) => (
        <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {formatCurrency(cell.getValue<number>())}
        </Box>
      ),
    },
    {
      header: t(Labels.common_actions),
      id: 'actions',
      size: 100,
      grow: false,
      enableColumnFilter: false,
      enableSorting: false,
      enableResizing: false,
      muiTableBodyCellProps: { align: 'center', sx: { justifyContent: 'center', display: 'flex' } },
      muiTableHeadCellProps: { align: 'center', sx: { justifyContent: 'center', display: 'flex' } },
      Cell: ({ row }) => (
        <CommissionActions
          commission={row.original}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isMutating={isMutating}
        />
      ),
    },
  ];
}

export default function CommissionTable({
  data,
  loading = false,
  onEdit,
  onDelete,
  title,
  pagination,
  onPaginationChange,
  rowCount,
  koperativeMap = {},
  isMutating = false,
}: Readonly<CommissionTableProps>) {
  const { t } = useTranslation();

  const handleEdit = useCallback(
    (commission: Commission) => {
      onEdit?.(commission);
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    (commission: Commission) => {
      onDelete?.(commission);
    },
    [onDelete]
  );

  const columns = useMemo(
    () => getColumns(t, koperativeMap, handleEdit, handleDelete, isMutating),
    [t, koperativeMap, handleEdit, handleDelete, isMutating]
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
            <span>{t(Labels.commission_no_data)}</span>
          </Box>
        )}
      />
    </Box>
  );
}
