import React from 'react';
import { alpha, Avatar, Box, Chip, Grid, Paper, Stack, Theme, Typography } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Labels from '@/labelKeys.json';
import { KrafterViewer } from '@/components';
import { TaxibrousseRedIcon } from '@/components/ui';
import { GuichetInformation } from './GuichetInformation';
import { Reservation } from '@/types';
import { Seat } from '@/models/Seat';
import { voyageDateUtils } from '@/utils/dayjs';
import { mapSeatsToSeatConfigs } from '@/utils/seat.utils';

interface VoyageDetailsProps {
  readonly theme: Theme;
  readonly reservation: Reservation;
  readonly t: (key: string) => string;
  readonly seats?: Seat[];
  readonly seatsLoading?: boolean;
}

export const VoyageDetails: React.FC<VoyageDetailsProps> = ({
  t,
  seats,
  seatsLoading,
  reservation: { voyage, voyageur },
  theme,
}) => {
  const duration = React.useMemo(() => {
    if (voyage?.departureTime && voyage?.estimatedArrivalTime) {
      return voyageDateUtils.formatDuration(voyage.departureTime, voyage.estimatedArrivalTime);
    }
    return null;
  }, [voyage?.departureTime, voyage?.estimatedArrivalTime]);

  const selectedSeats = React.useMemo(() => mapSeatsToSeatConfigs(seats), [seats]);

  return voyage ? (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box>
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{
              mb: 2,
              fontWeight: 600,
            }}
          >
            {t(Labels.reserved_seats)}
          </Typography>
          <KrafterViewer
            voyage={voyage}
            selectedSeats={selectedSeats}
            multiSelect={false}
            viewLoading={seatsLoading}
            readonly
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        {voyageur && (
          <Stack spacing={2}>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{
                fontWeight: 600,
              }}
            >
              {t(Labels.passenger_information)}
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                }}
              >
                {voyageur.firstName?.[0]}
                {voyageur.lastName?.[0]}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {voyageur.firstName} {voyageur.lastName}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 2 }} sx={{ mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <PhoneOutlinedIcon
                      sx={{
                        fontSize: 'small',
                      }}
                    />{' '}
                    {voyageur.phone}
                  </Typography>
                  {voyageur.email && (
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <EmailOutlinedIcon
                        sx={{
                          fontSize: 'small',
                        }}
                      />{' '}
                      {voyageur.email}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Stack>
        )}

        <GuichetInformation gare={voyage?.departureGare} koperative={voyage?.koperative} theme={theme} t={t} />

        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{
              mb: 2,
              fontWeight: 600,
            }}
          >
            {t(Labels.voyage_details)}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mb: 2,
                alignItems: 'center',
              }}
            >
              <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  {t(Labels.voyage_departure)}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {voyage?.departureGare?.ville?.name}
                </Typography>
              </Stack>
              <Box sx={{ flex: 1, height: 2, bgcolor: 'primary.main', borderRadius: 1 }} />
              <TaxibrousseRedIcon sx={{ fontSize: 14 }} />
              <Box sx={{ flex: 1, height: 2, bgcolor: 'primary.main', borderRadius: 1 }} />
              <Stack spacing={0.25} sx={{ minWidth: 0, textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">
                  {t(Labels.voyage_arrival)}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  noWrap
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {voyage?.arrivalGare?.ville?.name}
                </Typography>
              </Stack>
            </Stack>

            {(duration || voyage?.classe?.name) && (
              <Stack
                direction="row"
                sx={{
                  mb: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                {duration && (
                  <Chip
                    icon={<ScheduleIcon />}
                    label={`Durée: ${duration}`}
                    size="small"
                    sx={{ fontWeight: 600 }}
                    color="info"
                    variant="outlined"
                  />
                )}
                {voyage?.classe?.name && (
                  <Chip
                    icon={<WorkspacePremiumIcon />}
                    label={`${t(Labels.ui_reservation_classe)}: ${voyage.classe.name}`}
                    size="small"
                    sx={{ fontWeight: 600 }}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
            )}
          </Paper>
        </Box>
      </Grid>
    </Grid>
  ) : (
    <></>
  );
};
