import { Card, CardContent, Stack, Typography, Skeleton, Box, Paper, alpha, Grid } from '@mui/material';
import { AccountBalance, Info } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from '@/components/shared';
import { formatCurrency } from '@/utils/format';
import { paletteTokens } from '@/themes/appTheme';
import { useCommissionBreakdown } from '@/hooks/finance.hook';
import { useFinanceStore } from '@/stores/finance.store';
import Labels from '@/labelKeys.json';

export function CommissionBreakdown() {
  const { t } = useTranslation();
  const { getParams } = useFinanceStore();
  const { data: stats, isLoading } = useCommissionBreakdown(getParams());

  const totalFraisTransaction = stats?.totalFraisTransaction ?? 0;
  const totalFraisRetrait = stats?.totalFraisRetrait ?? 0;
  const totalFraisTransfert = stats?.totalFraisTransfert ?? 0;
  const totalCommissionSeats = stats?.totalCommissionSeats ?? 0;
  const totalCommissionFee = stats?.totalCommissionFee ?? 0;
  const totalCosts = stats?.totalCosts ?? 0;
  const commissionNette = stats?.commissionNette ?? 0;
  const commissionIsPositive = stats?.commissionIsPositive ?? true;

  // Commission brute = commissionSeats + commissionFee (revenu Taxibrousse avant couts operateur)
  const commissionBrute = totalCommissionSeats + totalCommissionFee;

  const revenueItems = [
    { label: t(Labels.finance_breakdown_commission_sieges), value: totalCommissionSeats, color: paletteTokens.teal },
    { label: t(Labels.finance_breakdown_commission_fee), value: totalCommissionFee, color: paletteTokens.infoDark },
  ];

  const costItems = [
    { label: t(Labels.finance_breakdown_frais_transaction), value: totalFraisTransaction, color: paletteTokens.indigo },
    { label: t(Labels.finance_breakdown_frais_retrait), value: totalFraisRetrait, color: paletteTokens.warning },
    { label: t(Labels.finance_breakdown_frais_transfert), value: totalFraisTransfert, color: paletteTokens.pink },
  ];

  return (
    <Card sx={{ mb: 3, borderRadius: 2.5 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
          <SectionHeader
            icon={<AccountBalance fontSize="small" />}
            title={t(Labels.finance_breakdown_title)}
            subtitle={t(Labels.finance_breakdown_subtitle)}
            size="small"
          />
          <Tooltip title={t(Labels.finance_breakdown_tooltip)} placement="top">
            <Info fontSize="small" sx={{ color: 'text.secondary', cursor: 'help' }} />
          </Tooltip>
        </Stack>

        {isLoading ? (
          <Skeleton variant="rounded" height={120} />
        ) : (
          <Box>
            {/* Summary formula row */}
            <Paper
              variant="outlined"
              sx={(theme) => ({
                p: 2.5,
                borderRadius: 2,
                background: alpha(theme.palette.primary.main, 0.04),
                mb: 2.5,
              })}
            >
              <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                      {t(Labels.finance_breakdown_commission_brute)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: paletteTokens.teal, fontSize: '1rem' }}>
                      {formatCurrency(commissionBrute)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                      {t(Labels.finance_breakdown_couts)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: paletteTokens.warning, fontSize: '1rem' }}>
                      - {formatCurrency(totalCosts)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                      {t(Labels.finance_breakdown_commission_nette)}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: commissionIsPositive ? 'success.main' : 'error.main',
                        fontSize: '1.4rem',
                      }}
                    >
                      {formatCurrency(commissionNette)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Revenue detail (commission brute components) */}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, fontSize: '0.75rem', mb: 1, color: 'text.secondary' }}
            >
              {t(Labels.finance_breakdown_revenue_section)}
            </Typography>
            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
              {revenueItems.map((item) => {
                const pct = commissionBrute > 0 ? (item.value / commissionBrute) * 100 : 0;
                return (
                  <Grid size={{ xs: 6, sm: 6, md: 3 }} key={item.label}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        borderColor: alpha(item.color, 0.3),
                        background: alpha(item.color, 0.04),
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.68rem', display: 'block', mb: 0.5 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: item.color, fontSize: '1rem', mb: 0.5 }}>
                        {formatCurrency(item.value)}
                      </Typography>
                      <Box sx={{ height: 4, borderRadius: 2, bgcolor: alpha(item.color, 0.15), overflow: 'hidden' }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: `${pct}%`,
                            bgcolor: item.color,
                            borderRadius: 2,
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                        {t(Labels.finance_breakdown_pct_of_brute, { percent: pct.toFixed(1) })}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Cost detail (operator fees, subtracted from commission brute) */}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, fontSize: '0.75rem', mb: 1, color: 'text.secondary' }}
            >
              {t(Labels.finance_breakdown_cost_section)}
            </Typography>
            <Grid container spacing={1.5}>
              {costItems.map((item) => {
                const pct = totalCosts > 0 ? (item.value / totalCosts) * 100 : 0;
                return (
                  <Grid size={{ xs: 6, sm: 4, md: 4 }} key={item.label}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        borderColor: alpha(item.color, 0.3),
                        background: alpha(item.color, 0.04),
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.68rem', display: 'block', mb: 0.5 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: item.color, fontSize: '1rem', mb: 0.5 }}>
                        {formatCurrency(item.value)}
                      </Typography>
                      <Box sx={{ height: 4, borderRadius: 2, bgcolor: alpha(item.color, 0.15), overflow: 'hidden' }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: `${pct}%`,
                            bgcolor: item.color,
                            borderRadius: 2,
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                        {t(Labels.finance_breakdown_pct_of_couts, { percent: pct.toFixed(1) })}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
