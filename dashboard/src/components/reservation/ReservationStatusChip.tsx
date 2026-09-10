import { Chip, alpha, type ChipProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  ReservationStatusEnum,
  ReservationStatusLabels,
  PaymentStatusEnum,
  PaymentStatusLabels,
} from '@/types/reservation.types';

interface ReservationStatusChipProps {
  status: ReservationStatusEnum;
  size?: ChipProps['size'];
}

interface PaymentStatusChipProps {
  status: PaymentStatusEnum;
  size?: ChipProps['size'];
}

type StatusPaletteColor = 'success' | 'warning' | 'error' | 'info' | 'default';

const getReservationStatusColor = (status: ReservationStatusEnum): StatusPaletteColor => {
  switch (status) {
    case ReservationStatusEnum.CONFIRMED:
    case ReservationStatusEnum.COMPLETED:
      return 'success';
    case ReservationStatusEnum.PENDING_PAYMENT:
      return 'warning';
    case ReservationStatusEnum.CANCELLED_BY_USER:
    case ReservationStatusEnum.CANCELLED_BY_OPERATOR:
    case ReservationStatusEnum.NO_SHOW:
      return 'error';
    default:
      return 'default';
  }
};

const getPaymentStatusColor = (status: PaymentStatusEnum): StatusPaletteColor => {
  switch (status) {
    case PaymentStatusEnum.PAID:
      return 'success';
    case PaymentStatusEnum.PARTIALLY_PAID:
      return 'info';
    case PaymentStatusEnum.PENDING:
      return 'warning';
    case PaymentStatusEnum.FAILED:
    case PaymentStatusEnum.REFUNDED:
      return 'error';
    default:
      return 'default';
  }
};

export function ReservationStatusChip({ status, size = 'small' }: ReservationStatusChipProps) {
  const { t } = useTranslation();
  const labelKey = ReservationStatusLabels[status];
  const label = labelKey ? t(labelKey) : status;
  const colorKey = getReservationStatusColor(status);

  return (
    <Chip
      label={label}
      size={size}
      sx={(theme) => {
        if (colorKey === 'default') {
          return {
            fontSize: '0.7rem',
            height: 24,
            fontWeight: 700,
            bgcolor: alpha(theme.palette.text.primary, 0.06),
            color: 'text.secondary',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.6),
          };
        }
        const color = theme.palette[colorKey].main;
        return {
          fontSize: '0.7rem',
          height: 24,
          fontWeight: 700,
          bgcolor: alpha(color, 0.1),
          color: `${colorKey}.main`,
          border: '1px solid',
          borderColor: alpha(color, 0.25),
        };
      }}
    />
  );
}

export function PaymentStatusChip({ status, size = 'small' }: PaymentStatusChipProps) {
  const { t } = useTranslation();
  const labelKey = PaymentStatusLabels[status];
  const label = labelKey ? t(labelKey) : status;
  const colorKey = getPaymentStatusColor(status);

  return (
    <Chip
      label={label}
      size={size}
      sx={(theme) => {
        if (colorKey === 'default') {
          return {
            fontSize: '0.7rem',
            height: 24,
            fontWeight: 700,
            bgcolor: alpha(theme.palette.text.primary, 0.06),
            color: 'text.secondary',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.6),
          };
        }
        const color = theme.palette[colorKey].main;
        return {
          fontSize: '0.7rem',
          height: 24,
          fontWeight: 700,
          bgcolor: alpha(color, 0.1),
          color: `${colorKey}.main`,
          border: '1px solid',
          borderColor: alpha(color, 0.25),
        };
      }}
    />
  );
}
