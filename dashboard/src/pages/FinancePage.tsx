import { Box } from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { SectionHeader } from '@/components/shared';
import { FinanceDateFilter } from '@/components/finance/FinanceDateFilter';
import { FinanceKpiCards } from '@/components/finance/FinanceKpiCards';
import { CommissionBreakdown } from '@/components/finance/CommissionBreakdown';
import { FinanceTrendChart } from '@/components/finance/FinanceTrendChart';
import { FinanceChartsRow } from '@/components/finance/FinanceChartsRow';
import { FinanceSummaryPanels } from '@/components/finance/FinanceSummaryPanels';
import Labels from '@/labelKeys.json';

export default function FinancePage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <SectionHeader
          icon={<AccountBalance />}
          title={t(Labels.finance_title)}
          subtitle={t(Labels.finance_subtitle)}
        />
      </Box>

      {/* Date Range Selector */}
      <FinanceDateFilter />

      {/* KPI Cards */}
      <FinanceKpiCards />

      {/* Commission Nette Breakdown Card */}
      <CommissionBreakdown />

      {/* Line Chart — Monthly Trend */}
      <FinanceTrendChart />

      {/* Bar Chart + Pie Chart */}
      <FinanceChartsRow />

      {/* Summary Detail Panels */}
      <FinanceSummaryPanels />
    </Box>
  );
}
