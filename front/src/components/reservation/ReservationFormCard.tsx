import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/models/Voyage';
import { Voyageur } from '@/models/Voyageur';
import { Seat } from '@/models/Seat';
import { SeatConfig } from '@/types/type.props';
import { ReservationStatusEnum, SeatStatusEnum } from '@/models/enums';
import StyledIcon from '@/components/ui/StyledIcon';
import { SelectedSeats } from '@/components/forms/SelectedSeats';
import { UserDetailsForm } from '@/components/forms/UserDetailsForm';
import { UserSearchForm } from '@/components/forms/UserSearchForm';
import type { UserFormData } from '@/types/user.type';
import { createReservationHandler, getEmptyUserForm } from '@/utils/reservation-form.utils';
import { useUpsertVoyageur } from '@/hooks/voyageur.hooks';
import { populateVoyageur } from '@/utils/populate.voyageur';
import { Crafter } from '@/types';
import { voyageKeys } from '@/hooks/voyage.hooks';
import { reservationKeys } from '@/hooks/reservation.hooks';
import { crafterKeys } from '@/hooks/crafter.hooks';
import { SEAT_ENTITY_KEYS } from '@/hooks/seat.hooks';
import { saveGuestReservationData } from '@/utils/guestReservation.utils';
import { trackEvent } from '@/hooks/google-analytics.hook';

interface ReservationFormCardProps {
  voyage: Voyage;
  selectedSeats: SeatConfig[];
  onClose: () => void;
  onSuccess?: (reservationCode: string) => void;
}

export const ReservationFormCard: React.FC<ReservationFormCardProps> = ({
  voyage,
  selectedSeats,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate: upsertVoyageur } = useUpsertVoyageur();

  const [userForm, setUserForm] = useState<UserFormData>(getEmptyUserForm());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isFormValid = !!(userForm.firstName && userForm.lastName && userForm.phone);

  const seats = useMemo(
    (): Seat[] =>
      selectedSeats.map(seatConfig => ({
        seatNum: seatConfig.id.toString(),
        voyage: { id: voyage.id } as Voyage,
        crafter: { id: voyage.crafter?.id } as Crafter,
        seatStatus: SeatStatusEnum.RESERVED,
        position: seatConfig.position,
      })),
    [selectedSeats, voyage.id, voyage.crafter?.id],
  );

  const handleUserFound = (user: Voyageur | null) => {
    if (user) {
      setUserForm(populateVoyageur(user));
    } else {
      setUserForm(getEmptyUserForm());
    }
  };

  const handleSearchValueChange = (searchValue: string) => {
    if (searchValue) {
      const isPhone = /^\d+$/.test(searchValue);
      setUserForm((prev: UserFormData) => ({
        ...prev,
        [isPhone ? 'phone' : 'idNumber']: searchValue,
      }));
    }
  };

  const handleSubmit = async () => {
    trackEvent('submit_passenger_details_clicked', 'Booking', 'Submit Passenger Details');
    setLoading(true);
    setError(null);

    try {
      const reservation = await createReservationHandler({
        voyage,
        selectedSeats: seats,
        userForm,
        notes,
        status: ReservationStatusEnum.PENDING_PAYMENT,
        upsertVoyageur,
      });

      // Save guest reservation data to localStorage for non-authenticated users
      if (userForm.phone || userForm.idNumber) {
        saveGuestReservationData({
          phoneNumber: userForm.phone ?? '',
          idNumber: userForm.idNumber ?? '',
        });
      }

      setSuccess(t(Labels.reservation_success_message));
      const reservationCode = reservation.bookingReference ?? reservation.id?.toString() ?? '';
      onSuccess?.(reservationCode);

      // Reset form fields so the UI is empty for a subsequent reservation
      setUserForm(getEmptyUserForm());
      setNotes('');

      if (voyage.id) {
        await queryClient.invalidateQueries({ queryKey: voyageKeys.detail(voyage.id) });
        await queryClient.invalidateQueries({ queryKey: reservationKeys.byVoyage(voyage.id) });
        if (voyage.crafter?.id) {
          await queryClient.invalidateQueries({ queryKey: crafterKeys.seatConfig(voyage.crafter.id) });
        }
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.byVoyage(voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.available(voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.reserved(voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.count(voyage.id) });
      }

      onClose();
    } catch (err) {
      const raw = err instanceof Error ? err.message : t(Labels.reservation_error_message);
      setError(raw.startsWith('error_') ? t(raw) : raw);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: { xs: '100vh', sm: 'auto' },
        maxHeight: { xs: '100vh', sm: '95vh' },
        borderRadius: { xs: 0, sm: 2 },
      }}
    >
      {/* Header */}
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledIcon icon={PersonIcon} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t(Labels.reservation_form_title)}
            </Typography>
          </Box>
        }
        action={
          <IconButton onClick={onClose} size="small">
            <CloseIcon color="primary" />
          </IconButton>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          <SelectedSeats voyage={voyage} selectedSeats={seats} />

          <UserSearchForm
            onUserFound={handleUserFound}
            onSearchValueChange={handleSearchValueChange}
            loading={loading}
            setLoading={setLoading}
          />

          <Divider>
            <Typography variant="body2" color="text.secondary">
              {t(Labels.or_enter_new_passenger_info)}
            </Typography>
          </Divider>

          <UserDetailsForm
            userForm={userForm}
            setUserForm={setUserForm}
            disabled={!!userForm.id}
            title={userForm.id ? t(Labels.passenger_details) : t(Labels.new_passenger_info)}
          />

          <TextField
            fullWidth
            label="Notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            variant="outlined"
            multiline
            rows={3}
            placeholder="Add any special notes or requests"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
        <Button fullWidth variant="outlined" onClick={onClose}>
          {t(Labels.ui_cancel)}
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          size="large"
        >
          {loading ? t(Labels.creating_reservation) : t(Labels.create_reservation)}
        </Button>
      </CardActions>
    </Card>
  );
};
