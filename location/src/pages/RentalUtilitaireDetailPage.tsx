import { useVehicle } from '../hooks/vehicle.hooks';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

import Section from '../components/section/Section';
import { SECTION_TYPES } from '../constants/section.types';
import StyledIcon from '@/components/ui/StyledIcon';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

import RentalVehicleDetailSkeleton from '../components/skeleton/RentalVehicleDetailSkeleton';

export default function RentalUtilitaireDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: vehicle, isLoading } = useVehicle(id ? Number(id) : undefined);

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(2, 'day'));

  const totalDays = endDate && startDate ? endDate.diff(startDate, 'day') : 0;
  const totalPrice = vehicle && totalDays > 0 ? totalDays * vehicle.pricePerDay : 0;

  if (isLoading) {
    return <RentalVehicleDetailSkeleton />;
  }

  if (!vehicle) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Véhicule introuvable</Typography>
        <Button component={Link} to="/utilitaires" sx={{ mt: 2 }}>
          Retour aux véhicules
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/utilitaires"
            startIcon={<StyledIcon icon={ArrowBackIcon} />}
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            {t(Labels.rental_utilitaire_detail_back)}
          </Button>

          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Image Box */}
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 3,
                  mb: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                }}
              >
                <Chip
                  label={vehicle.category}
                  color="secondary"
                  sx={{ position: 'absolute', top: 16, left: 16, fontWeight: 600 }}
                />
                <Box
                  component="img"
                  src={vehicle.imageUrl}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  sx={{ width: '100%', height: { xs: 250, md: 400 }, objectFit: 'cover' }}
                />
              </Box>

              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                {vehicle.brand} {vehicle.model}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                {t(Labels.rental_utilitaire_detail_equivalent)}
              </Typography>

              {/* Characteristics Grid (Specific for Utilitaires) */}
              <Grid container spacing={2} sx={{ mb: 5 }}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <StyledIcon icon={LocalShippingIcon} color="action" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t(Labels.rental_utilitaire_detail_volume)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vehicle.volumeUtility}
                    </Typography>
                  </Paper>
                </Grid>
                {/* Removed payload grid since it doesn't exist on backend Vehicle */}

                <Grid size={{ xs: 6, sm: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <StyledIcon icon={PersonIcon} color="action" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t(Labels.rental_utilitaire_detail_seats, { seats: vehicle.seats })}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <StyledIcon icon={SettingsIcon} color="action" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {vehicle.transmission}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <StyledIcon icon={LocalGasStationIcon} color="action" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {vehicle.fuel}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Included features */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {t(Labels.rental_utilitaire_detail_included_title)}
              </Typography>
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  t(Labels.rental_utilitaire_detail_inc_cdw),
                  t(Labels.rental_utilitaire_detail_inc_tp),
                  t(Labels.rental_utilitaire_detail_inc_straps),
                  t(Labels.rental_utilitaire_detail_inc_assist),
                  t(Labels.rental_utilitaire_detail_inc_license),
                ].map((text, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <StyledIcon icon={CheckCircleIcon} color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant="body2">{text}</Typography>} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Right Column: Booking Widget */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'sticky',
                  top: 88,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main', mb: 0.5 }}>
                  {vehicle.pricePerDay.toLocaleString('fr-MG')} Ar{' '}
                  <Box component="span" sx={{ fontSize: '1rem', color: 'text.secondary', fontWeight: 500 }}>
                    {t(Labels.rental_utilitaire_detail_per_day)}
                  </Box>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: 'success.main' }}>
                  <StyledIcon icon={LocalOfferIcon} fontSize="small" />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {t(Labels.rental_utilitaire_detail_ideal)}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {t(Labels.rental_utilitaire_detail_dates)}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  <DatePicker
                    label={t(Labels.rental_utilitaire_detail_departure)}
                    format="DD/MM/YYYY"
                    value={startDate}
                    onChange={v => setStartDate(v)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  <DatePicker
                    label={t(Labels.rental_utilitaire_detail_return)}
                    format="DD/MM/YYYY"
                    value={endDate}
                    onChange={v => setEndDate(v)}
                    minDate={startDate ?? dayjs()}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>

                {totalDays > 0 && (
                  <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {vehicle.pricePerDay.toLocaleString('fr-MG')} Ar{' '}
                        {t(Labels.rental_utilitaire_detail_x_days, { days: totalDays })}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {totalPrice.toLocaleString('fr-MG')} Ar
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{t(Labels.rental_utilitaire_detail_taxes)}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t(Labels.rental_utilitaire_detail_included)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {t(Labels.rental_utilitaire_detail_estimated_total)}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {totalPrice.toLocaleString('fr-MG')} Ar
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  disabled={totalDays <= 0}
                  sx={{ py: 1.5, fontSize: '1.05rem', fontWeight: 600 }}
                  onClick={() => {
                    if (!startDate || !endDate) return;
                    navigate(
                      `/reservation/${id}?start=${startDate.format('YYYY-MM-DD')}&end=${endDate.format('YYYY-MM-DD')}`,
                    );
                  }}
                >
                  {t(Labels.rental_utilitaire_detail_confirm_btn)}
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', textAlign: 'center', mt: 2 }}
                >
                  {t(Labels.rental_utilitaire_detail_no_charge)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Reassurance section at bottom */}
      <Section
        section={{
          id: 0,
          __component: SECTION_TYPES.SECTION_REFERENCE,
          sectionTitle: '',
          sectionType: SECTION_TYPES.RENTAL_REASSURANCE,
        }}
      />
    </>
  );
}
