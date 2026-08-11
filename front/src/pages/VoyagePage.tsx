import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Switch,
  Tab,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Book as BookIcon,
  CalendarMonth as CalendarMonthIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  Delete as DeleteIcon,
  East as EastIcon,
  Edit as EditIcon,
  Inventory2 as Inventory2Icon,
  LocationCity as LocationCityIcon,
  Route as RouteIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { ButtonTx, KoperativeAvatar, StyledIcon, StyledTab, TaxibrousseRedIcon } from '@/components/ui';
import { getStyledTabListSx } from '@/utils/tabStyles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { ReservationList } from '@/components/reservation';
import { VilleDialog } from '@/components/shared';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';
import ProtectedTx from '@/components/ProtectedTx';
import { SchedulerFormDrawer, VoyageList } from '@/components/voyage';
import VoyageManagementPage from './VoyageManagementPage';
import { useTranslation } from 'react-i18next';
import { useGares } from '@/hooks/gare.hooks';
import { useKoperatives, useKoperativeVilles } from '@/hooks/koperative.hooks';
import { useGroupedVoyages } from '@/hooks/voyage.hooks';
import { RecurrenceTypeEnum, VoyageStatusEnum } from '@/models/enums';
import { isGuichetUser } from '@/utils/auth.utils';
import useKoperativePageStore from '@/stores/koperative.store';
import { useVoyagePageStore } from '@/stores/voyage.store';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SeatBooking } from '@/components/seat';
import Labels from '@/labelKeys.json';
import { Colis, Koperative, Ville, Voyage } from '@/types';
import { SeatConfig } from '@/types/type.props';

import { VoyageFilter } from '@/types/type.util';
import dayjs from '@/utils/dayjs';
import ColisList from '@/components/colis/ColisList';
import ColisSchedulerFormDrawer from '@/components/colis/scheduler/ColisSchedulerFormDrawer';
import ColisDetailsDialog from '@/components/colis/ColisDetailsDialog';
import { generateRoute } from '@/constants/routes';
import SEO from '@/components/shared/SEO';

export const VoyagePage = () => {
  const [isVilleDialogOpen, setIsVilleDialogOpen] = useState(false);
  const [isVoyageSchedulerOpen, setIsVoyageSchedulerOpen] = useState(false);
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [voyageEdition, setVoyageEdition] = useState(false);
  const [selectedSubTab, setSelectedSubTab] = useState<'reservation' | 'colis'>('reservation');
  const [openColisScheduler, setOpenColisScheduler] = useState(false);
  const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
  const [viewColis, setViewColis] = useState<Colis | null>(null);

  const handleSubTabChange = (_e: React.SyntheticEvent, newTab: 'reservation' | 'colis') => {
    setSelectedSubTab(newTab);
  };

  const {
    currentVille,
    destinationVille,
    selectedTab,
    selectedDate,
    setCurrentVille,
    setDestinationVille,
    setSelectedTab,
    setSelectedDate,
  } = useVoyagePageStore();

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { koperativeForm, setSelectedId, setKoperativeForm } = useKoperativePageStore();

  const { data: koperativeVilles = [] } = useKoperativeVilles(koperativeForm?.id ?? 0);
  const { data: allKoperatives = [] } = useKoperatives();

  const departureGareFilter = useMemo(() => (currentVille ? { ville: [currentVille] } : undefined), [currentVille]);
  const arrivalGareFilter = useMemo(
    () => (destinationVille ? { ville: [destinationVille] } : undefined),
    [destinationVille],
  );

  const { data: departureGares = [] } = useGares(departureGareFilter);
  const { data: arrivalGares = [] } = useGares(arrivalGareFilter);

  useEffect(() => {
    if (koperativeForm?.id) return;
    if (user?.assignedKoperatives?.length) {
      setSelectedId(user.assignedKoperatives[0].id);
      setKoperativeForm(user.assignedKoperatives[0]);
    }
  }, [user?.assignedKoperatives, koperativeForm?.id, setSelectedId, setKoperativeForm]);

  useEffect(() => {
    if (isGuichetUser(user) && user?.guichets?.length && !currentVille) {
      const guichetWithVille = user.guichets.find(guichet => guichet?.gare?.ville);

      if (guichetWithVille?.gare?.ville) {
        setCurrentVille(guichetWithVille.gare.ville);
      }
    }
  }, [user, currentVille, setCurrentVille]);

  const prefilledVoyageData = useMemo((): Partial<Voyage> => {
    if (voyageEdition && selectedVoyage) {
      return {
        ...selectedVoyage,
        koperative: selectedVoyage.koperative ?? ({ id: koperativeForm?.id } as Koperative),
      };
    }

    const newVoyageData: Partial<Voyage> = {
      koperative: { id: koperativeForm?.id } as Koperative,
      recurrenceType: RecurrenceTypeEnum.ONE_OFF,
      status: VoyageStatusEnum.SCHEDULED,
      departureGare: departureGares.length == 1 ? departureGares[0] : undefined,
      arrivalGare: arrivalGares.length == 1 ? arrivalGares[0] : undefined,
    };

    if (selectedDate.isSame(dayjs(), 'day')) {
      const nextHour = dayjs().tz('Indian/Antananarivo').add(1, 'hour');
      newVoyageData.departureTime = nextHour.toISOString();
      newVoyageData.estimatedArrivalTime = nextHour.add(8, 'hours').toISOString();
    } else if (selectedDate.isBefore(dayjs().add(1, 'day'), 'day')) {
      newVoyageData.departureTime = selectedDate.tz('Indian/Antananarivo', true).hour(6).minute(0).toISOString();
      newVoyageData.estimatedArrivalTime = selectedDate
        .tz('Indian/Antananarivo', true)
        .hour(14)
        .minute(0)
        .toISOString();
    } else {
      newVoyageData.departureTime = selectedDate.tz('Indian/Antananarivo', true).hour(8).minute(0).toISOString();
      newVoyageData.estimatedArrivalTime = selectedDate
        .tz('Indian/Antananarivo', true)
        .hour(16)
        .minute(0)
        .toISOString();
    }

    return newVoyageData;
  }, [selectedDate, departureGares, arrivalGares, koperativeForm?.id, selectedVoyage, voyageEdition]);

  const voyageFilter: VoyageFilter = useMemo(
    () => ({
      koperativeId: koperativeForm?.id,
      departureVilleId: currentVille?.id,
      arrivalVilleId: destinationVille?.id,
      departureDate: selectedDate.tz('Indian/Antananarivo', true).format('YYYY-MM-DD'),
      language: i18n.language,
    }),
    [koperativeForm?.id, currentVille?.id, destinationVille?.id, selectedDate, i18n.language],
  );

  const { data: voyageClasses = [], isLoading: voyagesLoading, error: voyagesError } = useGroupedVoyages(voyageFilter);

  const handleScheduleVoyage = useCallback(() => {
    if (koperativeForm?.id) {
      navigate(generateRoute.voyageScheduler(koperativeForm.id, i18n.language));
    }
  }, [koperativeForm?.id, navigate, i18n.language]);

  const handleManageSchedules = useCallback(() => {
    if (koperativeForm?.id) {
      navigate(generateRoute.koperativeDetail(koperativeForm.id, i18n.language));
    }
  }, [koperativeForm?.id, navigate, i18n.language]);

  const handleOpenVoyageScheduler = useCallback(() => {
    setVoyageEdition(false);
    setIsVoyageSchedulerOpen(true);
  }, []);

  const handleCloseVoyageScheduler = useCallback(() => {
    setIsVoyageSchedulerOpen(false);
  }, []);

  const today = useMemo(() => dayjs().startOf('day'), []);
  const startOfWeek = useMemo(() => selectedDate.startOf('week'), [selectedDate]);
  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = startOfWeek.add(i, 'day');
        return {
          value: date,
          label: date.format('ddd'),
          display: `${date.locale(i18n.language).format('ddd')} ${date.locale(i18n.language).format('D MMM')}`,
          isPast: date.isBefore(today, 'day'),
          index: date.format('YYYYMMDD'),
        };
      }),
    [startOfWeek, today, i18n.language],
  );
  const isTodayInCurrentWeek = useMemo(() => weekDays.some(day => day.value.isSame(today, 'day')), [weekDays, today]);

  const setWeekSelection = useCallback(
    (weekDate: typeof today) => {
      if (weekDate.isBefore(today, 'day')) {
        setSelectedDate(today);
        setSelectedTab(today.format('YYYYMMDD'));
      } else {
        setSelectedDate(weekDate);
        setSelectedTab(weekDate.format('YYYYMMDD'));
      }
    },
    [today, setSelectedDate, setSelectedTab],
  );

  const tabListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isTodayInCurrentWeek && selectedDate.isSame(today)) {
      setSelectedTab(today.format('YYYYMMDD'));
      setSelectedDate(today);
    }
  }, [isTodayInCurrentWeek, weekDays, today, setSelectedDate, setSelectedTab]);

  useEffect(() => {
    const selectedTabEl = tabListRef.current?.querySelector('[aria-selected="true"]');
    selectedTabEl?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }, [selectedTab]);

  const handlePrevWeek = () => setWeekSelection(startOfWeek.subtract(1, 'week'));
  const handleNextWeek = () => setWeekSelection(startOfWeek.add(1, 'week'));
  const handleTabChange = (_e: React.SyntheticEvent, newTab: string) => {
    if (newTab === 'nextweek') {
      handleNextWeek();
      return;
    }
    if (newTab === 'prevweek') {
      handlePrevWeek();
      return;
    }
    const tab = weekDays.find(item => item.index === newTab);
    setSelectedTab(newTab);
    setSelectedDate(tab!.value);
  };

  const departedVilles = useMemo(
    () => koperativeVilles?.filter((ville: Ville) => ville.id !== destinationVille?.id) ?? [],
    [koperativeVilles, destinationVille],
  );
  const destinationVilles = useMemo(
    () => koperativeVilles?.filter((ville: Ville) => ville.id !== currentVille?.id) ?? [],
    [koperativeVilles, currentVille],
  );

  const handleDeleteVoyage = useCallback(() => {
    console.warn('Voyage deletion not yet implemented');
  }, []);

  const handleEditVoyage = useCallback(() => {
    setVoyageEdition(true);
    setIsVoyageSchedulerOpen(true);
  }, []);

  const handleOpenColisScheduler = useCallback(() => {
    setSelectedColis(null);
    setOpenColisScheduler(true);
  }, []);

  const handleEditColis = useCallback((colis: Colis) => {
    setSelectedColis(colis);
    setOpenColisScheduler(true);
  }, []);

  const handleViewColis = useCallback((colis: Colis) => {
    setViewColis(colis);
  }, []);

  const handleCloseColisDetails = useCallback(() => {
    setViewColis(null);
  }, []);

  const handleCloseColisScheduler = useCallback(() => {
    setOpenColisScheduler(false);
    setSelectedColis(null);
  }, []);

  const handleToggleManagementMode = useCallback(() => {
    setIsManagementMode(prev => !prev);
  }, []);

  if (isManagementMode) {
    return <VoyageManagementPage />;
  }

  return (
    <Box sx={{ py: 2 }}>
      <SEO title={t(Labels.voyage_notebook_title)} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mx: 'auto', width: 1 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StyledIcon icon={BookIcon} />
                    <Typography variant="h4">{t(Labels.voyage_notebook_title)}</Typography>
                  </Box>
                  <ProtectedTx allowedRoles={[]}>
                    <Tooltip title={t(Labels.voyage_management_mode_toggle)}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t(Labels.voyage_management)}
                        </Typography>
                        <Switch
                          checked={isManagementMode}
                          onChange={handleToggleManagementMode}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </Tooltip>
                  </ProtectedTx>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex' }}>
                <KoperativeAvatar logoUrl={koperativeForm?.logoUrl} name={koperativeForm?.name} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <KoperativeAutocomplete
                    id="voyage-koperative-select"
                    value={koperativeForm}
                    onChange={value => {
                      const selected = value as Koperative | null;
                      setSelectedId(selected?.id ?? 0);
                      setKoperativeForm(selected ?? {});
                      setCurrentVille(null);
                      setDestinationVille(null);
                      setSelectedVoyage(null);
                    }}
                    options={user?.assignedKoperatives?.length ? user.assignedKoperatives : allKoperatives}
                    readOnly={(user?.assignedKoperatives?.length ?? 0) === 1}
                    label={t(Labels.ui_koperative_name)}
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.primary" sx={{ mt: 2 }}>
                {koperativeForm?.description ?? t(Labels.ui_koperative_description)}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
              <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE', 'GUICHET']}>
                <ButtonTx
                  variant="outlined"
                  size="large"
                  startIcon={<CalendarMonthIcon />}
                  onClick={handleScheduleVoyage}
                  disabled={!koperativeForm?.id}
                >
                  {t(Labels.button_voyage_calendar)}
                </ButtonTx>
                <ButtonTx
                  variant="outlined"
                  size="large"
                  startIcon={<ConfirmationNumberIcon />}
                  onClick={handleManageSchedules}
                  disabled={!koperativeForm?.id}
                >
                  {t(Labels.button_voyage_counters)}
                </ButtonTx>
              </ProtectedTx>
            </CardActions>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              {Array.isArray(koperativeVilles) && koperativeVilles.length > 1 ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Autocomplete
                      options={departedVilles}
                      getOptionLabel={(ville: Ville) => ville?.name ?? ''}
                      value={currentVille}
                      onChange={(_, value: Ville | null) => setCurrentVille(value)}
                      renderInput={params => <TextField {...params} label={t(Labels.ui_label_city_departure)} />}
                      renderValue={(ville: Ville) => (
                        <Box>
                          <Typography
                            variant="caption"
                            color="grey.600"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 0.25,
                            }}
                          >
                            <Typography
                              sx={{ color: theme => theme.palette.error.main, fontWeight: 'bold' }}
                              variant="caption"
                            >
                              {t(Labels.ui_label_city_departure)}
                            </Typography>
                          </Typography>
                          <Typography variant="h6">{ville.name}</Typography>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Autocomplete
                      options={destinationVilles}
                      getOptionLabel={(ville: Ville) => ville?.name ?? ''}
                      value={destinationVille}
                      onChange={(_, value: Ville | null) => setDestinationVille(value)}
                      renderInput={params => <TextField {...params} label={t(Labels.ui_label_city_destination)} />}
                      renderOption={(props, ville: Ville) => {
                        const { key, ...rest } = props;
                        return (
                          <Box
                            key={key}
                            component="li"
                            sx={{
                              margin: 1,
                              borderRadius: 2,
                              border: theme => `1.5px solid ${theme.palette.divider}`,
                            }}
                            {...rest}
                          >
                            <Box>
                              <Typography variant="h6">{ville.name}</Typography>
                              <Typography
                                variant="caption"
                                color="grey.600"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mt: 0.25,
                                }}
                              >
                                {currentVille?.name}
                                <TaxibrousseRedIcon sx={{ fontSize: 'inherit' }} />
                                <b>{ville.name}</b>
                              </Typography>
                            </Box>
                          </Box>
                        );
                      }}
                      renderValue={(ville: Ville) => (
                        <Box>
                          <Typography variant="h6">{ville.name}</Typography>
                          <Typography
                            variant="caption"
                            color="grey.600"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mt: 0.25,
                            }}
                          >
                            {currentVille?.name}
                            <TaxibrousseRedIcon sx={{ fontSize: 'inherit' }} />
                            <b>{ville.name}</b>
                          </Typography>
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                  <Typography variant="body2" color="grey.600" sx={{ mt: 2, textAlign: 'center' }}>
                    {t(Labels.voyage_no_data_hint)}
                  </Typography>
                </Box>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
              {koperativeVilles.length > 1 && (
                <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE', 'GUICHET']}>
                  <ButtonTx
                    variant="contained"
                    size="small"
                    startIcon={<CalendarMonthIcon />}
                    onClick={handleOpenVoyageScheduler}
                    disabled={!koperativeForm?.id}
                  >
                    {t(Labels.button_schedule_voyage)}
                  </ButtonTx>
                </ProtectedTx>
              )}
              <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE']}>
                <ButtonTx
                  variant="contained"
                  size="small"
                  startIcon={<LocationCityIcon />}
                  onClick={() => setIsVilleDialogOpen(true)}
                  disabled={!koperativeForm?.id}
                >
                  {t(Labels.button_add_ville)}
                </ButtonTx>
              </ProtectedTx>
            </CardActions>
          </Card>
          {currentVille && (
            <Card sx={{ mt: 2, minHeight: 300 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StyledIcon icon={CalendarMonthIcon} />
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }} variant="h4">
                      {currentVille?.name}
                      <TaxibrousseRedIcon sx={{ fontSize: 'inherit' }} />
                    </Typography>
                  </Box>
                }
                slotProps={{ variant: 'h6', color: 'text.secondary', gutterBottom: true }}
              />
              <CardContent>
                <VoyageList
                  voyages={voyageClasses.flatMap(g => g.voyages)}
                  loading={voyagesLoading}
                  error={voyagesError}
                  selectedVoyage={selectedVoyage}
                  onSelectVoyage={voyage => {
                    setSelectedVoyage(voyage);
                    if (voyage.arrivalGare?.ville) {
                      setDestinationVille(voyage.arrivalGare.ville);
                    }
                  }}
                />
                <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE']}>
                  {!voyagesLoading && voyageClasses.length === 0 && currentVille && (
                    <Alert
                      severity="info"
                      sx={{ mt: 2 }}
                      action={
                        <ButtonTx
                          color="inherit"
                          size="small"
                          onClick={handleOpenVoyageScheduler}
                          startIcon={<AddIcon />}
                          hideTextOnMobile
                        >
                          {t(Labels.button_schedule_voyage)}
                        </ButtonTx>
                      }
                    >
                      <Typography variant="body2">{t(Labels.voyage_no_schedule_available)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t(Labels.voyage_schedule_suggestion)}
                      </Typography>
                    </Alert>
                  )}
                </ProtectedTx>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <TabContext value={String(selectedTab)}>
            <TabList
              ref={tabListRef}
              onChange={(_e, value) => handleTabChange(_e, value)}
              variant="scrollable"
              scrollButtons={false}
              sx={{ flex: 1, mb: 1, ...getStyledTabListSx() }}
            >
              {!isTodayInCurrentWeek && (
                <StyledTab icon={<ArrowBackIosNewIcon />} value="prevweek" sx={{ minWidth: 48 }} />
              )}
              {weekDays.map((day, _) => (
                <StyledTab
                  key={day.index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                      {day.display}
                    </Box>
                  }
                  value={day.index}
                  sx={{ minWidth: 100 }}
                  disabled={day.isPast}
                />
              ))}
              <StyledTab value="nextweek" icon={<ArrowForwardIosIcon />} sx={{ minWidth: 48 }} />
              <StyledTab cardStyle={false} disabled />
            </TabList>
          </TabContext>
          <Card>
            <CardContent sx={{ pb: 3 }}>
              <Grid container spacing={2}>
                <Grid
                  size={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  {selectedVoyage && (
                    <TabContext value={String(selectedSubTab)}>
                      <TabList onChange={(_e, value) => handleSubTabChange(_e, value)}>
                        <Tab
                          icon={<StyledIcon icon={RouteIcon} />}
                          iconPosition="start"
                          label={
                            <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                variant="h6"
                                color="primary"
                                sx={{
                                  fontWeight: 'bold',
                                }}
                              >
                                {currentVille?.name}
                              </Typography>
                              <EastIcon color="primary" />
                              <Typography
                                variant="h6"
                                color="primary"
                                sx={{
                                  fontWeight: 'bold',
                                }}
                              >
                                {destinationVille?.name}
                              </Typography>
                            </Box>
                          }
                          value="reservation"
                          sx={{ minWidth: 120, minHeight: 48, ml: 0.5 }}
                        />
                        <Tab
                          icon={<Inventory2Icon />}
                          iconPosition="start"
                          label="Colis"
                          value="colis"
                          sx={{ minWidth: 120, minHeight: 48 }}
                        />
                      </TabList>
                    </TabContext>
                  )}
                </Grid>

                {selectedSubTab === 'reservation' && (
                  <Grid size={12} container spacing={2}>
                    <Grid size="grow">
                      {selectedVoyage && (
                        <SeatBooking
                          voyage={selectedVoyage}
                          multiSelect={true}
                          showAdvancedControls={true}
                          enableBookingFlow={true}
                          maxSeatsPerBooking={4}
                          onBookingComplete={(_seatConfigs: SeatConfig[]) => {}}
                        />
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {selectedVoyage ? (
                        <ProtectedTx>
                          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={() => handleEditVoyage()}
                              disabled={!currentVille || !destinationVille}
                              startIcon={<EditIcon />}
                            >
                              {t(Labels.button_edit_voyage)}
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              fullWidth
                              onClick={() => handleDeleteVoyage()}
                              disabled={true}
                              startIcon={<DeleteIcon />}
                            >
                              {t(Labels.button_delete_voyage)}
                            </Button>
                          </Box>
                          <ReservationList voyageId={selectedVoyage.id} />
                        </ProtectedTx>
                      ) : (
                        <Typography variant="body2" color="grey.600" sx={{ mt: 1, textAlign: 'center' }}>
                          {t(Labels.voyage_no_data_hint)}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                )}

                {selectedSubTab === 'colis' && (
                  <Grid size={12}>
                    {selectedVoyage && (
                      <ColisList
                        handleAddColis={handleOpenColisScheduler}
                        voyageId={selectedVoyage.id!}
                        handleEditColis={handleEditColis}
                        handleViewColis={handleViewColis}
                      />
                    )}
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE', 'GUICHET']}>
        {koperativeForm?.id && (
          <Fab
            color="primary"
            aria-label="schedule voyage"
            onClick={handleScheduleVoyage}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
          >
            <ScheduleIcon />
          </Fab>
        )}
      </ProtectedTx>
      {koperativeForm?.id && (
        <VilleDialog
          open={isVilleDialogOpen}
          onClose={() => setIsVilleDialogOpen(false)}
          koperativeId={koperativeForm.id}
          koperativeVilles={koperativeVilles}
        />
      )}
      {koperativeForm?.id && (
        <SchedulerFormDrawer
          open={isVoyageSchedulerOpen}
          onClose={handleCloseVoyageScheduler}
          koperativeId={koperativeForm.id}
          initialData={prefilledVoyageData}
          departureVille={currentVille}
          arrivalVille={destinationVille}
          onSuccess={() => setIsVoyageSchedulerOpen(false)}
        />
      )}
      {koperativeForm?.id && (
        <ColisSchedulerFormDrawer
          open={openColisScheduler}
          onClose={handleCloseColisScheduler}
          koperativeId={koperativeForm.id}
          voyage={selectedVoyage}
          initialData={selectedColis || undefined}
          onSuccess={() => setOpenColisScheduler(false)}
        />
      )}
      <ColisDetailsDialog open={!!viewColis} onClose={handleCloseColisDetails} colis={viewColis} />
    </Box>
  );
};

export default VoyagePage;
