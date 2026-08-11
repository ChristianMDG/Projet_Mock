import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import dayjs from '@/utils/dayjs';
import { useTranslation } from 'react-i18next';
import { useVoyagesByKoperative } from '@/hooks/voyage.hooks';
import { Voyage } from '@/models/Voyage';
import { VoyageStatusEnum } from '@/models/enums';
import Labels from '@/labelKeys.json';
import { ButtonTx, StyledIcon } from '@/components/ui';
import ProtectedTx from '@/components/ProtectedTx';

interface VoyageCalendarProps {
  koperativeId: number;
}

export const VoyageCalendar: React.FC<VoyageCalendarProps> = ({ koperativeId }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { data: voyages = [], isLoading } = useVoyagesByKoperative(koperativeId);

  const daysInMonth = useMemo(() => {
    const monthStart = currentDate.startOf('month');
    const calendarStart = monthStart.startOf('week').add(1, 'day'); // Monday

    const days = [];
    let current = calendarStart;
    for (let i = 0; i < 42; i++) {
      days.push(current);
      current = current.add(1, 'day');
    }
    return days;
  }, [currentDate]);

  const voyagesByDate = useMemo(() => {
    const grouped: Record<string, Voyage[]> = {};

    voyages.forEach(voyage => {
      const dateKey = dayjs(voyage.departureTime).format('YYYY-MM-DD');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(voyage);
    });

    return grouped;
  }, [voyages]);

  const getVoyagesForDate = (date: dayjs.Dayjs): Voyage[] => {
    const dateKey = date.format('YYYY-MM-DD');
    return voyagesByDate[dateKey] ?? [];
  };

  const getStatusColor = (status?: VoyageStatusEnum) => {
    switch (status) {
      case VoyageStatusEnum.SCHEDULED:
        return theme.palette.info.main;
      case VoyageStatusEnum.ONGOING:
        return theme.palette.warning.main;
      case VoyageStatusEnum.COMPLETED:
        return theme.palette.success.main;
      case VoyageStatusEnum.CANCELLED:
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => prev.add(1, 'month'));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(dayjs());
  }, []);

  const handleDateClick = useCallback(
    (date: dayjs.Dayjs) => {
      const dayVoyages = voyagesByDate[date.format('YYYY-MM-DD')] ?? [];
      if (dayVoyages.length > 0) {
        setSelectedDate(date);
        setDetailsOpen(true);
      }
    },
    [voyagesByDate],
  );

  const selectedDateVoyages = selectedDate ? getVoyagesForDate(selectedDate) : [];

  const weekdaysShort = useMemo(() => {
    const days = dayjs.weekdaysShort();
    return [...days.slice(1), days[0]];
  }, [i18n.language]);

  const formattedCurrentDate = useMemo(() => {
    return currentDate.locale(i18n.language).format('MMMM YYYY');
  }, [currentDate, i18n.language]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography>{t(Labels.loading)}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handlePreviousMonth} aria-label="Previous month" size="large">
            <StyledIcon icon={ChevronLeftIcon} variant="secondary" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, minWidth: { sm: 200 }, textAlign: 'center' }}>
            {formattedCurrentDate}
          </Typography>
          <IconButton onClick={handleNextMonth} aria-label="Next month" size="large">
            <StyledIcon icon={ChevronRightIcon} variant="secondary" />
          </IconButton>
        </Box>
        <ButtonTx
          variant="contained"
          startIcon={<TodayIcon />}
          onClick={handleToday}
          color="secondary"
          disableElevation={false}
          size="large"
        >
          {t(Labels.ui_today)}
        </ButtonTx>
      </Box>
      <Card>
        <CardContent>
          <Grid container spacing={1} sx={{ mb: 2 }}>
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

          <Grid container spacing={1}>
            {daysInMonth.map(date => {
              const dayVoyages = getVoyagesForDate(date);
              const isCurrentMonth = date.isSame(currentDate, 'month');
              const isTodayDate = date.isSame(dayjs(), 'day');
              const hasVoyages = dayVoyages.length > 0;

              let textColor: string;
              if (isTodayDate) {
                textColor = 'primary.light';
              } else if (isCurrentMonth) {
                textColor = 'text.primary';
              } else {
                textColor = 'text.disabled';
              }

              return (
                <Grid size={{ xs: 12 / 7 }} key={date.format('YYYY-MM-DD')}>
                  <Box
                    sx={{
                      height: 120,
                      border: 1,
                      borderColor: isTodayDate ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      p: 1,
                      backgroundColor: isTodayDate ? 'secondary.light' : 'background.paper',
                      cursor: hasVoyages ? 'pointer' : 'default',
                      '&:hover': hasVoyages ? { backgroundColor: 'action.hover' } : {},
                    }}
                    onClick={() => handleDateClick(date)}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isTodayDate ? 600 : 400,
                        color: textColor,
                        mb: 0.5,
                      }}
                    >
                      {date.format('D')}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {dayVoyages.slice(0, 3).map(voyage => (
                        <Tooltip
                          key={voyage.id}
                          title={`${voyage.departureGare?.name} → ${voyage.arrivalGare?.name} - ${dayjs(voyage.departureTime).format('HH:mm')}`}
                        >
                          <Box
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: getStatusColor(voyage.status),
                              width: '100%',
                            }}
                          />
                        </Tooltip>
                      ))}
                      {dayVoyages.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{dayVoyages.length - 3} {t(Labels.voyage_more)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        fullWidth
        sx={{
          maxWidth: 'sm',
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: theme.palette.primary.main,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <StyledIcon icon={EventIcon} variant="secondary" />
            {selectedDate && <Typography variant="h6">{selectedDate.format('dddd D MMMM YYYY')}</Typography>}
            <Chip label={`${selectedDateVoyages.length} voyages`} size="small" color="primary" variant="outlined" />
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedDateVoyages.length === 0 ? (
            <Box
              sx={{
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography>Aucun voyage disponible</Typography>
            </Box>
          ) : (
            <List dense disablePadding sx={{ m: 0, p: 0 }}>
              {selectedDateVoyages.map(voyage => (
                <React.Fragment key={voyage.id}>
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Typography component="span" sx={{ fontWeight: 500 }}>
                            {voyage.departureGare?.ville.name}
                          </Typography>
                          <ArrowForwardIcon
                            color="primary"
                            sx={{
                              fontSize: 'medium',
                            }}
                          />
                          <Typography component="span" sx={{ fontWeight: 500 }}>
                            {voyage.arrivalGare?.ville.name}
                          </Typography>
                        </Box>
                      }
                      secondary={dayjs(voyage.departureTime).format('HH:mm')}
                    />
                  </ListItemButton>
                  <Divider component="li" sx={{ borderColor: theme.palette.primary.main }} />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <ProtectedTx>
          <DialogActions>
            <ButtonTx onClick={() => setDetailsOpen(false)} variant="outlined" color="primary">
              {t(Labels.ui_close)}
            </ButtonTx>
          </DialogActions>
        </ProtectedTx>
      </Dialog>
    </Box>
  );
};

export default VoyageCalendar;
