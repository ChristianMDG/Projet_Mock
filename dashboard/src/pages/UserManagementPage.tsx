import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  People,
  Search,
  Wifi,
  CheckCircle,
  Cancel,
  Refresh,
  ToggleOn,
  ToggleOff,
  ShowChart,
} from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { SectionHeader, StatCard, StyledIcon, mrtTableProps } from '@/components/shared';
import {
  useUserStatistics,
  useVoyageurs,
  useToggleVoyageurStatus,
  useDailyConnections,
} from '@/hooks/user-statistics.hook';
import type { Voyageur } from '@/types/voyageur.types';
import { paletteTokens } from '@/themes/appTheme';
import { formatDateCustom } from '@/utils/format';
import Labels from '@/labelKeys.json';

const formatDateTime = (dateStr?: string) => formatDateCustom(dateStr, 'DD MMM YYYY HH:mm');

export default function UserManagementPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [period, setPeriod] = useState(7);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useUserStatistics();
  const { data: dailyData, isLoading: dailyLoading } = useDailyConnections(period);
  const {
    data: voyageursData,
    isLoading: voyageursLoading,
    error: voyageursError,
  } = useVoyageurs(pagination.pageIndex, pagination.pageSize, search, statusFilter);
  const toggleStatus = useToggleVoyageurStatus();

  const handleToggleStatus = useCallback(
    (id: number) => {
      toggleStatus.mutate(id);
    },
    [toggleStatus]
  );

  const columns = useMemo<MRT_ColumnDef<Voyageur>[]>(
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
        header: t(Labels.user_name),
        accessorFn: (row) => `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim(),
        id: 'fullName',
        size: 250,
      },
      {
        header: t(Labels.user_phone),
        accessorKey: 'phone',
        size: 200,
      },
      {
        header: t(Labels.user_email),
        accessorKey: 'email',
        size: 350,
      },
      {
        header: t(Labels.user_created),
        accessorKey: 'createdAt',
        size: 200,
        Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
        enableColumnFilter: false,
      },
      {
        header: t(Labels.user_status),
        accessorKey: 'isActive',
        size: 150,
        Cell: ({ cell }) => {
          const isActive = cell.getValue<boolean>();
          return (
            <Chip
              label={isActive ? t(Labels.user_active) : t(Labels.user_inactive)}
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
        header: t(Labels.user_actions),
        id: 'actions',
        size: 150,
        Cell: ({ row }) => (
          <Tooltip title={row.original.isActive ? t(Labels.user_deactivate) : t(Labels.user_activate)}>
            <IconButton
              size="small"
              onClick={() => handleToggleStatus(row.original.id)}
              disabled={toggleStatus.isPending}
            >
              {row.original.isActive ? <ToggleOff /> : <ToggleOn />}
            </IconButton>
          </Tooltip>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [t, handleToggleStatus, toggleStatus.isPending]
  );

  const statCards = [
    {
      icon: <People fontSize="small" />,
      label: t(Labels.user_total),
      value: String(stats?.totalVoyageurs ?? 0),
      color: paletteTokens.indigo,
    },
    {
      icon: <CheckCircle fontSize="small" />,
      label: t(Labels.user_active),
      value: String(stats?.activeVoyageurs ?? 0),
      color: paletteTokens.success,
    },
    {
      icon: <Cancel fontSize="small" />,
      label: t(Labels.user_inactive),
      value: String(stats?.inactiveVoyageurs ?? 0),
      color: paletteTokens.grey,
    },
    {
      icon: <Wifi fontSize="small" />,
      label: t(Labels.user_connected),
      value: String(stats?.connectedWebSocketUsers ?? 0),
      color: paletteTokens.teal,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionHeader
          icon={<People />}
          title={t(Labels.user_management_title)}
          subtitle={t(Labels.user_management_subtitle)}
        />
        <Stack direction="row" spacing={1}>
          <Tooltip title={t(Labels.user_refresh)}>
            <IconButton onClick={() => refetchStats()} disabled={statsLoading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid key={card.label} size={{ xs: 6, md: 3 }}>
            <StatCard
              icon={card.icon}
              label={card.label}
              value={card.value}
              color={card.color}
              loading={statsLoading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Daily Connections Chart */}
      <Card sx={{ mb: 3, borderRadius: 2.5 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <SectionHeader
              icon={<ShowChart fontSize="small" />}
              title={t(Labels.user_daily_connections_title)}
              subtitle={t(Labels.user_daily_connections_subtitle)}
              size="small"
            />
            <Stack direction="row" spacing={1}>
              <Chip
                label={t(Labels.user_daily_period_7)}
                size="small"
                variant={period === 7 ? 'filled' : 'outlined'}
                color={period === 7 ? 'primary' : 'default'}
                onClick={() => setPeriod(7)}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label={t(Labels.user_daily_period_30)}
                size="small"
                variant={period === 30 ? 'filled' : 'outlined'}
                color={period === 30 ? 'primary' : 'default'}
                onClick={() => setPeriod(30)}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
          </Box>
          {dailyLoading ? (
            <Skeleton variant="rounded" height={240} />
          ) : (
            <LineChart
              xAxis={[{ scaleType: 'point', data: (dailyData ?? []).map((d) => d.date.slice(5)) }]}
              series={[
                {
                  data: (dailyData ?? []).map((d) => d.uniqueSenderIds),
                  label: t(Labels.user_daily_unique_senders),
                  color: paletteTokens.teal,
                  area: true,
                },
                {
                  data: (dailyData ?? []).map((d) => d.totalConnections),
                  label: t(Labels.user_daily_total_connections),
                  color: paletteTokens.indigo,
                },
              ]}
              height={260}
              sx={{ '.MuiAreaElement-root': { opacity: 0.15 } }}
            />
          )}
        </CardContent>
      </Card>

      {/* Connected Users Panel */}
      {stats && stats.connectedWebSocketUsers > 0 && (
        <Card sx={{ mb: 3, borderRadius: 2.5 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Wifi sx={{ color: paletteTokens.teal }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t(Labels.user_connected_users)} ({stats.connectedWebSocketUsers})
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              {stats.connectedUsernames.map((username) => (
                <Chip key={username} label={username} size="small" color="primary" variant="outlined" icon={<Wifi />} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 'grow' }}>
            <TextField
              placeholder={t(Labels.user_search_placeholder)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <StyledIcon icon={Search} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 'auto' }}>
            <Stack direction="row" spacing={1}>
              <Chip
                label={t(Labels.user_filter_all)}
                variant={statusFilter === undefined ? 'filled' : 'outlined'}
                color={statusFilter === undefined ? 'primary' : 'default'}
                onClick={() => setStatusFilter(undefined)}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label={t(Labels.user_active)}
                variant={statusFilter === true ? 'filled' : 'outlined'}
                color={statusFilter === true ? 'success' : 'default'}
                onClick={() => setStatusFilter(true)}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label={t(Labels.user_inactive)}
                variant={statusFilter === false ? 'filled' : 'outlined'}
                color={statusFilter === false ? 'default' : 'default'}
                onClick={() => setStatusFilter(false)}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {voyageursError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {voyageursError instanceof Error ? voyageursError.message : 'Erreur lors du chargement'}
        </Alert>
      )}

      {/* Users Table */}
      <Box sx={{ width: '100%' }}>
        <MaterialReactTable
          {...mrtTableProps}
          columns={columns}
          data={voyageursData?.content ?? []}
          state={{ isLoading: voyageursLoading, pagination }}
          initialState={{ density: 'compact' }}
          onPaginationChange={setPagination}
          rowCount={voyageursData?.totalElements ?? 0}
          manualPagination
          renderTopToolbarCustomActions={() => (
            <Typography variant="subtitle1" sx={{ fontWeight: 600, alignSelf: 'center', pl: 1 }}>
              {t(Labels.user_management_title)}
            </Typography>
          )}
          muiToolbarAlertBannerProps={voyageursError ? { color: 'error', children: t(Labels.user_loading) } : undefined}
          renderEmptyRowsFallback={() => (
            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}
            >
              <span>{t(Labels.user_no_data)}</span>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
