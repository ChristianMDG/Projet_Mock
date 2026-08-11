import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Avatar,
  Paper,
  alpha,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  DirectionsBus,
  Schedule,
  EventSeat,
  AttachMoney,
  Person,
  LocalShipping,
  Business,
  Place,
} from '@mui/icons-material';
import type { Voyage } from '@/types/voyage.types';
import { VoyageStatusLabels, VoyageStatusEnum } from '@/types/voyage.types';
import Labels from '@/labelKeys.json';

interface VoyageDetailDialogProps {
  voyage: Voyage | null;
  open: boolean;
  onClose: () => void;
}

const getStatusColor = (status?: VoyageStatusEnum) => {
  if (status === VoyageStatusEnum.SCHEDULED) return 'info';
  if (status === VoyageStatusEnum.IN_PROGRESS) return 'warning';
  if (status === VoyageStatusEnum.COMPLETED) return 'success';
  if (status === VoyageStatusEnum.CANCELLED) return 'error';
  if (status === VoyageStatusEnum.DELAYED) return 'warning';
  return 'default';
};

const formatDateTime = (dateStr?: string) => {
  if (dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return 'N/A';
};

const formatCurrency = (amount?: number) => (amount ? `${amount.toLocaleString('fr-FR')} Ar` : 'N/A');

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function VoyageDetailDialog({ voyage, open, onClose }: VoyageDetailDialogProps) {
  const { t } = useTranslation();

  if (voyage) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'info.main',
                width: 36,
                height: 36,
              }}
            >
              <DirectionsBus fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                {t(Labels.voyage_detail_title)} #{voyage.id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {voyage.koperative?.name ?? t(Labels.voyage_unknown_koperative)}
              </Typography>
            </Box>
          </Box>
          {voyage.status && (
            <Chip
              label={t(VoyageStatusLabels[voyage.status as VoyageStatusEnum] ?? voyage.status)}
              color={getStatusColor(voyage.status) as any}
              size="small"
            />
          )}
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2.5 }}>
          <Grid container spacing={2.5}>
            {/* Route Info */}
            <Grid size={{ xs: 12 }}>
              <Paper
                variant="outlined"
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.03),
                })}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Place fontSize="small" /> {t(Labels.voyage_route_section)}
                </Typography>
                <Stack spacing={1.5}>
                  <InfoRow
                    icon={<Place sx={{ fontSize: '1rem' }} />}
                    label={t(Labels.voyage_departure)}
                    value={voyage.departureGare?.name ?? voyage.departureGare?.ville?.name ?? 'N/A'}
                  />
                  <InfoRow
                    icon={<Place sx={{ fontSize: '1rem' }} />}
                    label={t(Labels.voyage_arrival)}
                    value={voyage.arrivalGare?.name ?? voyage.arrivalGare?.ville?.name ?? 'N/A'}
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Schedule */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                variant="outlined"
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.warning.main, 0.03),
                })}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Schedule fontSize="small" /> {t(Labels.voyage_schedule)}
                </Typography>
                <Stack spacing={1.5}>
                  <InfoRow
                    icon={<Schedule sx={{ fontSize: '1rem' }} />}
                    label={t(Labels.voyage_departure)}
                    value={formatDateTime(voyage.departureTime)}
                  />
                  <InfoRow
                    icon={<Schedule sx={{ fontSize: '1rem' }} />}
                    label={t(Labels.voyage_estimated_arrival)}
                    value={formatDateTime(voyage.estimatedArrivalTime)}
                  />
                  {voyage.actualArrivalTime && (
                    <InfoRow
                      icon={<Schedule sx={{ fontSize: '1rem' }} />}
                      label={t(Labels.voyage_actual_arrival)}
                      value={formatDateTime(voyage.actualArrivalTime)}
                    />
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Capacity & Price */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                variant="outlined"
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.03),
                })}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <EventSeat fontSize="small" /> {t(Labels.voyage_capacity)}
                </Typography>
                <Stack spacing={1.5}>
                  <InfoRow
                    icon={<EventSeat sx={{ fontSize: '1rem' }} />}
                    label={t(Labels.voyage_available_seats)}
                    value={String(voyage.availableSeats ?? 'N/A')}
                  />
                  <InfoRow
                    icon={<AttachMoney sx={{ fontSize: '1rem' }} />}
                    label={t(Labels.voyage_price_per_seat)}
                    value={formatCurrency(voyage.pricePerSeat)}
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Vehicle & Driver */}
            {(voyage.crafter || voyage.chauffeur) && (
              <Grid size={{ xs: 12 }}>
                <Paper
                  variant="outlined"
                  sx={(theme) => ({
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocalShipping fontSize="small" /> {t(Labels.voyage_vehicle_driver)}
                  </Typography>
                  <Stack spacing={1.5}>
                    {voyage.crafter && (
                      <InfoRow
                        icon={<LocalShipping sx={{ fontSize: '1rem' }} />}
                        label={t(Labels.voyage_vehicle)}
                        value={`${voyage.crafter.name ?? t(Labels.voyage_vehicle)} ${voyage.crafter.matricule ? `(${voyage.crafter.matricule})` : ''}`}
                      />
                    )}
                    {voyage.chauffeur && (
                      <InfoRow
                        icon={<Person sx={{ fontSize: '1rem' }} />}
                        label={t(Labels.voyage_driver)}
                        value={`${voyage.chauffeur.firstName ?? ''} ${voyage.chauffeur.lastName ?? ''}`.trim() || 'N/A'}
                      />
                    )}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Koperative */}
            {voyage.koperative && (
              <Grid size={{ xs: 12 }}>
                <Paper
                  variant="outlined"
                  sx={(theme) => ({
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.03),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Business fontSize="small" /> {t(Labels.voyage_koperative)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {voyage.koperative.name}
                  </Typography>
                </Paper>
              </Grid>
            )}

            {/* Description */}
            {voyage.description && (
              <Grid size={{ xs: 12 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {t(Labels.voyage_description)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {voyage.description}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            {t(Labels.common_close)}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return null;
}
