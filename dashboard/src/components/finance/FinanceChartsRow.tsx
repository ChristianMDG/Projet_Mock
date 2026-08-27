import { useMemo } from 'react';
import { Grid, Card, CardContent, Box, Skeleton, Typography } from '@mui/material';
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from '@/components/shared';
import { paletteTokens } from '@/themes/appTheme';
import { useFinanceCharts } from '@/hooks/finance.hook';
import { useFinanceStore } from '@/stores/finance.store';
import Labels from '@/labelKeys.json';

const TX_STATUS_COLORS: Record<string, string> = {
  COMPLETED: paletteTokens.success,
  FAILED: paletteTokens.error,
  CANCELLED: paletteTokens.grey,
  TIMEOUT: paletteTokens.warning,
  INITIATED: paletteTokens.infoDark,
  PENDING_OTP: paletteTokens.indigo,
  OTP_VERIFIED: paletteTokens.teal,
  PROCESSING: paletteTokens.purple,
};

const TX_STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Complétée',
  FAILED: 'Échouée',
  CANCELLED: 'Annulée',
  TIMEOUT: 'Timeout',
  INITIATED: 'Initiée',
  PENDING_OTP: 'OTP en attente',
  OTP_VERIFIED: 'OTP vérifié',
  PROCESSING: 'En traitement',
};

export function FinanceChartsRow() {
  const { t } = useTranslation();
  const { getParams } = useFinanceStore();
  const { data: stats, isLoading } = useFinanceCharts(getParams());

  const operatorNames = useMemo(() => Object.keys(stats?.operatorBreakdown ?? {}), [stats]);
  const operatorAmounts = useMemo(() => Object.values(stats?.operatorBreakdown ?? {}), [stats]);

  const pieData = useMemo(
    () =>
      Object.entries(stats?.paymentStatusDistribution ?? {}).map(([status, count]) => ({
        id: status,
        value: count,
        label: TX_STATUS_LABELS[status] ?? status,
        color: TX_STATUS_COLORS[status] ?? paletteTokens.grey,
      })),
    [stats]
  );

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* Operator Breakdown */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Card sx={{ borderRadius: 2.5, height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <SectionHeader
              icon={<BarChartIcon fontSize="small" />}
              title={t(Labels.finance_chart_operator_title)}
              subtitle={t(Labels.finance_chart_operator_subtitle)}
              size="small"
            />
            <Box sx={{ mt: 2 }}>
              {isLoading ? (
                <Skeleton variant="rounded" height={280} />
              ) : operatorNames.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: operatorNames }]}
                  series={[
                    {
                      data: operatorAmounts,
                      label: t(Labels.finance_chart_operator_series),
                      color: paletteTokens.teal,
                    },
                  ]}
                  height={300}
                  borderRadius={6}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                  {t(Labels.finance_chart_operator_empty)}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Payment Status Distribution */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Card sx={{ borderRadius: 2.5, height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <SectionHeader
              icon={<PieChartIcon fontSize="small" />}
              title={t(Labels.finance_chart_status_title)}
              subtitle={t(Labels.finance_chart_status_subtitle)}
              size="small"
            />
            <Box sx={{ mt: 2 }}>
              {isLoading ? (
                <Skeleton variant="circular" width={240} height={240} sx={{ mx: 'auto' }} />
              ) : pieData.length > 0 ? (
                <PieChart
                  series={[
                    {
                      data: pieData,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      innerRadius: 50,
                      outerRadius: 100,
                      paddingAngle: 3,
                      cornerRadius: 5,
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
                  {t(Labels.finance_chart_status_empty)}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
