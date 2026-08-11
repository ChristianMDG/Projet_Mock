import { Box, Button, Grid, IconButton, Paper, Skeleton, Typography, alpha } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from '@/utils/dayjs';
import { useMonthlyVoyageResults } from '@/hooks/voyage.hooks';
import type { VoyageMonthlyDayResult } from '@/types/type.util';

interface VoyageMonthlyCalendarProps {
  departureVilleId: number;
  arrivalVilleId: number;
  koperativeId?: number;
  passengers?: number;
  onDaySelect?: (date: dayjs.Dayjs) => void;
  selectedDate?: dayjs.Dayjs;
}

export const VoyageMonthlyCalendar: React.FC<VoyageMonthlyCalendarProps> = ({
  departureVilleId,
  arrivalVilleId,
  koperativeId,
  passengers = 1,
  onDaySelect,
}) => {
  const { i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(dayjs().startOf('month'));

  const currentMonthDayjs = currentDate.startOf('month');
  const month = currentDate.format('YYYY-MM');

  const { data: monthlyData, isLoading } = useMonthlyVoyageResults({
    departureVilleId,
    arrivalVilleId,
    koperativeId,
    month,
    language: i18n.language,
    passengers,
  });

  const priceMap = useMemo(() => {
    const map = new Map<string, VoyageMonthlyDayResult>();
    if (monthlyData?.days) {
      for (const day of monthlyData.days) {
        map.set(day.date, day);
      }
    }
    return map;
  }, [monthlyData]);

  const formatPrice = useCallback(
    (price: number | null) => {
      if (price === null) return null;
      return price.toLocaleString(i18n.language);
    },
    [i18n.language],
  );

  const isPrevDisabled = currentDate.isSame(dayjs(), 'month');

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => prev.add(1, 'month'));
  }, []);

  const daysInMonth = useMemo(() => {
    const monthStart = currentMonthDayjs.startOf('month');
    const calendarStart = monthStart.startOf('week').add(1, 'day'); // Monday-first

    const days: dayjs.Dayjs[] = [];
    let current = calendarStart;
    for (let i = 0; i < 42; i++) {
      days.push(current);
      current = current.add(1, 'day');
    }
    return days;
  }, [currentMonthDayjs]);

  const weekdaysShort = useMemo(() => {
    const days = dayjs.weekdaysShort();
    return [...days.slice(1), days[0]];
  }, [i18n.language]);

  const handleDayClick = useCallback(
    (date: dayjs.Dayjs) => {
      const dayData = priceMap.get(date.format('YYYY-MM-DD'));
      const hasVoyages = dayData?.hasVoyages ?? false;
      const isPast = date.isBefore(dayjs(), 'day');

      if (hasVoyages && !isPast) {
        onDaySelect?.(date);
      }
    },
    [onDaySelect, priceMap],
  );

  const formattedCurrentDate = useMemo(() => {
    return currentDate.locale(i18n.language).format('MMMM YYYY');
  }, [currentDate, i18n.language]);

  return (
    <Paper elevation={0} sx={{ padding: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <IconButton onClick={handlePreviousMonth} disabled={isPrevDisabled} size="small" aria-label="Previous month">
          <ChevronLeftIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            mx: 2,
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {formattedCurrentDate}
        </Typography>

        <IconButton onClick={handleNextMonth} size="small" aria-label="Next month">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box>
        <Grid container spacing={0.5} sx={{ mb: 1 }}>
          {weekdaysShort.map((day: string) => (
            <Grid size={{ xs: 12 / 7 }} key={day}>
              <Typography
                variant="subtitle2"
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'text.secondary',
                  py: 1,
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {isLoading ? (
          <Grid container spacing={0.5}>
            {Array.from({ length: 42 }, (_, i) => (
              <Grid size={{ xs: 12 / 7 }} key={i}>
                <Skeleton variant="rectangular" height={72} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={0.5}>
            {daysInMonth.map(date => {
              const dateKey = date.format('YYYY-MM-DD');
              const dayData = priceMap.get(dateKey);
              const hasVoyages = dayData?.hasVoyages ?? false;
              const price = dayData?.minPrice ?? null;
              const isCurrentMonth = date.isSame(currentMonthDayjs, 'month');
              const isTodayDate = date.isSame(dayjs(), 'day');
              const isFuture = date.isAfter(dayjs(), 'day');
              const showPrice = hasVoyages && isFuture && Boolean(price);

              return (
                <Grid size={{ xs: 12 / 7 }} key={dateKey}>
                  <Button
                    onClick={() => handleDayClick(date)}
                    disabled={!isFuture || !hasVoyages}
                    variant="outlined"
                    color={isTodayDate ? 'error' : 'inherit'}
                    sx={{
                      gap: 0.25,
                      minWidth: 0,
                      width: '100%',
                      minHeight: 64,
                      flexDirection: 'column',
                      justifyContent: 'space-between !important',
                      position: 'relative',
                      opacity: isCurrentMonth ? 1 : 0.4,
                      borderRadius: 3,
                      borderColor: theme => alpha(theme.palette.primary.main, 0.2),
                      ...(showPrice && {
                        background: theme => alpha(theme.palette.info.light, 0.08),
                        backdropFilter: 'blur(16px)',
                        boxShadow: theme =>
                          `0 0.5px 1px ${alpha(theme.palette.info.main, 0.08)}, 0 0 0 0.5px ${alpha(theme.palette.info.main, 0.12)}`,
                        border: theme => `1px solid ${alpha(theme.palette.info.light, 0.2)}`,
                        '&:hover': {
                          background: theme => alpha(theme.palette.info.light, 0.14),
                          boxShadow: theme =>
                            `0 1px 3px ${alpha(theme.palette.info.main, 0.12)}, 0 0 0 0.5px ${alpha(theme.palette.info.main, 0.18)}`,
                        },
                      }),
                    }}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        lineHeight: 1.1,
                        fontWeight: isTodayDate ? 700 : 500,
                      }}
                    >
                      {isCurrentMonth ? date.date() : date.locale(i18n.language).format('D MMM')}
                    </Typography>
                    {showPrice && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="primary.main"
                        sx={{
                          marginTop: 1,
                          lineHeight: 1,
                          fontWeight: { xs: 400, md: 600 },
                          fontSize: { xs: '0.65rem', md: '0.85rem' },
                          textAlign: 'center',
                        }}
                      >
                        {formatPrice(price)} AR
                      </Typography>
                    )}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

export default VoyageMonthlyCalendar;
