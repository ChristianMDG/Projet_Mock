import { Grid } from '@mui/material';
import { TrendingUp, TrendingDown, Receipt, SwapHoriz, CheckCircleOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { MetricCard } from '@/components/shared';
import { formatCurrency } from '@/utils/format';
import { paletteTokens } from '@/themes/appTheme';
import { useFinanceKpi } from '@/hooks/finance.hook';
import { useFinanceStore } from '@/stores/finance.store';
import Labels from '@/labelKeys.json';

export function FinanceKpiCards() {
  const { t } = useTranslation();
  const { getParams } = useFinanceStore();
  const { data: stats, isLoading } = useFinanceKpi(getParams());

  const commissionNette = stats?.commissionNette ?? 0;
  const totalAmountCollected = stats?.totalAmountCollected ?? 0;
  const totalTransactions = stats?.totalTransactions ?? 0;
  const successfulTransactions = stats?.successfulTransactions ?? 0;
  const totalPassagers = stats?.totalPassagers ?? 0;
  const commissionIsPositive = stats?.commissionIsPositive ?? true;
  const successRate = stats?.successRate ?? 0;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 6, md: 3 }}>
        <MetricCard
          label={t(Labels.finance_kpi_commission_nette)}
          value={formatCurrency(commissionNette)}
          sub={
            commissionIsPositive ? t(Labels.finance_kpi_commission_positive) : t(Labels.finance_kpi_commission_negative)
          }
          color={commissionIsPositive ? paletteTokens.success : paletteTokens.error}
          icon={commissionIsPositive ? <TrendingUp sx={{ fontSize: 18 }} /> : <TrendingDown sx={{ fontSize: 18 }} />}
          loading={isLoading}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <MetricCard
          label={t(Labels.finance_kpi_total_collecte)}
          value={formatCurrency(totalAmountCollected)}
          sub={t(Labels.finance_kpi_passagers, { count: totalPassagers })}
          color={paletteTokens.teal}
          icon={<Receipt sx={{ fontSize: 18 }} />}
          loading={isLoading}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <MetricCard
          label={t(Labels.finance_kpi_transactions)}
          value={String(totalTransactions)}
          sub={t(Labels.finance_kpi_transactions_sub, { count: successfulTransactions })}
          color={paletteTokens.infoDark}
          icon={<SwapHoriz sx={{ fontSize: 18 }} />}
          loading={isLoading}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <MetricCard
          label={t(Labels.finance_kpi_success_rate)}
          value={`${successRate}%`}
          sub={t(Labels.finance_kpi_success_rate_sub, { count: totalPassagers })}
          color={paletteTokens.purple}
          icon={<CheckCircleOutline sx={{ fontSize: 18 }} />}
          loading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
