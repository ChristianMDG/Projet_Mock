import React from 'react';
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  East as EastIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { voyageDateUtils } from '@/utils/dayjs';
import { useTranslation } from 'react-i18next';
import { Voyage } from '@/models/Voyage';
import { VoyageStatusEnum, VoyageStatusLabels } from '@/models/enums';
import { VehicleIcon } from '@/components/shared';
import Labels from '@/labelKeys.json';

interface VoyageCardProps {
  voyage: Voyage;
  selected?: boolean;
  onSelect?: (voyage: Voyage) => void;
}

export const VoyageCard: React.FC<VoyageCardProps> = ({ voyage, selected = false, onSelect }) => {
  const { t, i18n } = useTranslation();
  const departureLabel = voyage.departureGare?.ville?.name ?? voyage.departureGare?.name ?? '';
  const arrivalLabel = voyage.arrivalGare?.ville?.name ?? voyage.arrivalGare?.name ?? '';
  const driverName = [voyage.chauffeur?.user?.firstName, voyage.chauffeur?.user?.lastName].filter(Boolean).join(' ');

  const getStatusColor = (
    status?: VoyageStatusEnum,
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case VoyageStatusEnum.SCHEDULED:
        return 'primary';
      case VoyageStatusEnum.ONGOING:
        return 'warning';
      case VoyageStatusEnum.COMPLETED:
        return 'success';
      case VoyageStatusEnum.CANCELLED:
        return 'error';
      case VoyageStatusEnum.DELAYED:
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTime = (dateTime: string) => {
    try {
      return dayjs(dateTime).format('HH:mm');
    } catch (error) {
      console.warn('Invalid date format:', dateTime, error);
      return dateTime;
    }
  };

  const formatDate = (dateTime: string) => {
    try {
      const date = dayjs(dateTime);
      const now = dayjs();

      if (voyageDateUtils.isToday(date)) {
        return date.format(`[${t(Labels.date_today)}]`);
      }

      if (date.isSame(now.add(1, 'day'), 'day')) {
        return date.format(`[${t(Labels.date_tomorrow)}]`);
      }

      if (date.isBetween(now, now.add(7, 'days'), 'day', '[]')) {
        return voyageDateUtils.formatVoyageDate(date);
      }

      return date.format('ddd DD MMM YYYY');
    } catch (error) {
      console.warn('Invalid date format:', dateTime, error);
      return dateTime;
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) {
      return null;
    }

    const locale =
      i18n.language === 'fr'
        ? 'fr-FR'
        : i18n.language === 'mg'
          ? 'fr-MG'
          : i18n.language === 'en'
            ? 'en-US'
            : undefined;

    try {
      return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 0,
      }).format(price);
    } catch {
      return price.toString();
    }
  };

  const handleSelect = () => {
    onSelect?.(voyage);
  };

  return (
    <Card
      sx={{
        mb: 2,
        overflow: 'hidden',
        border: selected ? 2 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: 'background.paper',
        boxShadow: selected ? 3 : 1,
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 2,
          transform: selected ? 'scale(1.02)' : 'scale(1.01)',
        },
      }}
    >
      <CardActionArea onClick={handleSelect} disabled={!onSelect} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {selected && <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />}
                  <Chip
                    label={voyage.status ? t(VoyageStatusLabels[voyage.status]) : t(Labels.status_unknown)}
                    color={getStatusColor(voyage.status)}
                    size="small"
                    variant={selected ? 'filled' : 'outlined'}
                  />
                  {voyage.classe?.name && (
                    <Chip label={voyage.classe.name} size="small" variant="outlined" color="secondary" />
                  )}
                  {voyage.pricePerSeat > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {formatPrice(voyage.pricePerSeat)} Ar
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                    {departureLabel}
                  </Typography>
                  <EastIcon color="primary" sx={{ fontSize: 18 }} />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                    {arrivalLabel}
                  </Typography>
                </Box>
              </Stack>

              {voyage.availableSeats !== undefined && (
                <Chip
                  label={`${voyage.availableSeats} ${t(Labels.voyage_available_seats)}`}
                  size="small"
                  color={voyage.availableSeats > 0 ? 'success' : 'default'}
                  variant="outlined"
                />
              )}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 1,
                px: 1.25,
                py: 1,
                borderRadius: 2,
                border: 1,
                borderColor: selected ? 'primary.light' : 'divider',
                bgcolor: selected ? 'primary.50' : 'grey.50',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <ScheduleIcon color="primary" sx={{ fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                    {t(Labels.voyage_card_departure_time)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700 }}>
                  {formatTime(voyage.departureTime)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(voyage.departureTime)}
                </Typography>
              </Box>

              {voyage.estimatedArrivalTime && (
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                    {t(Labels.voyage_estimated_arrival)}
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700 }}>
                    {formatTime(voyage.estimatedArrivalTime)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(voyage.estimatedArrivalTime)}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1.25,
              }}
            >
              {voyage.crafter && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    minWidth: 0,
                    maxWidth: '100%',
                  }}
                >
                  <VehicleIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {voyage.crafter.registrationNumber}
                    {voyage.crafter.model ? ` · ${voyage.crafter.model}` : ''}
                  </Typography>
                </Box>
              )}

              {driverName && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    minWidth: 0,
                    maxWidth: '100%',
                  }}
                >
                  <PersonIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {driverName}
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VoyageCard;
