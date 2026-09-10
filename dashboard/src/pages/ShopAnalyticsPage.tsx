import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { TrendingUp, ShoppingBag, WarningAmber, Group, AttachMoney } from '@mui/icons-material';
import { SectionHeader, StatCard } from '@/components/shared';
import {
  useCustomerPatterns,
  useOrderStatusDistribution,
  useRevenue,
  useTopProducts,
} from '@/hooks/shopAnalytics.hook';
import { useInventory } from '@/hooks/inventory.hook';
import { OrderStatusEnum, OrderStatusLabels } from '@/types/shop.types';
import { formatCurrency } from '@/utils/format';
import dayjs from '@/utils/dayjsConfig';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

const today = () => dayjs().format('YYYY-MM-DD');
const daysAgo = (n: number) => dayjs().subtract(n, 'day').format('YYYY-MM-DD');

const STATUS_COLORS: Partial<Record<OrderStatusEnum, string>> = {
  [OrderStatusEnum.PENDING]: paletteTokens.warning,
  [OrderStatusEnum.CONFIRMED]: paletteTokens.info,
  [OrderStatusEnum.READY_IN_STORE]: paletteTokens.info,
  [OrderStatusEnum.DELIVERY_TO_STATION]: paletteTokens.indigo,
  [OrderStatusEnum.DELIVERY_IN_PROGRESS]: paletteTokens.teal,
  [OrderStatusEnum.AVAILABLE_AT_COUNTER]: paletteTokens.warning,
  [OrderStatusEnum.PROCESSING]: paletteTokens.info,
  [OrderStatusEnum.SHIPPED]: paletteTokens.indigo,
  [OrderStatusEnum.DELIVERED]: paletteTokens.success,
  [OrderStatusEnum.CANCELLED]: paletteTokens.error,
  [OrderStatusEnum.PAYMENT_FAILED]: paletteTokens.error,
};

export default function ShopAnalyticsPage() {
  const { t } = useTranslation();
  const [from, setFrom] = useState(daysAgo(30));
  const [to, setTo] = useState(today());

  const range = useMemo(() => ({ from, to }), [from, to]);

  const todayRange = useMemo(() => ({ from: today(), to: today() }), []);
  const weekRange = useMemo(() => ({ from: daysAgo(6), to: today() }), []);
  const monthRange = useMemo(() => ({ from: daysAgo(29), to: today() }), []);

  const { data: revenueToday = [] } = useRevenue(todayRange, 'day');
  const { data: revenueWeek = [] } = useRevenue(weekRange, 'day');
  const { data: revenueMonth = [] } = useRevenue(monthRange, 'day');

  const { data: topProducts = [], isLoading: topLoading } = useTopProducts(range);
  const { data: distribution = [] } = useOrderStatusDistribution(range);
  const { data: patterns = [] } = useCustomerPatterns(range);
  const { data: lowStock = [] } = useInventory(true);

  const sumRevenue = (arr: { revenue: number }[]) => arr.reduce((acc, p) => acc + (p.revenue ?? 0), 0);

  const revenueTodayTotal = sumRevenue(revenueToday);
  const revenueWeekTotal = sumRevenue(revenueWeek);
  const revenueMonthTotal = sumRevenue(revenueMonth);

  const pieData = distribution.map((d) => ({
    id: d.status,
    value: d.count,
    label: t(OrderStatusLabels[d.status] ?? d.status),
    color: STATUS_COLORS[d.status] ?? paletteTokens.grey,
  }));

  const patternLabels = patterns.map((p) => p.period);
  const newSeries = patterns.map((p) => p.newCustomers);
  const returningSeries = patterns.map((p) => p.returningCustomers);

  const hasLowStock = lowStock.length > 0;
  const hasPatterns = patterns.length > 0;
  const hasTopProducts = topProducts.length > 0;
  const hasPie = pieData.length > 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <SectionHeader
          icon={<TrendingUp sx={{ color: paletteTokens.teal }} />}
          title={t(Labels.shop_analytics_title)}
          subtitle={t(Labels.shop_analytics_subtitle)}
        />
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            type="date"
            label={t(Labels.shop_analytics_date_from)}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            size="small"
            type="date"
            label={t(Labels.shop_analytics_date_to)}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<AttachMoney />}
            label={t(Labels.shop_analytics_revenue_today)}
            value={formatCurrency(revenueTodayTotal)}
            color={paletteTokens.teal}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<AttachMoney />}
            label={t(Labels.shop_analytics_revenue_week)}
            value={formatCurrency(revenueWeekTotal)}
            color={paletteTokens.indigo}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<AttachMoney />}
            label={t(Labels.shop_analytics_revenue_month)}
            value={formatCurrency(revenueMonthTotal)}
            color={paletteTokens.purple}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2, borderRadius: 2.5, height: 1 }} variant="outlined">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <ShoppingBag sx={{ color: paletteTokens.indigo }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t(Labels.shop_analytics_top_products)}
              </Typography>
            </Stack>
            {!hasTopProducts && !topLoading ? (
              <Alert severity="info">{t(Labels.shop_common_empty)}</Alert>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t(Labels.shop_analytics_top_products_col_name)}</TableCell>
                    <TableCell align="right">{t(Labels.shop_analytics_top_products_col_quantity)}</TableCell>
                    <TableCell align="right">{t(Labels.shop_analytics_top_products_col_revenue)}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((p) => (
                    <TableRow key={p.productId}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell align="right">{p.quantitySold}</TableCell>
                      <TableCell align="right">{formatCurrency(p.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 2.5, height: 1 }} variant="outlined">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {t(Labels.shop_analytics_status_distribution)}
            </Typography>
            {hasPie ? (
              <PieChart
                series={[{ data: pieData, innerRadius: 40, outerRadius: 90 }]}
                height={240}
                hideLegend={false}
              />
            ) : (
              <Alert severity="info">{t(Labels.shop_common_empty)}</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2.5 }} variant="outlined">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <WarningAmber sx={{ color: paletteTokens.warning }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t(Labels.shop_analytics_low_stock)}
              </Typography>
            </Stack>
            {!hasLowStock ? (
              <Alert severity="success">{t(Labels.shop_analytics_low_stock_none)}</Alert>
            ) : (
              <Stack spacing={0.5}>
                {lowStock.slice(0, 10).map((i) => (
                  <Stack key={i.id} direction="row" justifyContent="space-between">
                    <Typography variant="body2">
                      {i.productName}
                      {i.variantLabel ? ` · ${i.variantLabel}` : ''}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
                      {i.quantity}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2.5 }} variant="outlined">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Group sx={{ color: paletteTokens.info }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t(Labels.shop_analytics_customer_patterns)}
              </Typography>
            </Stack>
            {!hasPatterns ? (
              <Alert severity="info">{t(Labels.shop_common_empty)}</Alert>
            ) : (
              <BarChart
                height={240}
                xAxis={[{ data: patternLabels, scaleType: 'band' }]}
                series={[
                  {
                    data: newSeries,
                    label: t(Labels.shop_analytics_new_customers),
                    color: paletteTokens.info,
                  },
                  {
                    data: returningSeries,
                    label: t(Labels.shop_analytics_returning_customers),
                    color: paletteTokens.success,
                  },
                ]}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
