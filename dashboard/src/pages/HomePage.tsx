import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Button, Grid, Skeleton, Chip, Stack, Avatar, Typography, alpha } from '@mui/material';
import {
  ShoppingCart,
  QuestionAnswer,
  AltRoute,
  CheckCircle,
  HourglassTop,
  AttachMoney,
  Person,
  DirectionsBus,
  Business,
  TrendingUp,
  Wifi,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

import { SectionHeader, StatCard } from '@/components/shared';
import { useDashboardStats } from '@/hooks/dashboard.hook';
import { useReservationStore } from '@/stores/reservation.store';
import { ReservationStatusLabels } from '@/types/reservation.types';
import { VoyageStatusLabels } from '@/types/voyage.types';
import { useBatchStatus, usePauseBatch, usePlayBatch, useRunBatchNow } from '@/hooks/batch.hook';
import { PlayArrow, Pause, PlayCircleFilled } from '@mui/icons-material';
import type { ReservationStatusEnum, Reservation } from '@/types/reservation.types';
import type { VoyageStatusEnum } from '@/types/voyage.types';
import { formatCurrency } from '@/utils/format';
import { resStatusColors, voyStatusColors } from '@/utils/statusColors';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';
import { RecentReservationAccordion } from '@/components/reservation';

export default function HomePage() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useDashboardStats();

  const { data: batchStatus, isLoading: isLoadingBatch } = useBatchStatus();
  const { mutate: pauseBatch } = usePauseBatch();
  const { mutate: playBatch } = usePlayBatch();
  const { mutate: runBatchNow, isPending: isRunningBatch } = useRunBatchNow();

  const resPieData = useMemo(
    () =>
      Object.entries(stats?.reservationStatusDistribution ?? {}).map(([status, value]) => ({
        id: status,
        value,
        label: t(ReservationStatusLabels[status as ReservationStatusEnum] ?? status),
        color: resStatusColors[status] ?? paletteTokens.grey,
      })),
    [stats, t]
  );

  const voyPieData = useMemo(
    () =>
      Object.entries(stats?.voyageStatusDistribution ?? {}).map(([status, value]) => ({
        id: status,
        value,
        label: t(VoyageStatusLabels[status as VoyageStatusEnum] ?? status),
        color: voyStatusColors[status] ?? paletteTokens.grey,
      })),
    [stats, t]
  );

  const routeNames = useMemo(() => (stats?.routeStats ?? []).map((r) => r.name), [stats]);
  const routeCounts = useMemo(() => (stats?.routeStats ?? []).map((r) => r.count), [stats]);
  const routeRevenues = useMemo(() => (stats?.routeStats ?? []).map((r) => r.revenue), [stats]);

  const statCards = [
    {
      title: t(Labels.home_total_reservations),
      value: String(stats?.totalReservations ?? 0),
      icon: <ShoppingCart fontSize="small" />,
      color: paletteTokens.navyLight,
    },
    {
      title: t(Labels.home_confirmed),
      value: String(stats?.confirmedCount ?? 0),
      icon: <CheckCircle fontSize="small" />,
      color: paletteTokens.success,
    },
    {
      title: t(Labels.home_pending),
      value: String(stats?.pendingCount ?? 0),
      icon: <HourglassTop fontSize="small" />,
      color: paletteTokens.warning,
    },
    {
      title: t(Labels.home_revenue),
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: <AttachMoney fontSize="small" />,
      color: paletteTokens.teal,
    },
    {
      title: t(Labels.home_total_voyages),
      value: String(stats?.totalVoyages ?? 0),
      icon: <DirectionsBus fontSize="small" />,
      color: paletteTokens.indigo,
    },
    {
      title: t(Labels.home_scheduled_voyages),
      value: String(stats?.scheduledVoyages ?? 0),
      icon: <Person fontSize="small" />,
      color: paletteTokens.infoDark,
    },
    {
      title: t(Labels.home_total_koperatives),
      value: String(stats?.totalKoperatives ?? 0),
      icon: <Business fontSize="small" />,
      color: paletteTokens.purple,
    },
    {
      title: t(Labels.user_connected),
      value: String(stats?.connectedWebSocketUsers ?? 0),
      icon: <Wifi fontSize="small" />,
      color: paletteTokens.successDark,
    },
  ];

  const quickActions = [
    {
      title: t(Labels.sidebar_reservations),
      description: t(Labels.home_action_reservations),
      icon: <ShoppingCart />,
      path: '/reservation',
      color: paletteTokens.navyLight,
    },
    {
      title: t(Labels.sidebar_voyages),
      description: t(Labels.home_action_voyages),
      icon: <DirectionsBus />,
      path: '/voyages',
      color: paletteTokens.indigo,
    },
    {
      title: t(Labels.sidebar_routes),
      description: t(Labels.home_action_routes),
      icon: <AltRoute />,
      path: '/routes',
      color: paletteTokens.info,
    },
    {
      title: t(Labels.sidebar_messages),
      description: t(Labels.home_action_messages),
      icon: <QuestionAnswer />,
      path: '/messages',
      color: paletteTokens.teal,
    },
  ];

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <SectionHeader icon={<TrendingUp />} title={t(Labels.home_title)} subtitle={t(Labels.home_subtitle)} />
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid key={card.title} size={{ xs: 6, md: 3 }}>
            <StatCard icon={card.icon} label={card.title} value={card.value} color={card.color} loading={isLoading} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions + Recent */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Recent Reservations */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                {t(Labels.home_recent_reservations)}
              </Typography>
              <Stack spacing={1.5}>
                {isLoading
                  ? [0, 1, 2, 3, 4].map((i) => <Skeleton key={i} height={48} />)
                  : (stats?.recentReservations ?? [])
                      .slice(0, 5)
                      .map((r, index) => (
                        <RecentReservationAccordion
                          key={r.id}
                          r={r as unknown as Reservation}
                          defaultExpanded={index === 0}
                        />
                      ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                {t(Labels.home_quick_actions)}
              </Typography>
              <Stack spacing={1.5}>
                {quickActions.map((action) => (
                  <Button
                    key={action.path}
                    component={Link}
                    to={action.path}
                    variant="outlined"
                    onClick={() => {
                      if (action.path === '/reservation') {
                        useReservationStore.getState().resetFilters();
                      }
                    }}
                    sx={{
                      justifyContent: 'flex-start',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    <Avatar sx={{ width: 36, height: 36, bgcolor: action.color }}>{action.icon}</Avatar>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Reservation Pie */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<ShoppingCart fontSize="small" />}
                title={t(Labels.home_chart_reservation_status)}
                subtitle={t(Labels.home_chart_res_sub)}
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
                    height={280}
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
            </CardContent>
          </Card>
        </Grid>

        {/* Voyage Pie */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<DirectionsBus fontSize="small" />}
                title={t(Labels.home_chart_voyage_status)}
                subtitle={t(Labels.home_chart_voy_sub)}
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
                    height={280}
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Routes Bar Chart */}
      <Card sx={{ borderRadius: 2.5, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader
            icon={<AltRoute fontSize="small" />}
            title={t(Labels.analytics_top_routes)}
            subtitle={t(Labels.analytics_top_routes_subtitle)}
            size="small"
          />
          <Box sx={{ mt: 2 }}>
            {isLoading ? (
              <Skeleton variant="rounded" height={280} />
            ) : routeNames.length > 0 ? (
              <BarChart
                xAxis={[{ scaleType: 'band', data: routeNames }]}
                series={[
                  { data: routeCounts, label: t(Labels.reservation_count_plural), color: paletteTokens.indigo },
                  { data: routeRevenues, label: t(Labels.home_revenue), color: paletteTokens.teal },
                ]}
                height={300}
                borderRadius={8}
              />
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                {t(Labels.analytics_insufficient_data)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Admin Operations */}
      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 2.5, bgcolor: alpha(paletteTokens.indigo, 0.05) }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <CheckCircle fontSize="small" color="primary" />
                {t(Labels.home_batch_title)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t(Labels.home_batch_desc)}
              </Typography>

              {isLoadingBatch ? (
                <Skeleton variant="rectangular" height={50} width={300} />
              ) : (
                <Stack direction="row" spacing={2} alignItems="center">
                  {batchStatus?.enabled ? (
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<Pause />}
                      onClick={() => pauseBatch()}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      {t(Labels.home_batch_pause)}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<PlayArrow />}
                      onClick={() => playBatch()}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      {t(Labels.home_batch_start)}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<PlayCircleFilled />}
                    onClick={() => runBatchNow()}
                    disabled={isRunningBatch}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    {t(Labels.home_batch_run_now)}
                  </Button>

                  <Chip
                    label={
                      batchStatus?.enabled ? t(Labels.home_batch_status_active) : t(Labels.home_batch_status_paused)
                    }
                    color={batchStatus?.enabled ? 'success' : 'warning'}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
