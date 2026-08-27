import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Alert,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ManageAccounts, CheckCircle, Cancel, ShowChart, Wifi } from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { OperateurFilter, OperateurTable } from '@/components/operateur';
import { SectionHeader, StatCard } from '@/components/shared';
import { useOperateurs } from '@/hooks/operateur.hook';
import { useDailyConnections, useUserStatistics } from '@/hooks/user-statistics.hook';
import { useOperateurStore } from '@/stores/operateur.store';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

export default function OperateurPage() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [period, setPeriod] = useState(7);
  const { data, isFetching, error } = useOperateurs(pagination.pageIndex, pagination.pageSize);
  const { data: dailyData, isLoading: dailyLoading } = useDailyConnections(period);
  const { data: stats } = useUserStatistics();
  const { filters, resetFilters } = useOperateurStore();

  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

  // Reset page on filter change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters]);

  const pagedData = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // We can't know the exact active/inactive across all pages with server-side filtering,
  // but if the user wants stat cards, we'd either need another API call or just show the total.
  // We'll leave them as 0 for now since we're using server-side pagination, or compute from current page.
  const totalActive = pagedData.filter((o) => o.isActive).length;
  const totalInactive = pagedData.filter((o) => !o.isActive).length;

  const statItems = [
    {
      icon: <CheckCircle fontSize="small" />,
      label: t(Labels.operateur_active),
      value: String(totalActive),
      color: paletteTokens.success,
    },
    {
      icon: <Cancel fontSize="small" />,
      label: t(Labels.operateur_inactive),
      value: String(totalInactive),
      color: paletteTokens.grey,
    },
    {
      icon: <Wifi fontSize="small" />,
      label: t(Labels.user_connected),
      value: String(stats?.connectedGuichetUsers ?? 0),
      color: paletteTokens.teal,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <SectionHeader
          icon={<ManageAccounts />}
          title={t(Labels.operateur_management_title)}
          subtitle={t(Labels.operateur_management_subtitle)}
          size="small"
        />
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statItems.map((item) => (
          <Grid key={item.label} size={{ xs: 6, md: 3 }}>
            <StatCard icon={item.icon} label={item.label} value={item.value} color={item.color} loading={isFetching} />
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
                  data: (dailyData ?? []).map((d) => d.uniqueGuichetConnections),
                  label: t(Labels.user_daily_unique_senders),
                  color: paletteTokens.teal,
                  area: true,
                },
                {
                  data: (dailyData ?? []).map((d) => d.totalGuichetConnections),
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
      {stats && stats.connectedGuichetUsers > 0 && (
        <Card sx={{ mb: 3, borderRadius: 2.5 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Wifi sx={{ color: paletteTokens.teal }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t(Labels.user_connected_users)} ({stats.connectedGuichetUsers})
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              {stats.connectedGuichetUsernames.map((username) => (
                <Chip key={username} label={username} size="small" color="primary" variant="outlined" icon={<Wifi />} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof Error ? error.message : t(Labels.operateur_error)}
        </Alert>
      )}

      {/* Content */}
      <Paper sx={{ p: 3, position: 'relative', borderRadius: 2.5 }}>
        {isFetching && (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '10px 10px 0 0' }} />
        )}
        <OperateurFilter />
        <OperateurTable
          data={pagedData}
          loading={isFetching}
          title={t(Labels.operateur_management_title)}
          pagination={pagination}
          onPaginationChange={setPagination}
          rowCount={totalElements}
        />
      </Paper>
    </Box>
  );
}
