import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Chip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { MaterialReactTable, type MRT_ColumnDef, type MRT_PaginationState } from 'material-react-table';
import type { UserOperator } from '@/types/operateur.types';
import { mrtTableProps, StyledSwitch, PhoneLink } from '@/components/shared';
import { useUpdateOperateur } from '@/hooks/operateur.hook';
import Labels from '@/labelKeys.json';

interface OperateurTableProps {
  data: UserOperator[];
  loading?: boolean;
  title?: string;
  pagination: MRT_PaginationState;
  onPaginationChange: (updater: MRT_PaginationState | ((old: MRT_PaginationState) => MRT_PaginationState)) => void;
  rowCount?: number;
}

function getColumns(
  t: (key: string) => string,
  onUpdateStatus: (operator: UserOperator) => void
): MRT_ColumnDef<UserOperator>[] {
  const columns: MRT_ColumnDef<UserOperator>[] = [
    {
      header: 'ID',
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
      header: t(Labels.operateur_col_name),
      accessorFn: (row) => `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim(),
      id: 'fullName',
      size: 200,
    },
    {
      header: t(Labels.operateur_col_phone),
      accessorKey: 'phone',
      size: 150,
      Cell: ({ cell }) => <PhoneLink phone={cell.getValue<string>()} />,
    },
    {
      header: t(Labels.user_email),
      accessorKey: 'email',
      size: 240,
      Cell: ({ cell }) => cell.getValue<string>() ?? '-',
    },
    {
      header: t(Labels.operateur_col_koperative),
      accessorFn: (row) => row.koperative?.name ?? '-',
      id: 'koperative',
      size: 180,
    },
    {
      header: t(Labels.operateur_col_gares),
      accessorFn: (row) => row.departureGare?.name ?? '-',
      id: 'departureGare',
      size: 180,
    },
    {
      header: t(Labels.operateur_col_status),
      accessorKey: 'isActive',
      size: 130,
      Cell: ({ cell }) => {
        const isActive = cell.getValue<boolean>();
        return (
          <Chip
            label={isActive ? t(Labels.operateur_active) : t(Labels.operateur_inactive)}
            color={isActive ? 'success' : 'default'}
            size="small"
            icon={isActive ? <CheckCircle /> : <Cancel />}
            sx={{ fontSize: '0.7rem', height: 24 }}
          />
        );
      },
      enableColumnFilter: false,
    },
    {
      header: 'Action',
      id: 'actions',
      size: 100,
      Cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <StyledSwitch
            checked={isActive ?? false}
            onChange={() => onUpdateStatus(row.original)}
            size="small"
            color={isActive ? 'success' : 'default'}
          />
        );
      },
      enableColumnFilter: false,
    },
  ];

  return columns;
}

export default function OperateurTable({
  data,
  loading = false,
  title,
  pagination,
  onPaginationChange,
  rowCount,
}: Readonly<OperateurTableProps>) {
  const { t } = useTranslation();
  const { mutate: updateOperateur } = useUpdateOperateur();

  const handleUpdateStatus = (operator: UserOperator) => {
    updateOperateur({ id: operator.id!, operator: { ...operator, isActive: !operator.isActive } });
  };

  const columns = useMemo(() => getColumns(t, handleUpdateStatus), [t]);

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
            <span>{t(Labels.operateur_no_data)}</span>
          </Box>
        )}
      />
    </Box>
  );
}
