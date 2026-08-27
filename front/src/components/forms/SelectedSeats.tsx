import React from 'react';
import { Box, Card, CardContent, Stack, Typography, Divider, Chip, Button, Slider } from '@mui/material';
import WorkspacePremium from '@mui/icons-material/WorkspacePremium';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/models/Voyage';
import { Seat } from '@/models/Seat';
import { useCurrencyFormatter } from '@/utils/currency.utils';
import { formatDateTime } from '@/utils/reservation-display.utils';
import { calculateDefaultAdvanceAmount, getMinAdvancePerSeat } from '@/utils/reservation.utils';
import KoperativeVerifiedIcon from '@/components/shared/KoperativeVerifiedIcon';
import TaxibrousseRedIcon from '@/components/ui/TaxibrousseRedIcon';
import { trackEvent } from '@/hooks/google-analytics.hook';
import VoyageTypeChip from '@/components/voyage/VoyageTypeChip';

interface SelectedSeatsProps {
  selectedSeats: Seat[];
  voyage: Voyage;
  guichetPhone?: string;
  discountAmount?: number;
  isPartial?: boolean;
  onPartialChange?: (checked: boolean) => void;
  advanceAmount?: number;
  onAdvanceAmountChange?: (amount: number) => void;
}

export const SelectedSeats: React.FC<SelectedSeatsProps> = ({
  selectedSeats,
  voyage,
  guichetPhone,
  discountAmount = 0,
  isPartial = true,
  onPartialChange,
  advanceAmount,
  onAdvanceAmountChange,
}) => {
  const { t, i18n } = useTranslation();
  const { formatAriary } = useCurrencyFormatter();

  const originalAmount = selectedSeats.length * voyage.pricePerSeat;
  const seatTotal = Math.max(originalAmount - discountAmount, 0);

  const minAdvance = Math.min(
    seatTotal,
    getMinAdvancePerSeat(voyage.pricePerSeat, voyage.pourcentageMinimumAvance) * selectedSeats.length,
  );
  const maxAdvance = seatTotal;
  const currentAdvanceAmount =
    advanceAmount ??
    calculateDefaultAdvanceAmount(
      seatTotal,
      voyage.pricePerSeat,
      selectedSeats.length,
      voyage.pourcentageMinimumAvance,
    );

  const serviceFee = seatTotal * 0.05;
  const totalWithFee = currentAdvanceAmount + serviceFee;

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                  {voyage?.typeVoyage && <VoyageTypeChip type={voyage.typeVoyage} />}
                </Box>
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
              {discountAmount > 0 ? (
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    {formatAriary(originalAmount)}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: 700 }}>
                    {formatAriary(seatTotal)}
                  </Typography>
                </Stack>
              ) : (
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {formatAriary(seatTotal)}
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Payment Type Selection (Avance vs Intégral) & 5% Service Fee */}
          {(onPartialChange || isPartial) && (
            <>
              <Divider />
              <Stack spacing={1.5}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {t(Labels.payment_option)}
                </Typography>
                {onPartialChange && (
                  <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
                    <Button
                      variant={isPartial ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => {
                        trackEvent('payment_mode_selected', 'Payment', 'Advance');
                        onPartialChange(true);
                      }}
                      sx={{
                        borderRadius: 3,
                        fontWeight: isPartial ? 800 : 600,
                        borderWidth: isPartial ? 0 : 2,
                        '&:hover': { borderWidth: isPartial ? 0 : 2 },
                      }}
                    >
                      {t(Labels.payment_option_advance)}
                    </Button>
                    <Button
                      variant={isPartial ? 'outlined' : 'contained'}
                      fullWidth
                      onClick={() => {
                        trackEvent('payment_mode_selected', 'Payment', '100% Full');
                        onPartialChange(false);
                      }}
                      sx={{
                        borderRadius: 3,
                        fontWeight: isPartial ? 600 : 800,
                        borderWidth: isPartial ? 2 : 0,
                        '&:hover': { borderWidth: isPartial ? 2 : 0 },
                      }}
                    >
                      {t(Labels.payment_option_full)}
                    </Button>
                  </Stack>
                )}

                {isPartial && (
                  <Box
                    sx={{
                      bgcolor: theme =>
                        theme.palette.mode === 'light' ? 'rgba(1,22,56,0.03)' : 'rgba(255,255,255,0.03)',
                      p: 2,
                      borderRadius: 3,
                      border: '1px dashed',
                      borderColor: 'primary.light',
                    }}
                  >
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {t(Labels.payment_option_advance_amount)}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {formatAriary(currentAdvanceAmount)}
                        </Typography>
                      </Box>

                      {onAdvanceAmountChange && minAdvance < maxAdvance && (
                        <Box sx={{ px: 1, py: 1 }}>
                          <Slider
                            value={currentAdvanceAmount}
                            min={minAdvance}
                            max={maxAdvance}
                            step={1000}
                            onChange={(_, newValue) => onAdvanceAmountChange(newValue as number)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={value => formatAriary(value)}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Min: {formatAriary(minAdvance)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Max: {formatAriary(maxAdvance)}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {t(Labels.payment_option_service_fee)}
                        </Typography>
                        <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                          {formatAriary(serviceFee)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 0.5 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {t(Labels.payment_option_total_now)}
                        </Typography>
                        <Typography variant="body1" color="primary" sx={{ fontWeight: 800 }}>
                          {formatAriary(totalWithFee)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic', display: 'block', mt: 0.5 }}
                      >
                        * {t(Labels.payment_option_remaining_hint)}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
