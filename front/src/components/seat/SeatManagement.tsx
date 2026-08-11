import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add as InitializeIcon, EventSeat as SeatIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/models/Voyage';
import { Seat } from '@/models/Seat';
import { SeatStatusEnum } from '@/models/enums';
import { useAvailableSeats, useInitializeSeats, useReservedSeats, useVoyageSeats } from '@/hooks/seat.hooks';
import { SeatReservation } from '@/components/seat';
import ProtectedTx from '@/components/ProtectedTx';
import { PageLoader } from '@/components/shared';

interface SeatManagementProps {
  voyage: Voyage;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`seat-tabpanel-${index}`}
    aria-labelledby={`seat-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export const SeatManagement: React.FC<SeatManagementProps> = ({ voyage }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  // Fetch seat data
  const {
    data: seats = [],
    isLoading: seatsLoading,
    error: seatsError,
    refetch: refetchSeats,
  } = useVoyageSeats(voyage.id ?? 0);

  const { data: reservedSeats = [], isLoading: reservedLoading } = useReservedSeats(voyage.id ?? 0);

  const { data: availableSeats = [], isLoading: availableLoading } = useAvailableSeats(voyage.id ?? 0);

  // Initialize seats mutation
  const initializeSeats = useInitializeSeats();

  const handleInitializeSeats = async () => {
    if (!voyage.id || !voyage.crafter?.id) return;

    try {
      await initializeSeats.mutateAsync({
        voyageId: voyage.id,
        crafterId: voyage.crafter.id,
      });
    } catch (error) {
      console.error('Failed to initialize seats:', error);
    }
  };

  const handleRefresh = () => {
    refetchSeats();
  };

  // Calculate seat statistics
  const seatStats = {
    total: seats.length,
    available: seats.filter((seat: Seat) => seat.seatStatus === SeatStatusEnum.AVAILABLE).length,
    reserved: seats.filter((seat: Seat) => seat.seatStatus === SeatStatusEnum.RESERVED).length,
    blocked: seats.filter((seat: Seat) => seat.seatStatus === SeatStatusEnum.BLOCKED).length,
    damaged: seats.filter((seat: Seat) => seat.seatStatus === SeatStatusEnum.DAMAGED).length,
  };

  const getStatusColor = (
    status: string,
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case SeatStatusEnum.AVAILABLE:
        return 'success';
      case SeatStatusEnum.RESERVED:
        return 'error';
      case SeatStatusEnum.BLOCKED:
        return 'warning';
      case SeatStatusEnum.DAMAGED:
        return 'default';
      default:
        return 'default';
    }
  };

  if (!voyage.id) {
    return <Alert severity="warning">{t(Labels.error_seat_not_found)}</Alert>;
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SeatIcon />
            <Typography variant="h6">
              {t(Labels.seat_entity_label)} - {voyage.crafter?.registrationNumber}
            </Typography>
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={t(Labels.ui_refresh)}>
              <IconButton onClick={handleRefresh} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE', 'GUICHET']}>
              {seats.length === 0 && (
                <Tooltip title={t(Labels.seat_initialize_for_voyage)}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<InitializeIcon />}
                    onClick={handleInitializeSeats}
                    disabled={initializeSeats.isPending || !voyage.crafter?.id}
                  >
                    {initializeSeats.isPending ? <CircularProgress size={16} /> : t(Labels.seat_initialize_for_voyage)}
                  </Button>
                </Tooltip>
              )}
            </ProtectedTx>
          </Box>
        }
      />

      <CardContent>
        {seatsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t(Labels.error_loading_reservations)}
          </Alert>
        )}

        {seatsLoading ? <PageLoader minHeight="300px" /> : null}

        {!seatsLoading && seats.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">{t(Labels.seat_initialize_for_voyage)}</Typography>
            <Typography variant="caption" color="text.secondary">
              {voyage.crafter?.seatCapacity} {t(Labels.crafter_seat_capacity)}
            </Typography>
          </Alert>
        ) : null}

        {!seatsLoading && seats.length > 0 ? (
          <>
            {/* Seat Statistics */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="text.primary">
                    {seatsLoading ? <CircularProgress size={20} /> : seatStats.total}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(Labels.ui_total)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {seatStats.available}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(Labels.enum_seat_status_available)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {seatStats.reserved}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(Labels.enum_seat_status_reserved)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {seatStats.blocked + seatStats.damaged}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(Labels.ui_unavailable)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Tabs for different views */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab
                  label={`${t(Labels.seat_reservation_management)} (${seatStats.total})`}
                  id="seat-tab-0"
                  aria-controls="seat-tabpanel-0"
                />
                <Tab
                  label={`${t(Labels.enum_seat_status_available)} (${seatStats.available})`}
                  id="seat-tab-1"
                  aria-controls="seat-tabpanel-1"
                />
                <Tab
                  label={`${t(Labels.enum_seat_status_reserved)} (${seatStats.reserved})`}
                  id="seat-tab-2"
                  aria-controls="seat-tabpanel-2"
                />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
              <SeatReservation voyage={voyage} />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {availableLoading ? (
                <PageLoader minHeight="200px" />
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t(Labels.enum_seat_status_available)} ({availableSeats.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {availableSeats.map((seat: Seat) => (
                      <Chip
                        key={seat.id}
                        label={`${t(Labels.seat_label)} ${seat.seatNum}`}
                        color={getStatusColor(seat.seatStatus ?? '')}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              {reservedLoading ? (
                <PageLoader minHeight="200px" />
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t(Labels.enum_seat_status_reserved)} ({reservedSeats.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {reservedSeats.map((seat: Seat) => (
                      <Chip
                        key={seat.id}
                        label={`${t(Labels.seat_label)} ${seat.seatNum}`}
                        color={getStatusColor(seat.seatStatus ?? '')}
                        size="small"
                        sx={{
                          textDecoration: seat.reservation ? 'none' : 'line-through',
                          opacity: seat.reservation ? 1 : 0.7,
                        }}
                      />
                    ))}
                  </Box>
                  {reservedSeats.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {t(Labels.reservation_no_reserved_seats)}
                    </Typography>
                  )}
                </Box>
              )}
            </TabPanel>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};
