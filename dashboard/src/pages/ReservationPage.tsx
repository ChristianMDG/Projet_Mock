import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Alert, LinearProgress, Grid } from '@mui/material';
import { ConfirmationNumber, CheckCircle, HourglassEmpty, AttachMoney } from '@mui/icons-material';
import { ReservationTable, ReservationFilters } from '@/components/reservation';
import ReservationDetailDialog from '@/components/reservation/ReservationDetailDialog';
import { SectionHeader, StatCard } from '@/components/shared';
import { useReservations } from '@/hooks/reservation.hook';
import { useDashboardStats } from '@/hooks/dashboard.hook';
import { useReservationStore } from '@/stores/reservation.store';
import type { Reservation } from '@/types/reservation.types';
import { formatCurrency } from '@/utils/format';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

export default function ReservationPage() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const { data, isFetching, error } = useReservations(pagination.pageIndex, pagination.pageSize);
  const { data: statsData } = useDashboardStats();
  const { filters, resetFilters } = useReservationStore();
  const reservations = data?.content ?? [];
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Reset filters to defaults on mount (first time clicking Reservation menu)
  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

  // Reset page index when filters change to avoid showing empty pages
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters]);

  const stats = useMemo(() => {
    if (statsData) {
      const confirmed = statsData.confirmedCount + statsData.completedCount;
      const pending = statsData.pendingCount;

      return {
        total: statsData.totalReservations,
        confirmed,
        pending,
        revenue: statsData.totalRevenue,
      };
    }

    return { total: 0, confirmed: 0, pending: 0, revenue: 0 };
  }, [statsData]);

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t(Labels.reservation_error)}</Alert>
      </Box>
    );
  }

  const statItems = [
    {
      icon: <ConfirmationNumber fontSize="small" />,
      label: t(Labels.reservation_stat_total),
      value: stats.total,
      color: paletteTokens.indigo,
    },
    {
      icon: <CheckCircle fontSize="small" />,
      label: t(Labels.reservation_stat_confirmed),
      value: stats.confirmed,
      color: paletteTokens.success,
    },
    {
      icon: <HourglassEmpty fontSize="small" />,
      label: t(Labels.reservation_stat_pending),
      value: stats.pending,
      color: paletteTokens.warning,
    },
    {
      icon: <AttachMoney fontSize="small" />,
      label: t(Labels.reservation_stat_revenue),
      value: formatCurrency(stats.revenue),
      color: paletteTokens.purple,
    },
  ];

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <SectionHeader
            icon={<ConfirmationNumber />}
            title={t(Labels.reservation_title)}
            subtitle={t(Labels.reservation_subtitle)}
            size="small"
          />
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statItems.map((item) => (
            <Grid key={item.label} size={{ xs: 6, md: 3 }}>
              <StatCard icon={item.icon} label={item.label} value={item.value} color={item.color} />
            </Grid>
          ))}
        </Grid>

        {/* Content */}
        <Paper sx={{ p: 3, position: 'relative', borderRadius: 2.5 }}>
          {isFetching && (
            <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '10px 10px 0 0' }} />
          )}
          <ReservationFilters />
          <ReservationTable
            data={reservations}
            loading={isFetching}
            onViewReservation={handleViewReservation}
            title={t(Labels.reservation_title)}
            pagination={pagination}
            onPaginationChange={setPagination}
            rowCount={data?.page?.totalElements}
          />
        </Paper>
      </Box>

      {selectedReservation && (
        <ReservationDetailDialog
          reservation={selectedReservation}
          open={true}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </>
  );
}
