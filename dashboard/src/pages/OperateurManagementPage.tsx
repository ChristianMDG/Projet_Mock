import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Stack,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { ManageAccounts, CheckCircle, Cancel, LocationOn, Business, Search } from '@mui/icons-material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { SectionHeader, mrtTableProps } from '@/components/shared';
import { useOperators } from '@/hooks/operateur.hook';
import { AssignGareDialog } from '@/components/operateur/AssignGareDialog';
import { AssignKoperativesDialog } from '@/components/operateur/AssignKoperativesDialog';
import type { UserOperator } from '@/api/operateur.api';
import Labels from '@/labelKeys.json';

export default function OperateurManagementPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<UserOperator | null>(null);
  const [assignKoperativesOpen, setAssignKoperativesOpen] = useState(false);
  const [assignGareOpen, setAssignGareOpen] = useState(false);

  const { data: operators = [], isLoading, error } = useOperators(search ? { search } : undefined);

  const handleAssignGare = useCallback((operator: UserOperator) => {
    setSelectedOperator(operator);
    setAssignGareOpen(true);
  }, []);

  const handleAssignKoperatives = useCallback((operator: UserOperator) => {
    setSelectedOperator(operator);
    setAssignKoperativesOpen(true);
  }, []);

  const handleCloseDialogs = useCallback(() => {
    setAssignGareOpen(false);
    setAssignKoperativesOpen(false);
    setSelectedOperator(null);
  }, []);

  const columns = useMemo<MRT_ColumnDef<UserOperator>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        size: 80,
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
        size: 300,
      },
      {
        header: t(Labels.operateur_col_phone),
        accessorKey: 'phone',
        size: 150,
      },
      {
        header: t(Labels.operateur_col_koperative),
        accessorFn: (row) =>
          (row.assignedKoperatives ?? [])
            .map((k) => k.name)
            .filter(Boolean)
            .join(', ') || '—',
        id: 'koperatives',
        size: 300,
      },
      {
        header: t(Labels.operateur_col_gares),
        accessorFn: (row) => row.departureGare?.name ?? '—',
        id: 'gare',
        size: 200,
      },
      {
        header: t(Labels.operateur_col_status),
        accessorKey: 'isActive',
        size: 150,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<boolean>() ? t(Labels.operateur_active) : t(Labels.operateur_inactive)}
            color={cell.getValue<boolean>() ? 'success' : 'default'}
            size="small"
            icon={cell.getValue<boolean>() ? <CheckCircle /> : <Cancel />}
            sx={{ fontSize: '0.7rem', height: 24 }}
          />
        ),
        enableColumnFilter: false,
      },
      {
        header: t(Labels.operateur_col_actions),
        id: 'actions',
        size: 180,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', height: '100%' }}>
            <Tooltip title={t(Labels.operateur_assign_gare)}>
              <IconButton size="small" onClick={() => handleAssignGare(row.original)}>
                <LocationOn fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t(Labels.operateur_assign_koperatives)}>
              <IconButton size="small" onClick={() => handleAssignKoperatives(row.original)}>
                <Business fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [t, handleAssignGare, handleAssignKoperatives]
  );

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {t(Labels.operateur_error)}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionHeader
          icon={<ManageAccounts />}
          title={t(Labels.operateur_management_title)}
          subtitle={t(Labels.operateur_management_subtitle)}
        />
      </Box>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <TextField
          placeholder={t(Labels.operateur_search_placeholder)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>

      <Paper sx={{ width: '100%' }}>
        <MaterialReactTable
          {...mrtTableProps}
          columns={columns}
          data={operators}
          state={{ isLoading }}
          initialState={{ pagination: { pageIndex: 0, pageSize: 20 }, density: 'compact' }}
          renderTopToolbarCustomActions={() => (
            <Typography variant="subtitle1" sx={{ fontWeight: 600, alignSelf: 'center', pl: 1 }}>
              {t(Labels.operateur_management_title)}
            </Typography>
          )}
          muiToolbarAlertBannerProps={error ? { color: 'error', children: t(Labels.operateur_error) } : undefined}
          renderEmptyRowsFallback={() => (
            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}
            >
              <span>{t(Labels.operateur_no_data)}</span>
            </Box>
          )}
        />
      </Paper>

      <AssignGareDialog open={assignGareOpen} onClose={handleCloseDialogs} operator={selectedOperator} />
      <AssignKoperativesDialog open={assignKoperativesOpen} onClose={handleCloseDialogs} operator={selectedOperator} />
    </Box>
  );
}
