import React from 'react';
import { Box, Card, CardContent, Stack, Typography, Divider, Chip } from '@mui/material';
import { WorkspacePremium } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/models/Voyage';
import { Seat } from '@/models/Seat';
import { useCurrencyFormatter } from '@/utils/currency.utils';
import { formatDateTime } from '@/utils/reservation-display.utils';
import { KoperativeVerifiedIcon } from '../shared';
import { TaxibrousseRedIcon } from '..';

interface SelectedSeatsProps {
  selectedSeats: Seat[];
  voyage: Voyage;
  guichetPhone?: string;
}

export const SelectedSeats: React.FC<SelectedSeatsProps> = ({ selectedSeats, voyage, guichetPhone }) => {
  const { t, i18n } = useTranslation();
  const { formatAriary } = useCurrencyFormatter();

  return (
    <Card sx={{ mb: 3, mt: 1 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Koperative & Guichet Info */}
          <Stack direction="row" spacing={2}>
            {voyage.koperative?.logoUrl && (
              <Card
                sx={{
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 0.2,
                }}
              >
                <Box
                  component="img"
                  src={voyage.koperative.logoUrl}
                  alt={voyage.koperative.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Card>
            )}
            <Stack
              spacing={0.5}
              sx={{
                flex: 1,
              }}
            >
              {voyage.koperative?.name && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Box
                    component="span"
                    color="text.primary"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {voyage.koperative.name}
                  </Box>
                  <KoperativeVerifiedIcon koperative={voyage.koperative} />
                </Typography>
              )}
              {voyage.departureGare?.name && (
                <Typography variant="body2" color="text.secondary">
                  <Box
                    component="span"
                    color="text.primary"
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    {voyage.departureGare.name}
                  </Box>
                </Typography>
              )}
              {guichetPhone && (
                <Typography variant="body2" color="text.secondary">
                  {t(Labels.phone)}:{' '}
                  <Box
                    component="span"
                    color="text.primary"
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    {guichetPhone}
                  </Box>
                </Typography>
              )}
            </Stack>
          </Stack>

          <Divider />
          {/* Voyage Info */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatDateTime(voyage.departureTime, i18n.language)}
            </Typography>
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                }}
              >
                {voyage.departureGare?.ville?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TaxibrousseRedIcon sx={{ fontSize: 'inherit' }} />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                }}
              >
                {voyage.arrivalGare?.ville?.name}
              </Typography>
            </Stack>
            {voyage.classe?.name && (
              <Box sx={{ mt: 1 }}>
                <Chip
                  icon={
                    <WorkspacePremium
                      sx={{
                        fontSize: 'small',
                      }}
                    />
                  }
                  label={`${t(Labels.ui_reservation_classe)}: ${voyage.classe.name}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>

          <Divider />

          {/* Seats & Price */}
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                flex: 1,
              }}
            >
              <Typography variant="body2" color="text.primary" gutterBottom>
                {t(Labels.selected_seats)}
              </Typography>
              <Stack
                direction="row"
                sx={{
                  flexWrap: 'wrap',
                  gap: 0.5,
                }}
              >
                {selectedSeats.map(seat => (
                  <Chip key={seat.seatNum} label={seat.seatNum} color="primary" size="small" />
                ))}
              </Stack>
            </Box>
            <Box
              sx={{
                textAlign: 'right',
              }}
            >
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  mt: 0.5,
                }}
              >
                {selectedSeats.length} {t(Labels.crafter_seats)} × {formatAriary(voyage.pricePerSeat)}
              </Typography>
              <Typography
                variant="body1"
                color="primary.main"
                sx={{
                  fontWeight: 700,
                }}
              >
                {formatAriary(selectedSeats.length * voyage.pricePerSeat)}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
