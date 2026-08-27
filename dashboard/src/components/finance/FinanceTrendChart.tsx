import { useMemo } from 'react';
import { Card, CardContent, Box, Skeleton, Typography } from '@mui/material';
import { Timeline } from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from '@/components/shared';
import { paletteTokens } from '@/themes/appTheme';
import { useFinanceTrend } from '@/hooks/finance.hook';
import { useFinanceStore } from '@/stores/finance.store';
import Labels from '@/labelKeys.json';

export function FinanceTrendChart() {
  const { t } = useTranslation();
  const { getParams } = useFinanceStore();
  const { data: trendData = [], isLoading } = useFinanceTrend(getParams());

  const monthlyPeriods = useMemo(() => trendData.map((m) => m.period), [trendData]);
  const monthlyAmountCollected = useMemo(() => trendData.map((m) => m.totalAmountCollected), [trendData]);
  const monthlyCommissionBrute = useMemo(() => trendData.map((m) => m.commissionBrute), [trendData]);
  const monthlyCosts = useMemo(() => trendData.map((m) => m.totalCosts), [trendData]);
  const monthlyCommissionNette = useMemo(() => trendData.map((m) => m.commissionNette), [trendData]);

  return (
    <Card sx={{ borderRadius: 2.5, mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <SectionHeader
          icon={<Timeline fontSize="small" />}
          title={t(Labels.finance_trend_title)}
          subtitle={t(Labels.finance_trend_subtitle)}
          size="small"
        />
        <Box sx={{ mt: 2 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={320} />
          ) : monthlyPeriods.length > 0 ? (
            <LineChart
              xAxis={[{ scaleType: 'point', data: monthlyPeriods }]}
              series={[
                {
                  data: monthlyAmountCollected,
                  label: t(Labels.finance_trend_amount_collected),
                  color: paletteTokens.teal,
                  curve: 'monotoneX',
                  area: true,
                },
                {
                  data: monthlyCommissionBrute,
                  label: t(Labels.finance_trend_commission_brute),
                  color: paletteTokens.indigo,
                  curve: 'monotoneX',
                },
                {
                  data: monthlyCosts,
                  label: t(Labels.finance_trend_couts),
                  color: paletteTokens.warning,
                  curve: 'monotoneX',
                },
                {
                  data: monthlyCommissionNette,
                  label: t(Labels.finance_trend_commission_nette),
                  color: paletteTokens.success,
                  curve: 'monotoneX',
                },
              ]}
              height={340}
              slotProps={{
                legend: {
                  position: { vertical: 'bottom' as const, horizontal: 'center' as const },
                },
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
              {t(Labels.finance_trend_empty)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
