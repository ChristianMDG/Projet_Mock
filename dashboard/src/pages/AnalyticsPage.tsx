import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, Card, CardContent, Grid, Skeleton, Stack, alpha, Divider } from '@mui/material';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  AccountBalance,
  BarChart as BarChartIcon,
  DirectionsBus,
  People,
  Timeline,
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { SectionHeader, MetricCard, GaugeCard, StatusExplorationList, RouteExplorationList } from '@/components/shared';
import { useDashboardStats } from '@/hooks/dashboard.hook';
import { ReservationStatusEnum, ReservationStatusLabels } from '@/types/reservation.types';
import { VoyageStatusLabels } from '@/types/voyage.types';
import type { VoyageStatusEnum } from '@/types/voyage.types';
import { formatCurrency } from '@/utils/format';
import { resStatusColors, voyStatusColors } from '@/utils/statusColors';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useDashboardStats();

  const resPieData = useMemo(
    () =>
      Object.entries(stats?.reservationStatusDistribution ?? {}).map(([s, v]) => ({
        id: s,
        value: v,
        label: t(ReservationStatusLabels[s as ReservationStatusEnum] ?? s),
        color: resStatusColors[s] ?? paletteTokens.grey,
      })),
    [stats]
  );

  const voyPieData = useMemo(
    () =>
      Object.entries(stats?.voyageStatusDistribution ?? {}).map(([s, v]) => ({
        id: s,
        value: v,
        label: t(VoyageStatusLabels[s as VoyageStatusEnum] ?? s),
        color: voyStatusColors[s] ?? paletteTokens.grey,
      })),
    [stats]
  );

  const routeNames = useMemo(() => (stats?.routeStats ?? []).map((r) => r.name), [stats]);
  const routeCounts = useMemo(() => (stats?.routeStats ?? []).map((r) => r.count), [stats]);
  const routeRevenues = useMemo(() => (stats?.routeStats ?? []).map((r) => r.revenue), [stats]);

  const avgRevenue =
    stats && stats.totalReservations > 0 ? Math.round(stats.totalRevenue / stats.totalReservations) : 0;
  const confirmRate =
    stats && stats.totalReservations > 0
      ? Math.round(((stats.confirmedCount + stats.completedCount) / stats.totalReservations) * 100)
      : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <SectionHeader
          icon={<TrendingUp />}
          title={t(Labels.analytics_title)}
          subtitle={t(Labels.analytics_subtitle)}
        />
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label={t(Labels.analytics_total_revenue)}
            value={formatCurrency(stats?.totalRevenue ?? 0)}
            color={paletteTokens.teal}
            icon={<AccountBalance sx={{ fontSize: 18 }} />}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label={t(Labels.analytics_avg_revenue)}
            value={formatCurrency(avgRevenue)}
            color={paletteTokens.infoDark}
            icon={<Timeline sx={{ fontSize: 18 }} />}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label={t(Labels.analytics_confirm_rate)}
            value={`${confirmRate}%`}
            sub={`${(stats?.confirmedCount ?? 0) + (stats?.completedCount ?? 0)} / ${stats?.totalReservations ?? 0}`}
            color={paletteTokens.warning}
            icon={<People sx={{ fontSize: 18 }} />}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label={t(Labels.home_total_voyages)}
            value={String(stats?.totalVoyages ?? 0)}
            sub={`${stats?.scheduledVoyages ?? 0} ${t(Labels.voyage_filter_scheduled).toLowerCase()}`}
            color={paletteTokens.purple}
            icon={<DirectionsBus sx={{ fontSize: 18 }} />}
            loading={isLoading}
          />
        </Grid>
      </Grid>

      {/* Pie Charts + Exploration Lists */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<PieChartIcon fontSize="small" />}
                title={t(Labels.analytics_status_distribution)}
                subtitle={t(Labels.analytics_status_subtitle)}
                size="small"
              />
              <Box sx={{ mt: 2 }}>
                {isLoading ? (
                  <Skeleton variant="circular" width={240} height={240} sx={{ mx: 'auto' }} />
                ) : resPieData.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: resPieData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        innerRadius: 50,
                        outerRadius: 110,
                        paddingAngle: 3,
                        cornerRadius: 6,
                      },
                    ]}
                    height={300}
                    slotProps={{
                      legend: {
                        direction: 'horizontal' as const,
                        position: { vertical: 'bottom' as const, horizontal: 'center' as const },
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                    {t(Labels.analytics_insufficient_data)}
                  </Typography>
                )}
              </Box>
              {!isLoading && (
                <StatusExplorationList
                  title={t(Labels.analytics_detail_list)}
                  items={resPieData}
                  total={stats?.totalReservations ?? 0}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<DirectionsBus fontSize="small" />}
                title={t(Labels.analytics_voyage_distribution)}
                subtitle={t(Labels.analytics_voyage_subtitle)}
                size="small"
              />
              <Box sx={{ mt: 2 }}>
                {isLoading ? (
                  <Skeleton variant="circular" width={240} height={240} sx={{ mx: 'auto' }} />
                ) : voyPieData.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: voyPieData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        innerRadius: 50,
                        outerRadius: 110,
                        paddingAngle: 3,
                        cornerRadius: 6,
                      },
                    ]}
                    height={300}
                    slotProps={{
                      legend: {
                        direction: 'horizontal' as const,
                        position: { vertical: 'bottom' as const, horizontal: 'center' as const },
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                    {t(Labels.analytics_insufficient_data)}
                  </Typography>
                )}
              </Box>
              {!isLoading && (
                <StatusExplorationList
                  title={t(Labels.analytics_detail_list)}
                  items={voyPieData}
                  total={stats?.totalVoyages ?? 0}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Routes Bar Chart */}
      <Card sx={{ borderRadius: 2.5, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader
            icon={<BarChartIcon fontSize="small" />}
            title={t(Labels.analytics_top_routes)}
            subtitle={t(Labels.analytics_top_routes_subtitle)}
            size="small"
          />
          <Box sx={{ mt: 2 }}>
            {isLoading ? (
              <Skeleton variant="rounded" height={320} />
            ) : routeNames.length > 0 ? (
              <BarChart
                xAxis={[{ scaleType: 'band', data: routeNames }]}
                series={[
                  { data: routeCounts, label: t(Labels.reservation_count_plural), color: paletteTokens.indigo },
                  { data: routeRevenues, label: t(Labels.home_revenue), color: paletteTokens.teal },
                ]}
                height={340}
                borderRadius={8}
              />
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                {t(Labels.analytics_insufficient_data)}
              </Typography>
            )}
          </Box>
          {!isLoading && (
            <RouteExplorationList
              title={t(Labels.analytics_route_ranking)}
              routes={stats?.routeStats ?? []}
              formatCurrency={formatCurrency}
            />
          )}
        </CardContent>
      </Card>

      {/* Detail Panels */}
      <Grid container spacing={3}>
        {/* Revenue Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <SectionHeader
                icon={<AccountBalance fontSize="small" />}
                title={t(Labels.analytics_revenue_title)}
                subtitle={t(Labels.analytics_revenue_subtitle)}
                size="small"
              />
              <Stack spacing={2.5} sx={{ mt: 2.5 }}>
                {[
                  {
                    label: t(Labels.analytics_total_revenue),
                    value: formatCurrency(stats?.totalRevenue ?? 0),
                    palette: 'success' as const,
                  },
                  {
                    label: t(Labels.analytics_avg_revenue),
                    value: formatCurrency(avgRevenue),
                    palette: 'info' as const,
                  },
                  { label: t(Labels.analytics_confirm_rate), value: `${confirmRate}%`, palette: 'warning' as const },
                ].map((item) => (
                  <Paper
                    key={item.label}
                    variant="outlined"
                    sx={(theme) => ({
                      p: 2.5,
                      borderRadius: 2,
                      background: alpha(theme.palette[item.palette].main, 0.04),
                      borderColor: alpha(theme.palette[item.palette].main, 0.2),
                    })}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                      {item.label}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 800, color: `${item.palette}.main`, fontSize: '1.4rem' }}
                    >
                      {isLoading ? <Skeleton width={140} /> : item.value}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<PieChartIcon fontSize="small" />}
                title={t(Labels.analytics_breakdown)}
                subtitle={t(Labels.analytics_breakdown_subtitle)}
                size="small"
              />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2.5, mb: 1.5, fontSize: '0.8rem' }}>
                {t(Labels.sidebar_reservations)}
              </Typography>
              <Stack spacing={1.5}>
                <GaugeCard
                  label={t(ReservationStatusLabels[ReservationStatusEnum.CONFIRMED])}
                  value={stats?.confirmedCount ?? 0}
                  total={stats?.totalReservations ?? 0}
                  color={paletteTokens.success}
                  loading={isLoading}
                />
                <GaugeCard
                  label={t(ReservationStatusLabels[ReservationStatusEnum.PENDING_PAYMENT])}
                  value={stats?.pendingCount ?? 0}
                  total={stats?.totalReservations ?? 0}
                  color={paletteTokens.warning}
                  loading={isLoading}
                />
                <GaugeCard
                  label={t(ReservationStatusLabels[ReservationStatusEnum.COMPLETED])}
                  value={stats?.completedCount ?? 0}
                  total={stats?.totalReservations ?? 0}
                  color={paletteTokens.successDark}
                  loading={isLoading}
                />
                <GaugeCard
                  label={t(Labels.reservation_action_cancel)}
                  value={stats?.cancelledCount ?? 0}
                  total={stats?.totalReservations ?? 0}
                  color={paletteTokens.error}
                  loading={isLoading}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.8rem' }}>
                {t(Labels.sidebar_voyages)}
              </Typography>
              <Stack spacing={1.5}>
                <GaugeCard
                  label={t(Labels.voyage_filter_scheduled)}
                  value={stats?.scheduledVoyages ?? 0}
                  total={stats?.totalVoyages ?? 0}
                  color={paletteTokens.infoDark}
                  loading={isLoading}
                />
                <GaugeCard
                  label={t(Labels.voyage_filter_in_progress)}
                  value={stats?.ongoingVoyages ?? 0}
                  total={stats?.totalVoyages ?? 0}
                  color={paletteTokens.warning}
                  loading={isLoading}
                />
                <GaugeCard
                  label={t(Labels.voyage_filter_completed)}
                  value={stats?.completedVoyages ?? 0}
                  total={stats?.totalVoyages ?? 0}
                  color={paletteTokens.success}
                  loading={isLoading}
                />
                <GaugeCard
                  label={t(Labels.voyage_filter_cancelled)}
                  value={stats?.cancelledVoyages ?? 0}
                  total={stats?.totalVoyages ?? 0}
                  color={paletteTokens.error}
                  loading={isLoading}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
