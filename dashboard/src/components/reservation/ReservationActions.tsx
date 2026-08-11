import { useTranslation } from 'react-i18next';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { Visibility, Cancel, CheckCircle } from '@mui/icons-material';
import type { Reservation } from '@/types/reservation.types';
import Labels from '@/labelKeys.json';

interface ReservationActionsProps {
  reservation: Reservation;
  onView: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
  onConfirm: (reservation: Reservation) => void;
  cancelDisabled?: boolean;
  confirmDisabled?: boolean;
}

export default function ReservationActions({
  reservation,
  onView,
  onCancel,
  onConfirm,
  cancelDisabled = false,
  confirmDisabled = false,
}: ReservationActionsProps) {
  const { t } = useTranslation();
  const isCancelled = reservation.status?.includes('CANCELLED');
  const isPending = reservation.status === 'PENDING_PAYMENT';

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title={t(Labels.reservation_action_view)}>
        <IconButton size="small" onClick={() => onView(reservation)} color="info">
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      {isPending && (
        <Tooltip title={t(Labels.reservation_action_confirm)}>
          <span>
            <IconButton size="small" onClick={() => onConfirm(reservation)} color="success" disabled={confirmDisabled}>
              <CheckCircle fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
      <Tooltip title={t(Labels.reservation_action_cancel)}>
        <span>
          <IconButton
            size="small"
            onClick={() => onCancel(reservation)}
            color="error"
            disabled={cancelDisabled || isCancelled}
          >
            <Cancel fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
