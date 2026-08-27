import { Grid, Card, CardContent, Stack, Paper, alpha, Typography, Skeleton, Box, Divider } from '@mui/material';
import { Receipt, People } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from '@/components/shared';
import { formatCurrency } from '@/utils/format';
import { paletteTokens } from '@/themes/appTheme';
import { useFinanceSummary } from '@/hooks/finance.hook';
import { useFinanceStore } from '@/stores/finance.store';
import Labels from '@/labelKeys.json';

export function FinanceSummaryPanels() {
  const { t } = useTranslation();
  const { getParams } = useFinanceStore();
  const { data: stats, isLoading } = useFinanceSummary(getParams());

  const totalAmountCollected = stats?.totalAmountCollected ?? 0;
  const commissionNette = stats?.commissionNette ?? 0;
  const totalTransactions = stats?.totalTransactions ?? 0;
  const successfulTransactions = stats?.successfulTransactions ?? 0;
  const totalPassagers = stats?.totalPassagers ?? 0;
  const monthlyTrend = stats?.monthlyTrend ?? [];

  const totalCosts = stats?.totalCosts ?? 0;
  const successRate = stats?.successRate ?? 0;
  const commissionIsPositive = stats?.commissionIsPositive ?? true;

  const revenueItems = [
    {
      label: t(Labels.finance_summary_total_collecte),
      value: formatCurrency(totalAmountCollected),
      palette: 'success' as const,
    },
    {
      label: t(Labels.finance_summary_commission_nette),
      value: formatCurrency(commissionNette),
      palette: commissionIsPositive ? ('success' as const) : ('error' as const),
    },
    { label: t(Labels.finance_summary_couts), value: formatCurrency(totalCosts), palette: 'warning' as const },
  ];

  const volumeItems = [
    {
      label: t(Labels.finance_summary_transactions),
      value: String(totalTransactions),
      sub: t(Labels.finance_summary_transactions_sub),
      palette: 'info' as const,
    },
    {
      label: t(Labels.finance_summary_completed),
      value: String(successfulTransactions),
      sub: t(Labels.finance_summary_completed_sub, { percent: successRate }),
      palette: 'success' as const,
    },
    {
      label: t(Labels.finance_summary_passagers),
      value: String(totalPassagers),
      sub: t(Labels.finance_summary_passagers_sub),
      palette: 'warning' as const,
    },
  ];

  return (
    <Grid container spacing={3}>
      {/* Revenue Detail */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 2.5, height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <SectionHeader
              icon={<Receipt fontSize="small" />}
              title={t(Labels.finance_summary_revenue_title)}
              subtitle={t(Labels.finance_summary_revenue_subtitle)}
              size="small"
            />
            <Stack spacing={2} sx={{ mt: 2.5 }}>
              {revenueItems.map((item) => (
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
                  <Typography variant="h5" sx={{ fontWeight: 800, color: `${item.palette}.main`, fontSize: '1.4rem' }}>
                    {isLoading ? <Skeleton width={140} /> : item.value}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Volume Detail */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 2.5, height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <SectionHeader
              icon={<People fontSize="small" />}
              title={t(Labels.finance_summary_volume_title)}
              subtitle={t(Labels.finance_summary_volume_subtitle)}
              size="small"
            />
            <Stack spacing={2} sx={{ mt: 2.5 }}>
              {volumeItems.map((item) => (
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
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                        {item.label}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: `${item.palette}.main`, fontSize: '1.4rem' }}
                      >
                        {isLoading ? <Skeleton width={80} /> : item.value}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.7rem', textAlign: 'right', maxWidth: 100 }}
                    >
                      {item.sub}
                    </Typography>
                  </Stack>
                </Paper>
              ))}

              <Divider />

              {/* Monthly breakdown mini-table */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                {t(Labels.finance_summary_monthly_title)}
              </Typography>
              {isLoading ? (
                <Skeleton variant="rounded" height={100} />
              ) : (
                <Stack spacing={1}>
                  {monthlyTrend
                    .slice(-5)
                    .reverse()
                    .map((month) => (
                      <Stack key={month.period} direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                          {month.period}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: paletteTokens.teal, fontWeight: 600, fontSize: '0.75rem' }}
                        >
                          {formatCurrency(month.totalAmountCollected)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: month.commissionNette >= 0 ? paletteTokens.success : paletteTokens.error,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        >
                          {formatCurrency(month.commissionNette)}
                        </Typography>
                      </Stack>
                    ))}
                  {monthlyTrend.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {t(Labels.finance_summary_monthly_empty)}
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
