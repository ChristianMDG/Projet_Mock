import { useTranslation } from 'react-i18next';
import { Box, Switch, FormControlLabel, IconButton, Tooltip, TextField, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Route } from '@/api/route.api';
import { mrtTableProps } from '@/components/shared';
import Labels from '@/labelKeys.json';

interface RouteListProps {
  routes: Route[];
  onUpdateRoute: (route: Partial<Route>) => Promise<void>;
  onToggleStatus: (route: Route) => Promise<void>;
  onEditRoute?: (route: Route) => void;
  title?: string;
}

function getColumns(
  t: (key: string) => string,
  onToggleStatus: (route: Route) => void,
  onEditRoute?: (route: Route) => void,
  onUpdateRoute?: (route: Partial<Route>) => Promise<void>
): MRT_ColumnDef<Route>[] {
  return [
    {
      header: t(Labels.route_col_actions),
      id: 'actions',
      size: 80,
      grow: false,
      enableColumnFilter: false,
      enableSorting: false,
      enableResizing: false,
      muiTableBodyCellProps: { align: 'center', sx: { justifyContent: 'center', display: 'flex' } },
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Tooltip title={t(Labels.route_edit_title)}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEditRoute?.(row.original)}
              sx={{
                p: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      header: t(Labels.route_col_name),
      accessorKey: 'name',
      size: 350,
      Cell: ({ cell }) => cell.getValue<string>() ?? '-',
    },
    {
      header: t(Labels.route_col_destination),
      id: 'destination',
      size: 250,
      accessorFn: (row) => {
        if (row.arrivalGare) {
          const gare = row.arrivalGare;
          const gareName = gare.name ?? t(Labels.common_na);
          const villeName = gare.ville?.name ?? '';
          return villeName ? `${gareName} (${villeName})` : gareName;
        }
        return '-';
      },
    },
    {
      header: t(Labels.route_col_duration),
      id: 'duration',
      size: 150,
      accessorFn: (row) => {
        const hours = row.estimatedDurationHours;
        const km = row.distanceKm;
        if (hours == null && km == null) return '-';
        if (hours == null) return `${km} km`;
        if (km == null) return `${hours} h`;
        return `${hours} h | ${km} km`;
      },
    },
    {
      header: t(Labels.route_col_price_base),
      accessorKey: 'fraisTaxibrousse',
      size: 170,
      enableColumnFilter: false,
      Cell: ({ cell, row }) => (
        <TextField
          variant="standard"
          type="number"
          value={cell.getValue<number>() ?? ''}
          onChange={async (e) => {
            const value = Number(e.target.value);
            if (onUpdateRoute && value !== row.original.fraisTaxibrousse) {
              await onUpdateRoute({ id: row.original.id, fraisTaxibrousse: value });
            }
          }}
          slotProps={{
            input: {
              endAdornment: <span style={{ marginLeft: 4 }}>Ar</span>,
              style: { fontWeight: 500, textAlign: 'right' },
            },
          }}
          sx={{ width: 90 }}
        />
      ),
    },
    {
      header: t(Labels.route_col_price_kop),
      accessorKey: 'fraisKoperative',
      size: 170,
      enableColumnFilter: false,
      Cell: ({ cell, row }) => (
        <TextField
          variant="standard"
          type="number"
          value={cell.getValue<number>() ?? ''}
          onChange={async (e) => {
            const value = Number(e.target.value);
            if (onUpdateRoute && value !== row.original.fraisKoperative) {
              await onUpdateRoute({ id: row.original.id, fraisKoperative: value });
            }
          }}
          slotProps={{
            input: {
              endAdornment: <span style={{ marginLeft: 4 }}>Ar</span>,
              style: { fontWeight: 500, textAlign: 'right' },
            },
          }}
          sx={{ width: 90 }}
        />
      ),
    },
    {
      header: t(Labels.route_col_status),
      accessorKey: 'isActive',
      size: 170,
      enableColumnFilter: false,
      Cell: ({ cell, row }) => (
        <FormControlLabel
          control={
            <Switch
              checked={!!cell.getValue()}
              onChange={() => onToggleStatus(row.original)}
              size="small"
              color="success"
            />
          }
          label={cell.getValue() ? t(Labels.route_edit_status_active) : t(Labels.route_edit_status_inactive)}
          sx={{ mr: 1, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
        />
      ),
    },
  ];
}

export default function RouteList({ routes, onUpdateRoute, onToggleStatus, onEditRoute, title }: RouteListProps) {
  const { t } = useTranslation();

  const columns = getColumns(t, onToggleStatus, onEditRoute, onUpdateRoute);

  return (
    <Box sx={{ width: '100%' }}>
      <MaterialReactTable
        {...mrtTableProps}
        columns={columns}
        data={routes}
        initialState={{ density: 'compact', pagination: { pageIndex: 0, pageSize: 15 } }}
        renderTopToolbarCustomActions={() =>
          title ? (
            <Typography variant="subtitle1" sx={{ fontWeight: 600, alignSelf: 'center', pl: 1 }}>
              {title}
            </Typography>
          ) : null
        }
        renderEmptyRowsFallback={() => (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <span>{t(Labels.route_no_data)}</span>
          </Box>
        )}
      />
    </Box>
  );
}
