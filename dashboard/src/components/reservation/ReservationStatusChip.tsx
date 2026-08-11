import { Chip, type ChipProps } from '@mui/material';
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

const getReservationStatusColor = (status: ReservationStatusEnum): ChipProps['color'] => {
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

const getPaymentStatusColor = (status: PaymentStatusEnum): ChipProps['color'] => {
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
  return <Chip label={t(ReservationStatusLabels[status])} color={getReservationStatusColor(status)} size={size} />;
}

export function PaymentStatusChip({ status, size = 'small' }: PaymentStatusChipProps) {
  const { t } = useTranslation();
  return (
    <Chip label={t(PaymentStatusLabels[status])} color={getPaymentStatusColor(status)} size={size} variant="outlined" />
  );
}
