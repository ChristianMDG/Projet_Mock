import { useTranslation } from 'react-i18next';
import { IconButton, Stack, Tooltip, Divider, alpha } from '@mui/material';
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
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      {/* View action — always visible, visually distinct */}
      <Tooltip title={t(Labels.reservation_action_view)}>
        <IconButton
          size="small"
          onClick={() => onView(reservation)}
          sx={(theme) => ({
            color: theme.palette.info.main,
            bgcolor: alpha(theme.palette.info.main, 0.08),
            '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.18) },
          })}
        >
          <Visibility sx={{ fontSize: '1.1rem' }} />
        </IconButton>
      </Tooltip>

      {/* Separator between view and mutation actions */}
      <Divider orientation="vertical" flexItem sx={{ mx: 0.25, height: 20, alignSelf: 'center' }} />

      {/* Confirm action — only for PENDING_PAYMENT */}
      {isPending && (
        <Tooltip title={t(Labels.reservation_action_confirm)}>
          <span>
            <IconButton
              size="small"
              onClick={() => onConfirm(reservation)}
              disabled={confirmDisabled}
              sx={(theme) => ({
                color: theme.palette.success.main,
                bgcolor: alpha(theme.palette.success.main, 0.08),
                '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.18) },
                '&.Mui-disabled': { opacity: 0.4 },
              })}
            >
              <CheckCircle sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </span>
        </Tooltip>
      )}

      {/* Cancel action */}
      <Tooltip title={t(Labels.reservation_action_cancel)}>
        <span>
          <IconButton
            size="small"
            onClick={() => onCancel(reservation)}
            disabled={cancelDisabled || isCancelled}
            sx={(theme) => ({
              color: theme.palette.error.main,
              bgcolor: alpha(theme.palette.error.main, 0.08),
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.18) },
              '&.Mui-disabled': { opacity: 0.4 },
            })}
          >
            <Cancel sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
