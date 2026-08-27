import React from 'react';
import { alpha, Grid, Paper, Stack, Theme, Typography } from '@mui/material';
import Labels from '@/labelKeys.json';
import { Reservation } from '@/types';

interface PaymentSummaryProps {
  reservation: Reservation;
  theme: Theme;
  t: (key: string) => string;
  language: string;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ reservation, theme, t, language }) => {
  const formatCurrency = (amount: number | undefined) => {
    if (amount) {
      const locale = language === 'en' ? 'en-US' : 'fr-FR';
      return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 0 }).format(amount)} Ar`;
    }
    return '0 Ar';
  };

  const getPaidAmount = () => {
    if (reservation.facturation) {
      const total = reservation.facturation.totalAmount ?? 0;
      const remaining = reservation.facturation.remainingAmount ?? 0;
      return total - remaining;
    }
    return reservation.totalAmount;
  };

  return (
    <Stack spacing={2}>
      <Typography
        variant="subtitle2"
        color="primary"
        sx={{
          fontWeight: 600,
        }}
      >
        {t(Labels.payment_total)}
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1,
              bgcolor: alpha(theme.palette.info.main, 0.08),
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha(theme.palette.info.main, 0.2),
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mb: 0.5,
                display: 'block',
              }}
            >
              {t(Labels.voyage_price_per_seat)}
            </Typography>
            <Typography
              variant="h6"
              color="info"
              sx={{
                fontWeight: 700,
              }}
            >
              {formatCurrency(reservation.voyage?.pricePerSeat)}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.2),
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mb: 0.5,
                display: 'block',
              }}
            >
              {t(Labels.payment_total)}
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 700,
              }}
            >
              {formatCurrency(reservation.totalAmount)}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1,
              bgcolor: alpha(theme.palette.success.main, 0.08),
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha(theme.palette.success.main, 0.2),
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mb: 0.5,
                display: 'block',
              }}
            >
              {t(Labels.paid_amount)}
            </Typography>
            <Typography
              variant="h6"
              color="success"
              sx={{
                fontWeight: 700,
              }}
            >
              {formatCurrency(getPaidAmount())}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1,
              bgcolor: alpha(
                (reservation.facturation?.remainingAmount ?? 0) > 0
                  ? theme.palette.warning.main
                  : theme.palette.success.main,
                0.08,
              ),
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha(
                (reservation.facturation?.remainingAmount ?? 0) > 0
                  ? theme.palette.warning.main
                  : theme.palette.success.main,
                0.2,
              ),
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mb: 0.5,
                display: 'block',
              }}
            >
              {t(Labels.remaining_amount)}
            </Typography>
            <Typography
              variant="h6"
              color={(reservation.facturation?.remainingAmount ?? 0) > 0 ? 'warning.main' : 'success.main'}
              sx={{
                fontWeight: 700,
              }}
            >
              {formatCurrency(reservation.facturation?.remainingAmount)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};
