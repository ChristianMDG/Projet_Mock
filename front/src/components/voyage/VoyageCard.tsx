import React from 'react';
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EastIcon from '@mui/icons-material/East';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useTranslation } from 'react-i18next';
import { Voyage } from '@/models/Voyage';
import VehicleIcon from '@/components/shared/VehicleIcon';
import Labels from '@/labelKeys.json';
import StyledIcon from '@/components/ui/StyledIcon';
import dayjs from '@/utils/dayjs';
import { trackEvent } from '@/hooks/google-analytics.hook';
import { DATE_FORMATS } from '@/utils/dayjs';
import { useSeatManagement } from '@/hooks/seat.hooks';

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

  const departureDate = voyage.departureTime ? dayjs(voyage.departureTime) : null;
  const localeMap: Record<string, string> = { fr: 'fr-FR', mg: 'fr-MG', en: 'en-US' };
  const priceFormatted = voyage.pricePerSeat
    ? new Intl.NumberFormat(localeMap[i18n.language], { maximumFractionDigits: 0 }).format(voyage.pricePerSeat)
    : null;

  const { actualAvailableSeats } = useSeatManagement({ voyage });

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
      <CardActionArea
        onClick={() => {
          trackEvent('voyage_card_clicked', 'Voyage', `Voyage ID: ${voyage.id}`);
          onSelect?.(voyage);
        }}
        disabled={!onSelect}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack spacing={1}>
            {/* Line 1: route + class | available seats */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
                {selected && <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />}
                <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  {departureLabel}
                </Typography>
                <EastIcon color="primary" sx={{ fontSize: 18 }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  {arrivalLabel}
                </Typography>
                {voyage.classe?.name && (
                  <Chip label={voyage.classe.name} size="small" variant="outlined" color="secondary" sx={{ ml: 0.5 }} />
                )}
              </Box>

              {actualAvailableSeats !== undefined && (
                <Chip
                  label={`${actualAvailableSeats} ${t(Labels.voyage_available_seats)}`}
                  size="small"
                  color={actualAvailableSeats > 0 ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ flexShrink: 0 }}
                />
              )}
            </Box>

            {/* Departure Date and Time */}
            {departureDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                <ScheduleIcon color="primary" sx={{ fontSize: 18 }} />
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                  {departureDate.locale(i18n.language).format(DATE_FORMATS.VOYAGE_DATE)}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {departureDate.format(DATE_FORMATS.DEPARTURE_TIME)}
                </Typography>
              </Box>
            )}

            {/* Line 2: vehicle + driver | price */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1.25,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {voyage.crafter && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                    <StyledIcon icon={VehicleIcon} color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {voyage.crafter.registrationNumber}
                      {voyage.crafter.model ? ` · ${voyage.crafter.model}` : ''}
                    </Typography>
                  </Box>
                )}

                {driverName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                    <PersonIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {driverName}
                    </Typography>
                  </Box>
                )}
              </Box>

              {priceFormatted && (
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, flexShrink: 0 }}>
                  {priceFormatted} Ar
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VoyageCard;
