import React, { useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SeatIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReservationIcon from '@mui/icons-material/EventSeat';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import RestoreIcon from '@mui/icons-material/RestoreFromTrash';
import SearchIcon from '@mui/icons-material/Search';

import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useDeleteReservation, useReservationsByVoyageId, useUpdateReservation } from '@/hooks/reservation.hooks';
import { useFilteredVoyages } from '@/hooks/voyage.hooks';
import { useKoperatives } from '@/hooks/koperative.hooks';
import type { Reservation, Voyage } from '@/types';
import { ReservationStatusEnum } from '@/models/enums';
import IconButtonTx from '@/components/ui/IconButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import ProtectedTx from '@/components/ProtectedTx';
import { VoyageFilter } from '@/types/models';
import dayjs from '@/utils/dayjs';
import { KrafterViewer } from '@/components/KrafterViewer';
import Labels from '@/labelKeys.json';
import { ROUTES, generateRoute } from '@/constants/routes';
import SEO from '@/components/shared/SEO';
import VoyageIcon from '@/components/shared/VehicleIcon';

interface ReservationManagementState {
  selectedVoyage: Voyage | null;
  selectedReservation: Reservation | null;
  isFormOpen: boolean;
  deleteConfirmOpen: boolean;
  reservationToDelete: Reservation | null;
  searchTerm: string;
  statusFilter: string;
}

const ReservationPage: React.FC = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { voyageId } = useParams<{ voyageId?: string }>();
  const navigate = useNavigate();

  // State management
  const [state, setState] = useState<ReservationManagementState>({
    selectedVoyage: null,
    selectedReservation: null,
    isFormOpen: false,
    deleteConfirmOpen: false,
    reservationToDelete: null,
    searchTerm: '',
    statusFilter: 'all',
  });

  // Status confirmation dialog state
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    reservation: Reservation | null;
    newStatus: ReservationStatusEnum | '';
    action: 'confirm' | 'cancel' | 'reopen';
  }>({
    open: false,
    reservation: null,
    newStatus: '',
    action: 'confirm',
  });

  // Data fetching
  const { data: koperatives = [] } = useKoperatives();
  const filteredKoperatives = useMemo(() => {
    if (user?.koperative?.id) {
      return koperatives.filter(k => k.id === user.koperative?.id);
    }
    return koperatives;
  }, [koperatives, user?.koperative?.id]);

  // Get today's voyages for the koperative
  const voyageFilter: VoyageFilter = useMemo(
    () => ({
      koperativeId: user?.koperative?.id ?? filteredKoperatives[0]?.id,
      departureDate: dayjs().tz('Indian/Antananarivo').format('YYYY-MM-DD'),
      language: i18n.language,
    }),
    [user?.koperative?.id, filteredKoperatives, i18n.language],
  );

  const { data: voyages = [], isLoading: voyagesLoading } = useFilteredVoyages(voyageFilter);

  // Get reservations for selected voyage
  const selectedVoyageId = voyageId ? Number.parseInt(voyageId, 10) : state.selectedVoyage?.id;
  const {
    data: reservations = [],
    isLoading: reservationsLoading,
    error: reservationsError,
  } = useReservationsByVoyageId(selectedVoyageId ?? 0);

  // Mutations
  const updateMutation = useUpdateReservation();
  const deleteMutation = useDeleteReservation();

  // Note: KrafterViewer handles its own seat state

  // Computed values
  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => {
      const matchesSearch =
        /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
        reservation.bookingReference?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        reservation.voyageur?.firstName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        reservation.voyageur?.lastName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        reservation.seats?.some(seat => seat.seatNum?.includes(state.searchTerm));
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */

      const matchesStatus =
        state.statusFilter === 'all' ||
        (state.statusFilter === 'pending' && reservation.status === ReservationStatusEnum.PENDING_PAYMENT) ||
        (state.statusFilter === 'confirmed' && reservation.status === ReservationStatusEnum.CONFIRMED) ||
        (state.statusFilter === 'cancelled' &&
          (reservation.status === ReservationStatusEnum.CANCELLED_BY_USER ||
            reservation.status === ReservationStatusEnum.CANCELLED_BY_OPERATOR));

      return matchesSearch && matchesStatus;
    });
  }, [reservations, state.searchTerm, state.statusFilter]);

  const reservationStats = useMemo(() => {
    const confirmed = reservations.filter(r => r.status === ReservationStatusEnum.CONFIRMED).length;
    const pending = reservations.filter(r => r.status === ReservationStatusEnum.PENDING_PAYMENT).length;
    const cancelled = reservations.filter(
      r =>
        r.status === ReservationStatusEnum.CANCELLED_BY_USER ||
        r.status === ReservationStatusEnum.CANCELLED_BY_OPERATOR,
    ).length;
    const totalRevenue = reservations
      .filter(r => r.status === ReservationStatusEnum.CONFIRMED)
      .reduce((sum, r) => sum + (r.totalAmount ?? 0), 0);

    return { confirmed, pending, cancelled, totalRevenue, total: reservations.length };
  }, [reservations]);

  // Handlers
  const handlers = {
    handleVoyageSelect: (voyage: Voyage | null) => {
      setState(prev => ({ ...prev, selectedVoyage: voyage }));
      if (voyage?.id) {
        navigate(generateRoute.reservationsByVoyage(voyage.id, i18n.language));
      }
    },

    handleEditReservation: (reservation: Reservation) => {
      setState(prev => ({
        ...prev,
        selectedReservation: reservation,
        isFormOpen: true,
      }));
    },

    handleDeleteReservation: (reservation: Reservation) => {
      setState(prev => ({
        ...prev,
        reservationToDelete: reservation,
        deleteConfirmOpen: true,
      }));
    },

    handleFormClose: () => {
      setState(prev => ({
        ...prev,
        isFormOpen: false,
        selectedReservation: null,
      }));
    },

    handleSearchChange: (searchTerm: string) => {
      setState(prev => ({ ...prev, searchTerm }));
    },

    handleStatusFilterChange: (status: string) => {
      setState(prev => ({ ...prev, statusFilter: status }));
    },

    handleConfirmDelete: () => {
      if (state.reservationToDelete?.id) {
        deleteMutation.mutate(state.reservationToDelete.id, {
          onSuccess: () => {
            setState(prev => ({
              ...prev,
              deleteConfirmOpen: false,
              reservationToDelete: null,
            }));
          },
        });
      }
    },

    handleDeleteCancel: () => {
      setState(prev => ({
        ...prev,
        deleteConfirmOpen: false,
        reservationToDelete: null,
      }));
    },

    handleStatusUpdate: (reservation: Reservation, newStatus: ReservationStatusEnum) => {
      updateMutation.mutate({
        id: reservation.id!,
        data: { ...reservation, status: newStatus },
      });
    },

    // Status management handlers
    handleMarkAsPaid: (reservation: Reservation) => {
      setStatusDialog({
        open: true,
        reservation,
        newStatus: ReservationStatusEnum.CONFIRMED,
        action: 'confirm',
      });
    },

    handleCancelReservation: (reservation: Reservation) => {
      setStatusDialog({
        open: true,
        reservation,
        newStatus: ReservationStatusEnum.CANCELLED_BY_OPERATOR,
        action: 'cancel',
      });
    },

    handleReopenReservation: (reservation: Reservation) => {
      setStatusDialog({
        open: true,
        reservation,
        newStatus: ReservationStatusEnum.PENDING_PAYMENT,
        action: 'reopen',
      });
    },

    handleConfirmStatusChange: () => {
      if (statusDialog.reservation?.id && statusDialog.newStatus !== '') {
        updateMutation.mutate(
          {
            id: statusDialog.reservation.id,
            data: { ...statusDialog.reservation, status: statusDialog.newStatus },
          },
          {
            onSuccess: () => {
              setStatusDialog({
                open: false,
                reservation: null,
                newStatus: '',
                action: 'confirm',
              });
            },
          },
        );
      }
    },

    handleCancelStatusChange: () => {
      setStatusDialog({
        open: false,
        reservation: null,
        newStatus: '',
        action: 'confirm',
      });
    },
  };

  const getStatusColor = (
    status: string,
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return t(Labels.reservation_status_confirmed);
      case 'pending':
        return t(Labels.reservation_status_pending);
      case 'cancelled':
        return t(Labels.reservation_status_cancelled);
      default:
        return status;
    }
  };

  if (reservationsError) {
    return (
      <Box
        sx={{
          maxWidth: 'lg',
        }}
      >
        <Alert severity="error">{t(Labels.ui_error_general)}</Alert>
      </Box>
    );
  }

  return (
    <>
      <SEO title={t(Labels.reservation_management_title)} />
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <StyledIcon icon={ReservationIcon} variant="primary" />
          <Typography variant="h4" component="h1">
            {t(Labels.reservation_management_title)}
          </Typography>
        </Box>
        <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE', 'GUICHET']}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(ROUTES.voyagesList[i18n.language])}
          >
            {t(Labels.reservation_new_booking)}
          </Button>
        </ProtectedTx>
      </Box>
      <Grid container spacing={3}>
        {/* Left Panel - Voyage Selection */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StyledIcon icon={VoyageIcon} />
                  <Typography variant="h6">{t(Labels.voyage_selection)}</Typography>
                </Box>
              }
            />
            <CardContent>
              <Autocomplete
                options={voyages}
                getOptionLabel={option =>
                  `${option.departureGare?.ville?.name ?? ''} → ${option.arrivalGare?.ville?.name ?? ''} (${dayjs(option.departureTime).format('HH:mm')})`
                }
                value={state.selectedVoyage}
                onChange={(_, value) => handlers.handleVoyageSelect(value)}
                loading={voyagesLoading}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t(Labels.voyage_select)}
                    placeholder={t(Labels.voyage_select_placeholder)}
                    margin="dense"
                  />
                )}
              />

              {state.selectedVoyage && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t(Labels.voyage_details)}
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <strong>{t(Labels.voyage_departure)}:</strong>{' '}
                      {dayjs(state.selectedVoyage.departureTime).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>{t(Labels.voyage_vehicle)}:</strong> {state.selectedVoyage.crafter?.model} (
                      {state.selectedVoyage.crafter?.registrationNumber})
                    </Typography>
                    <Typography variant="body2">
                      <strong>{t(Labels.voyage_driver)}:</strong> {state.selectedVoyage.chauffeur?.user?.firstName}{' '}
                      {state.selectedVoyage.chauffeur?.user?.lastName}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Statistics Card */}
          {selectedVoyageId && (
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t(Labels.reservation_statistics)} />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h4" color="success">
                        {reservationStats.confirmed}
                      </Typography>
                      <Typography variant="caption">{t(Labels.reservation_confirmed)}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h4" color="warning">
                        {reservationStats.pending}
                      </Typography>
                      <Typography variant="caption">{t(Labels.reservation_pending)}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h4" color="error">
                        {reservationStats.cancelled}
                      </Typography>
                      <Typography variant="caption">{t(Labels.reservation_cancelled)}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h4" color="primary">
                        {reservationStats.total}
                      </Typography>
                      <Typography variant="caption">{t(Labels.reservation_total)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2">
                    <strong>{t(Labels.reservation_revenue)}:</strong> {reservationStats.totalRevenue.toLocaleString()}{' '}
                    Ar
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Panel - Reservations List */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedVoyageId ? (
            <>
              {/* Search and Filter Bar */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    placeholder={t(Labels.search_reservation_placeholder)}
                    value={state.searchTerm}
                    onChange={e => handlers.handleSearchChange(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ flexGrow: 1, minWidth: 200 }}
                  />
                  <Autocomplete
                    options={['all', 'confirmed', 'pending', 'cancelled']}
                    getOptionLabel={option => getStatusLabel(option)}
                    value={state.statusFilter}
                    onChange={(_, value) => handlers.handleStatusFilterChange(value ?? 'all')}
                    renderInput={params => (
                      <TextField {...params} label={t(Labels.status_filter)} sx={{ minWidth: 150 }} margin="dense" />
                    )}
                  />
                </Box>
              </Paper>

              {/* Seat Map */}
              {state.selectedVoyage && (
                <Card sx={{ mb: 3 }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StyledIcon icon={SeatIcon} />
                        <Typography variant="h6">{t(Labels.seat_map)}</Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <KrafterViewer voyage={state.selectedVoyage} selectedSeats={[]} onSelectSeat={() => {}} />
                  </CardContent>
                </Card>
              )}

              {/* Reservations Table */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t(Labels.reservation_seat)}</TableCell>
                      <TableCell>{t(Labels.reservation_passenger)}</TableCell>
                      <TableCell>{t(Labels.reservation_reference)}</TableCell>
                      <TableCell>{t(Labels.reservation_status)}</TableCell>
                      <TableCell>{t(Labels.reservation_amount)}</TableCell>
                      <TableCell>{t(Labels.reservation_date)}</TableCell>
                      <TableCell align="center">{t(Labels.actions)}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservationsLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          {t(Labels.loading)}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {filteredReservations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              {state.searchTerm || state.statusFilter !== 'all'
                                ? t(Labels.no_results_found)
                                : t(Labels.no_reservations_found)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredReservations.map(reservation => (
                            <TableRow key={reservation.id} hover>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                    {reservation.seats?.[0]?.seatNum ?? '?'}
                                  </Avatar>
                                  <Typography variant="body2">
                                    {t(Labels.seat_label)}{' '}
                                    {reservation.seats?.map(seat => seat.seatNum).join(', ') ?? 'N/A'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PersonIcon
                                    sx={{
                                      fontSize: 'small',
                                    }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 'medium',
                                      }}
                                    >
                                      {reservation.voyageur?.firstName} {reservation.voyageur?.lastName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {reservation.voyageur?.phone}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 'medium',
                                  }}
                                >
                                  {reservation.bookingReference}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={getStatusLabel(reservation.status ?? '')}
                                  color={getStatusColor(reservation.status ?? '')}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 'medium',
                                  }}
                                >
                                  {reservation.totalAmount?.toLocaleString()} Ar
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {dayjs(reservation.bookingDate).format('DD/MM/YYYY')}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                                  {/* Status management buttons */}
                                  {reservation.status === ReservationStatusEnum.PENDING_PAYMENT && (
                                    <IconButtonTx
                                      onClick={() => handlers.handleMarkAsPaid(reservation)}
                                      color="success"
                                      size="small"
                                      title={t(Labels.button_mark_as_paid)}
                                    >
                                      <PaymentIcon />
                                    </IconButtonTx>
                                  )}

                                  {(reservation.status === ReservationStatusEnum.PENDING_PAYMENT ||
                                    reservation.status === ReservationStatusEnum.CONFIRMED) && (
                                    <IconButtonTx
                                      onClick={() => handlers.handleCancelReservation(reservation)}
                                      color="error"
                                      size="small"
                                      title={t(Labels.button_cancel_reservation)}
                                    >
                                      <CancelIcon />
                                    </IconButtonTx>
                                  )}

                                  {(reservation.status === ReservationStatusEnum.CANCELLED_BY_USER ||
                                    reservation.status === ReservationStatusEnum.CANCELLED_BY_OPERATOR) && (
                                    <IconButtonTx
                                      onClick={() => handlers.handleReopenReservation(reservation)}
                                      color="primary"
                                      size="small"
                                      title={t(Labels.button_reopen_reservation)}
                                    >
                                      <RestoreIcon />
                                    </IconButtonTx>
                                  )}

                                  {/* Edit and delete buttons */}
                                  <IconButtonTx
                                    onClick={() => handlers.handleEditReservation(reservation)}
                                    color="primary"
                                    size="small"
                                    title={t(Labels.button_edit)}
                                  >
                                    <EditIcon />
                                  </IconButtonTx>
                                  <IconButtonTx
                                    onClick={() => handlers.handleDeleteReservation(reservation)}
                                    color="error"
                                    size="small"
                                    title={t(Labels.button_delete)}
                                  >
                                    <DeleteIcon />
                                  </IconButtonTx>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <VoyageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t(Labels.reservation_select_voyage)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(Labels.reservation_select_voyage_description)}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      {/* Delete Confirmation Dialog */}
      <Dialog open={state.deleteConfirmOpen} onClose={handlers.handleDeleteCancel}>
        <DialogTitle>{t(Labels.delete_confirmation_title)}</DialogTitle>
        <DialogContent>
          <Typography>
            {t(Labels.reservation_delete_confirmation)} {state.reservationToDelete?.bookingReference} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlers.handleDeleteCancel}>{t(Labels.button_cancel)}</Button>
          <Button
            onClick={handlers.handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? t(Labels.button_deleting) : t(Labels.button_delete)}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Status Change Confirmation Dialog */}
      <Dialog open={statusDialog.open} onClose={handlers.handleCancelStatusChange}>
        <DialogTitle>
          {statusDialog.action === 'confirm' && t(Labels.confirm_mark_as_paid_title)}
          {statusDialog.action === 'cancel' && t(Labels.confirm_cancel_reservation_title)}
          {statusDialog.action === 'reopen' && t(Labels.confirm_reopen_reservation_title)}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {statusDialog.action === 'confirm' &&
              t(Labels.confirm_mark_as_paid_message).replace(
                '{bookingReference}',
                statusDialog.reservation?.bookingReference ?? '',
              )}
            {statusDialog.action === 'cancel' &&
              t(Labels.confirm_cancel_reservation_message).replace(
                '{bookingReference}',
                statusDialog.reservation?.bookingReference ?? '',
              )}
            {statusDialog.action === 'reopen' &&
              t(Labels.confirm_reopen_reservation_message).replace(
                '{bookingReference}',
                statusDialog.reservation?.bookingReference ?? '',
              )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlers.handleCancelStatusChange}>{t(Labels.button_cancel)}</Button>
          <Button
            onClick={handlers.handleConfirmStatusChange}
            color="primary"
            variant="contained"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? t(Labels.button_update) : t(Labels.button_save)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReservationPage;
