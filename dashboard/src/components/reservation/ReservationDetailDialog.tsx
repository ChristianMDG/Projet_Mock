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
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Person,
  DirectionsBus,
  EventSeat,
  Payment,
  CalendarToday,
  Phone,
  Email,
  ConfirmationNumber,
  Business,
  ExpandMore,
  TrendingUp,
  CreditCard,
} from '@mui/icons-material';
import type { Reservation } from '@/types/reservation.types';
import { useSeatsByVoyageAndReservation } from '@/hooks/seat.hook';
import type { Seat } from '@/types/voyage.types';
import Labels from '@/labelKeys.json';
import {
  ReservationStatusLabels,
  PaymentStatusLabels,
  ReservationStatusEnum,
  PaymentStatusEnum,
} from '@/types/reservation.types';
import { formatDateCustom } from '@/utils/format';

interface ReservationDetailDialogProps {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  if (status === 'CONFIRMED' || status === 'COMPLETED') return 'success';
  if (status === 'PENDING_PAYMENT') return 'warning';
  if (status.includes('CANCELLED') || status === 'NO_SHOW') return 'error';
  return 'default';
};

const getPaymentColor = (status: string) => {
  if (status === 'PAID') return 'success';
  if (status === 'PARTIALLY_PAID') return 'info';
  if (status === 'PENDING') return 'warning';
  if (status === 'FAILED') return 'error';
  return 'default';
};

const formatCurrency = (amount?: number | null) => `${(amount ?? 0).toLocaleString('fr-FR')} Ar`;
const formatFee = (amount?: number | null) => `- ${formatCurrency(amount ?? 0)}`;
const formatDepartureDate = (iso?: string) => formatDateCustom(iso, 'dddd D MMMM YYYY à HH:mm');

const OPERATOR_DISPLAY_NAMES: Record<string, string> = {
  MVOLA: 'MVola',
  ORANGE: 'Orange Money',
  AIRTEL: 'Airtel Money',
};

const formatOperatorName = (operator?: string): string => {
  if (operator) {
    const normalized = operator.toUpperCase();
    return OPERATOR_DISPLAY_NAMES[normalized] || operator;
  }
  return 'N/A';
};

const formatReservationNotes = (reservation: Reservation, fetchedSeats: Seat[]): string => {
  const { notes, facturation, voyageur } = reservation;
  if (notes) {
    const operator = formatOperatorName(facturation?.paymentMethodIdentifier);
    const phone = facturation?.paymentPhoneNumber || voyageur?.phone || 'N/A';
    const seatList = fetchedSeats.length > 0 ? fetchedSeats.map((s) => s.position ?? s.seatNum).join(', ') : 'Aucun';

    return notes.replace('{operator}', operator).replace('{phone}', phone).replace('{seats}', seatList);
  }
  return '';
};

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

function PaymentRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, color: valueColor }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function ReservationDetailDialog({ reservation, open, onClose }: ReservationDetailDialogProps) {
  const { t } = useTranslation();

  const voyageId = reservation?.voyage?.id;
  const reservationId = reservation?.id;

  const { data: seats = [], isLoading: seatsLoading } = useSeatsByVoyageAndReservation(
    open && voyageId ? voyageId : undefined,
    open && reservationId ? reservationId : undefined
  );

  const showSkeleton = seatsLoading;
  const hasSeats = seats.length > 0;
  const showSeats = Boolean(!seatsLoading && hasSeats);

  if (reservation) {
    const voyageur = reservation.voyageur;
    const voyage = reservation.voyage;
    const facturation = reservation.facturation;
    const hasNotes = Boolean(reservation.notes);

    const paidAmount = facturation
      ? (reservation.totalAmount ?? facturation.totalAmount ?? 0) - (facturation.remainingAmount ?? 0)
      : 0;

    const {
      commissionSeats = 0,
      commissionFee = 0,
      fraisTransaction = 0,
      fraisRetrait = 0,
      fraisTransfert = 0,
      fraisTotal = 0,
      commission: commissionNette = 0,
    } = facturation ?? {};

    const commissionBrute = commissionSeats + commissionFee;
    const hasCommission = commissionBrute > 0 || commissionNette !== 0;
    const hasFrais = fraisTotal > 0;

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
                bgcolor: 'primary.main',
                width: 36,
                height: 36,
              }}
            >
              <ConfirmationNumber fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                {t(Labels.reservation_detail_title)} {reservation.bookingReference}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID #{reservation.id}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={t(ReservationStatusLabels[reservation.status as ReservationStatusEnum] ?? reservation.status)}
            color={getStatusColor(reservation.status) as any}
            size="small"
          />
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2.5 }}>
          <Grid container spacing={3}>
            {/* Voyageur Info */}
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
                  <Person fontSize="small" /> {t(Labels.reservation_traveler)}
                </Typography>
                <Stack spacing={1.5}>
                  <InfoRow
                    icon={<Person sx={{ fontSize: '1rem' }} />}
                    label={t(Labels.reservation_full_name)}
                    value={voyageur ? `${voyageur.firstName} ${voyageur.lastName}` : 'N/A'}
                  />
                  {voyageur?.phone && (
                    <InfoRow
                      icon={<Phone sx={{ fontSize: '1rem' }} />}
                      label={t(Labels.reservation_phone)}
                      value={voyageur.phone}
                    />
                  )}
                  {voyageur?.email && (
                    <InfoRow
                      icon={<Email sx={{ fontSize: '1rem' }} />}
                      label={t(Labels.reservation_email)}
                      value={voyageur.email}
                    />
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Voyage Info */}
            {voyage && (
              <Grid size={{ xs: 12, sm: voyage.koperative ? 6 : 12 }}>
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
                    <DirectionsBus fontSize="small" /> {t(Labels.reservation_voyage)}
                  </Typography>
                  <Stack spacing={1.5}>
                    <InfoRow
                      icon={<DirectionsBus sx={{ fontSize: '1rem' }} />}
                      label={t(Labels.reservation_route)}
                      value={`${voyage.departureGare?.ville?.name ?? voyage.departureCity ?? '?'} → ${voyage.arrivalGare?.ville?.name ?? voyage.arrivalCity ?? '?'}`}
                    />
                    {voyage.departureTime && (
                      <InfoRow
                        icon={<CalendarToday sx={{ fontSize: '1rem' }} />}
                        label={t(Labels.reservation_departure_date)}
                        value={formatDepartureDate(voyage.departureTime)}
                      />
                    )}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Koperative Info */}
            {voyage?.koperative && (
              <Grid size={{ xs: 12, sm: 6 }}>
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
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Business fontSize="small" /> {t(Labels.reservation_koperative_info)}
                  </Typography>
                  <Stack spacing={1.5}>
                    <InfoRow
                      icon={<Business sx={{ fontSize: '1rem' }} />}
                      label={t(Labels.reservation_koperative_name)}
                      value={voyage.koperative.name || 'N/A'}
                    />
                    {voyage.koperative.phone && (
                      <InfoRow
                        icon={<Phone sx={{ fontSize: '1rem' }} />}
                        label={t(Labels.reservation_koperative_phone)}
                        value={voyage.koperative.phone}
                      />
                    )}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Seats */}
            {showSkeleton && (
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
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <EventSeat fontSize="small" /> {t(Labels.reservation_seats)}
                    {reservation.seatCount ? ` (${reservation.seatCount})` : ''}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }} useFlexGap>
                    {Array.from({ length: 3 }, (_, index) => (
                      <Skeleton key={index} variant="rectangular" width={40} height={24} sx={{ borderRadius: 1 }} />
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {showSeats && (
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
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <EventSeat fontSize="small" /> {t(Labels.reservation_seats)} ({seats.length})
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }} useFlexGap>
                    {seats.map((seat) => (
                      <Chip
                        key={seat.id}
                        label={seat.position ?? seat.seatNum}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Payment Info */}
            <Grid
              size={{
                xs: 12,
                sm: showSkeleton || hasSeats ? 6 : 12,
              }}
            >
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
                  <Payment fontSize="small" /> {t(Labels.reservation_payment)}
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {t(Labels.reservation_total_amount)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {formatCurrency(reservation.totalAmount)}
                    </Typography>
                  </Box>
                  {facturation && (
                    <>
                      <PaymentRow
                        label={t(Labels.reservation_paid)}
                        value={formatCurrency(paidAmount)}
                        valueColor="success.main"
                      />
                      {facturation.remainingAmount != null && facturation.remainingAmount > 0 && (
                        <PaymentRow
                          label={t(Labels.reservation_remaining)}
                          value={formatCurrency(facturation.remainingAmount)}
                          valueColor="error.main"
                        />
                      )}
                      {(hasCommission || hasFrais) && (
                        <Stack spacing={1} sx={{ pt: 0.5 }}>
                          <Divider sx={{ my: 0.5, opacity: 0.5 }} />

                          {/* Accordion Revenus */}
                          {commissionBrute > 0 && (
                            <Accordion
                              disableGutters
                              elevation={0}
                              defaultExpanded
                              sx={(theme) => ({
                                border: '1px solid',
                                borderColor: alpha(theme.palette.divider, 0.6),
                                borderRadius: '8px !important',
                                '&:before': { display: 'none' },
                                overflow: 'hidden',
                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                                boxShadow: 'none',
                              })}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMore sx={{ fontSize: '1rem', color: 'text.secondary' }} />}
                                sx={{
                                  minHeight: 36,
                                  px: 1.25,
                                  py: 0.5,
                                  '&.Mui-expanded': { minHeight: 36 },
                                  '& .MuiAccordionSummary-content': {
                                    my: 0.5,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mr: 0.5,
                                  },
                                  '& .MuiAccordionSummary-content.Mui-expanded': { my: 0.5 },
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                  <TrendingUp sx={{ fontSize: '0.9rem', color: 'info.main' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                                    {t(Labels.finance_breakdown_revenue_section)}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'info.main' }}
                                >
                                  {formatCurrency(commissionBrute)}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails
                                sx={(theme) => ({
                                  px: 1.25,
                                  py: 0.75,
                                  borderTop: '1px solid',
                                  borderColor: alpha(theme.palette.divider, 0.4),
                                  bgcolor: alpha(theme.palette.action.hover, 0.03),
                                })}
                              >
                                <Stack spacing={0.75}>
                                  {commissionSeats > 0 && (
                                    <PaymentRow
                                      label={t(Labels.finance_breakdown_commission_sieges)}
                                      value={formatCurrency(commissionSeats)}
                                    />
                                  )}
                                  {commissionFee > 0 && (
                                    <PaymentRow
                                      label={t(Labels.finance_breakdown_commission_fee)}
                                      value={formatCurrency(commissionFee)}
                                    />
                                  )}
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                          )}

                          {/* Accordion Frais / Coûts */}
                          {hasFrais && (
                            <Accordion
                              disableGutters
                              elevation={0}
                              defaultExpanded
                              sx={(theme) => ({
                                border: '1px solid',
                                borderColor: alpha(theme.palette.divider, 0.6),
                                borderRadius: '8px !important',
                                '&:before': { display: 'none' },
                                overflow: 'hidden',
                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                                boxShadow: 'none',
                              })}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMore sx={{ fontSize: '1rem', color: 'text.secondary' }} />}
                                sx={{
                                  minHeight: 36,
                                  px: 1.25,
                                  py: 0.5,
                                  '&.Mui-expanded': { minHeight: 36 },
                                  '& .MuiAccordionSummary-content': {
                                    my: 0.5,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mr: 0.5,
                                  },
                                  '& .MuiAccordionSummary-content.Mui-expanded': { my: 0.5 },
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                  <CreditCard sx={{ fontSize: '0.9rem', color: 'error.main' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                                    {t(Labels.finance_breakdown_cost_section)}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'error.main' }}
                                >
                                  {formatFee(fraisTotal)}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails
                                sx={(theme) => ({
                                  px: 1.25,
                                  py: 0.75,
                                  borderTop: '1px solid',
                                  borderColor: alpha(theme.palette.divider, 0.4),
                                  bgcolor: alpha(theme.palette.action.hover, 0.03),
                                })}
                              >
                                <Stack spacing={0.75}>
                                  {fraisTransaction > 0 && (
                                    <PaymentRow
                                      label={t(Labels.finance_breakdown_frais_transaction)}
                                      value={formatFee(fraisTransaction)}
                                      valueColor="error.main"
                                    />
                                  )}
                                  {fraisRetrait > 0 && (
                                    <PaymentRow
                                      label={t(Labels.finance_breakdown_frais_retrait)}
                                      value={formatFee(fraisRetrait)}
                                      valueColor="error.main"
                                    />
                                  )}
                                  {fraisTransfert > 0 && (
                                    <PaymentRow
                                      label={t(Labels.finance_breakdown_frais_transfert)}
                                      value={formatFee(fraisTransfert)}
                                      valueColor="error.main"
                                    />
                                  )}
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                          )}

                          {/* Commission Nette Summary */}
                          {commissionNette !== 0 && (
                            <Box
                              sx={(theme) => ({
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                px: 1.25,
                                py: 0.75,
                                borderRadius: 1.5,
                                bgcolor: alpha(
                                  commissionNette >= 0 ? theme.palette.success.main : theme.palette.error.main,
                                  0.08
                                ),
                                border: '1px solid',
                                borderColor: alpha(
                                  commissionNette >= 0 ? theme.palette.success.main : theme.palette.error.main,
                                  0.2
                                ),
                              })}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                                {t(Labels.finance_breakdown_commission_nette)}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  color: commissionNette >= 0 ? 'success.main' : 'error.main',
                                }}
                              >
                                {formatCurrency(commissionNette)}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      )}

                      <Divider sx={{ my: 0.5, opacity: 0.5 }} />
                      {/* Operator / Phone info */}
                      {facturation.paymentMethodIdentifier && (
                        <PaymentRow label="Opérateur" value={formatOperatorName(facturation.paymentMethodIdentifier)} />
                      )}
                      {facturation.paymentPhoneNumber && (
                        <PaymentRow label="Téléphone" value={facturation.paymentPhoneNumber} />
                      )}
                      <Box sx={{ pt: 0.5 }}>
                        <Chip
                          label={
                            t(PaymentStatusLabels[facturation.paymentStatus as PaymentStatusEnum]) ??
                            facturation.paymentStatus
                          }
                          color={getPaymentColor(facturation.paymentStatus) as any}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    </>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Notes */}
            {hasNotes && (
              <Grid size={{ xs: 12 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {t(Labels.reservation_notes)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {formatReservationNotes(reservation, seats)}
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
