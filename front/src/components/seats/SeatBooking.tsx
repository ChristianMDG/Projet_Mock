import React, { useCallback, useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  type DialogProps,
  DialogTitle,
  Typography,
  Snackbar,
} from '@mui/material';
import BookIcon from '@mui/icons-material/BookOnline';
import CheckIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import SeatIcon from '@mui/icons-material/EventSeat';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import AirlineSeatLegroomExtraRoundedIcon from '@mui/icons-material/AirlineSeatLegroomExtraRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useTranslation } from 'react-i18next';
import { useSeatManagement } from '@/hooks/seat.hooks';
import { useConfirmReservationWithoutVoyageur } from '@/hooks/reservation.hook';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/models/Voyage';
import { SeatConfig } from '@/types/type.props';
import { KrafterViewer } from '@/components/KrafterViewer';
import { ReservationFormDrawer } from '@/components/reservation';
import ButtonTx from '@/components/ui/ButtonTx';
import { trackEvent } from '@/hooks/google-analytics.hook';

interface SeatBookingProps {
  voyage: Voyage;
  onBookingComplete?: (seatConfigs: SeatConfig[]) => void;
  maxSeatsPerBooking?: number;
  multiSelect?: boolean;
  showAdvancedControls?: boolean;
  enableBookingFlow?: boolean;
}

const CENTERED_DIALOG_SLOT_PROPS: DialogProps['slotProps'] = {
  paper: {
    sx: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      m: 0,
    },
  },
};

/**
 * Seat Booking component with comprehensive booking functionality
 * Integrates with KrafterViewer for seat selection and ReservationFormDrawer for booking
 */
export const SeatBooking: React.FC<SeatBookingProps> = ({
  voyage,
  onBookingComplete,
  maxSeatsPerBooking = 4,
  multiSelect = true,
  showAdvancedControls = true,
  enableBookingFlow = true,
}) => {
  const { t } = useTranslation();

  // State management
  const [selectedSeats, setSelectedSeats] = useState<SeatConfig[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showOperatorConfirmDialog, setShowOperatorConfirmDialog] = useState(false);
  const [showReservationTypeDialog, setShowReservationTypeDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Hooks for seat management
  const {
    loading: seatsLoading,
    error: seatsError,
    getSeatStatus,
    actualAvailableSeats,
    reservedSeatsCount,
  } = useSeatManagement({
    voyage,
    selectedSeats,
    onSelectSeat: handleSeatSelection,
    multiSelect,
  });

  // Hook for operator/admin confirmation
  const {
    confirmReservation,
    isLoading: isConfirming,
    isSuccess,
    isError,
    error: confirmError,
    canConfirmWithoutVoyageur,
  } = useConfirmReservationWithoutVoyageur();

  // Handle success/error notifications
  useEffect(() => {
    if (isSuccess) {
      setSnackbarMessage(t(Labels.reservation_confirmed_success));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSelectedSeats([]);
      setShowOperatorConfirmDialog(false);
    }
  }, [isSuccess, t]);

  useEffect(() => {
    if (isError) {
      setSnackbarMessage(confirmError?.message ?? t(Labels.reservation_confirmed_error));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [isError, confirmError, t]);

  function handleSeatSelection(seatConfig: SeatConfig) {
    const seatNumber = seatConfig.id;
    const seatStatus = getSeatStatus(seatNumber);

    // Prevent selection of unavailable seats
    if (seatStatus === 'reserved' || seatStatus === 'blocked') {
      return;
    }

    setSelectedSeats(prev => {
      if (prev.some(sc => sc.id === seatNumber)) {
        return prev.filter(sc => sc.id !== seatNumber);
      }

      if (!multiSelect) {
        return [seatConfig];
      }

      if (prev.length >= maxSeatsPerBooking) {
        return [...prev.slice(1), seatConfig];
      }

      return [...prev, seatConfig];
    });
  }

  const handleBookingConfirm = useCallback(() => {
    if (selectedSeats.length === 0) return;

    trackEvent('booking_initiated', 'Booking', `Initiate Booking for Voyage ID: ${voyage.id}`);

    if (enableBookingFlow) {
      setShowReservationForm(true);
    } else {
      onBookingComplete?.(selectedSeats);
    }
    setShowConfirmDialog(false);
  }, [selectedSeats, enableBookingFlow, onBookingComplete]);

  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const handleOperatorConfirm = useCallback(() => {
    if (selectedSeats.length > 0 && voyage.id) {
      confirmReservation({
        voyageId: voyage.id,
        crafterId: voyage?.crafter?.id ?? null,
        seatNumbers: selectedSeats.map(seat => seat.id.toString()),
        notes: 'Réservation confirmée par opérateur sans voyageur',
      });
    }
  }, [selectedSeats, voyage, confirmReservation]);

  if (seatsLoading) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6">{t(Labels.loading)}</Typography>
      </Box>
    );
  }

  if (seatsError) {
    return <Alert severity="error">{t(Labels.error_loading_seats)}</Alert>;
  }

  return (
    <Box>
      {/* Header with seat summary */}
      {showAdvancedControls && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ pb: 1 }}>
            <Typography variant="h6">{t(Labels.seat_selection_title)}</Typography>
            <Typography variant="body2" color="text.secondary">
              {`${actualAvailableSeats} ${t(Labels.seat_available)}, ${reservedSeatsCount} ${t(Labels.seat_reserved)}`}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', sm: 'space-between' },
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Chip
                icon={<AirlineSeatLegroomExtraRoundedIcon />}
                label={`${selectedSeats.length} ${t(Labels.seat_selected)}`}
                color={selectedSeats.length > 0 ? 'primary' : 'default'}
                variant={selectedSeats.length > 0 ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<PersonRoundedIcon />}
                label={`${reservedSeatsCount} ${t(Labels.seat_reserved)}`}
                color="error"
                variant="outlined"
              />
              {voyage.classe?.name && <Chip label={`${voyage.classe.name}`} color="secondary" variant="outlined" />}
              {selectedSeats.length > 0 && (
                <Chip
                  label={t(Labels.clear_selection)}
                  deleteIcon={<ClearIcon />}
                  onDelete={clearSelection}
                  onClick={clearSelection}
                  color="secondary"
                  clickable
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
      {/* Seat layout */}
      <Box
        sx={{
          mb: 2,
        }}
      >
        <KrafterViewer
          voyage={voyage}
          selectedSeats={selectedSeats}
          onSelectSeat={handleSeatSelection}
          multiSelect={multiSelect}
        />
      </Box>
      {/* Action buttons */}
      {selectedSeats.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <ButtonTx
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              trackEvent('reserve_seat_clicked', 'Booking', `Reserve ${selectedSeats.length} seats`);
              setShowReservationTypeDialog(true);
            }}
            startIcon={<BookIcon />}
            sx={{ minWidth: 250 }}
          >
            {t(Labels.button_reserve_seats)} ({selectedSeats.length})
          </ButtonTx>
        </Box>
      )}
      {/* Reservation type selection dialog */}
      <Dialog
        open={showReservationTypeDialog}
        onClose={() => setShowReservationTypeDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={CENTERED_DIALOG_SLOT_PROPS}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <BookIcon color="primary" />
            {t(Labels.select_reservation_type)}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            {selectedSeats.length} {t(Labels.seat_label)} {t(Labels.selected_seats).toLowerCase()}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Standard reservation with passenger */}
            <Card
              sx={{
                cursor: 'pointer',
                border: '2px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  boxShadow: 3,
                  borderColor: 'primary.dark',
                },
              }}
              onClick={() => {
                setShowReservationTypeDialog(false);
                setShowConfirmDialog(true);
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <PersonRoundedIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {t(Labels.reservation_with_passenger)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(Labels.reservation_with_passenger_desc)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Operator reservation without passenger */}
            {canConfirmWithoutVoyageur && (
              <Card
                sx={{
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: 'secondary.main',
                  '&:hover': {
                    boxShadow: 3,
                    borderColor: 'secondary.dark',
                  },
                }}
                onClick={() => {
                  setShowReservationTypeDialog(false);
                  setShowOperatorConfirmDialog(true);
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <AdminIcon color="secondary" sx={{ fontSize: 40 }} />
                    <Box
                      sx={{
                        flex: 1,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {t(Labels.without_voyageur)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(Labels.reservation_without_passenger_desc)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReservationTypeDialog(false)} color="inherit">
            {t(Labels.button_cancel)}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Booking confirmation dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={CENTERED_DIALOG_SLOT_PROPS}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CheckIcon color="primary" />
            {t(Labels.confirm_booking_title)}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {t(Labels.confirm_selection_text)} {selectedSeats.length} {t(Labels.seat_label)}:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              mt: 1,
            }}
          >
            {selectedSeats.map(seatConfig => (
              <Chip
                key={seatConfig.id}
                label={`${t(Labels.seat_label)} ${seatConfig.id}`}
                icon={<SeatIcon />}
                color="primary"
                variant="filled"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="inherit">
            {t(Labels.ui_cancel)}
          </Button>
          <Button onClick={handleBookingConfirm} variant="contained" color="primary">
            {t(Labels.ui_confirm)}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Reservation form drawer */}
      {enableBookingFlow && (
        <ReservationFormDrawer
          open={showReservationForm}
          onClose={() => {
            setShowReservationForm(false);
            setSelectedSeats([]);
          }}
          voyage={voyage}
          selectedSeats={selectedSeats}
        />
      )}
      {/* Operator confirmation dialog */}
      <Dialog
        open={showOperatorConfirmDialog}
        onClose={() => setShowOperatorConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={CENTERED_DIALOG_SLOT_PROPS}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AdminIcon color="secondary" />
            {t(Labels.confirm_without_voyageur_title)}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {t(Labels.confirm_without_voyageur_text)} {selectedSeats.length} {t(Labels.seat_label)}{' '}
            {t(Labels.without_voyageur)}:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              mt: 2,
            }}
          >
            {selectedSeats.map(seatConfig => (
              <Chip
                key={seatConfig.id}
                label={`${t(Labels.seat_label)} ${seatConfig.id}`}
                icon={<SeatIcon />}
                color="secondary"
                variant="filled"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOperatorConfirmDialog(false)} color="inherit" disabled={isConfirming}>
            {t(Labels.ui_cancel)}
          </Button>
          <Button onClick={handleOperatorConfirm} variant="contained" color="secondary" disabled={isConfirming}>
            {isConfirming ? t(Labels.loading) : t(Labels.ui_confirm)}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SeatBooking;
