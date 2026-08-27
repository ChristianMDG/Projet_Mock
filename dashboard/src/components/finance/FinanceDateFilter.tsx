import { Card, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useFinanceStore } from '@/stores/finance.store';
import Labels from '@/labelKeys.json';

export function FinanceDateFilter() {
  const { t } = useTranslation();
  const { from, setFrom, to, setTo } = useFinanceStore();

  const fromDayjs = from ? dayjs(from) : null;
  const toDayjs = to ? dayjs(to) : null;

  return (
    <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <Typography variant="subtitle2" sx={{ fontWeight: 600, minWidth: 100 }}>
          {t(Labels.finance_period_label)} :
        </Typography>
        <DatePicker
          label={t(Labels.finance_period_from)}
          value={fromDayjs}
          onChange={(val) => setFrom(val?.format('YYYY-MM-DD'))}
          views={['year', 'month']}
          openTo="month"
          slotProps={{ textField: { size: 'small' } }}
        />
        <Typography variant="body2" color="text.secondary">
          →
        </Typography>
        <DatePicker
          label={t(Labels.finance_period_to)}
          value={toDayjs}
          onChange={(val) => setTo(val?.format('YYYY-MM-DD'))}
          views={['year', 'month']}
          openTo="month"
          slotProps={{ textField: { size: 'small' } }}
        />
      </Stack>
    </Card>
  );
}
