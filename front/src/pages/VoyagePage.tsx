import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, Card, CardContent, Fab, Grid, Alert } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StyledTab from '@/components/ui/StyledTab';
import { getStyledTabListSx } from '@/utils/tabStyles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import VilleDialog from '@/components/shared/VilleDialog';
import ProtectedTx from '@/components/ProtectedTx';
import {
  SchedulerForm,
  KoperativeSelectionCard,
  RouteSelectionCard,
  VoyageListCard,
  VoyageDetailPanel,
} from '@/components/voyage';
import { useTranslation } from 'react-i18next';
import { useGares } from '@/hooks/gare.hooks';
import { useKoperatives, useKoperativeVilles } from '@/hooks/koperative.hooks';
import { useGroupedVoyagesByKoperative } from '@/hooks/voyage.hooks';
import { AuthorityEnum, RecurrenceTypeEnum, VoyageStatusEnum } from '@/models/enums';
import { isGuichetUser } from '@/utils/auth.utils';
import useKoperativePageStore from '@/stores/koperative.store';
import { useVoyagePageStore } from '@/stores/voyage.store';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Labels from '@/labelKeys.json';
import { Colis, Koperative, Voyage } from '@/types';
import { VoyageFilter } from '@/types/type.util';
import dayjs from '@/utils/dayjs';
import ColisSchedulerFormDrawer from '@/components/colis/scheduler/ColisSchedulerFormDrawer';
import ColisDetailsDialog from '@/components/colis/ColisDetailsDialog';
import { generateRoute } from '@/constants/routes';
import SEO from '@/components/shared/SEO';

export const VoyagePage = () => {
  const {
    currentVille,
    destinationVille,
    selectedTab,
    selectedDate,
    isVilleDialogOpen,
    isVoyageSchedulerOpen,
    selectedVoyage,
    voyageEdition,
    selectedSubTab,
    openColisScheduler,
    selectedColis,
    viewColis,
    scheduleSuccess,
    setCurrentVille,
    setDestinationVille,
    setSelectedTab,
    setSelectedDate,
    setIsVilleDialogOpen,
    setIsVoyageSchedulerOpen,
    setSelectedVoyage,
    setVoyageEdition,
    setSelectedSubTab,
    setOpenColisScheduler,
    setSelectedColis,
    setViewColis,
    setScheduleSuccess,
  } = useVoyagePageStore();

  const handleSubTabChange = (_e: React.SyntheticEvent, newTab: 'reservation' | 'colis') => {
    setSelectedSubTab(newTab);
  };

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

  const userKoperativeId = user?.koperative?.id;
  const hasUserKoperative = Boolean(userKoperativeId);

  const departureVilles = useMemo(() => {
    if (isGuichetUser(user) && user?.guichets) {
      const guichetVilleIds = user.guichets.map(g => g?.gare?.ville?.id);
      return koperativeVilles.filter(v => v.id && guichetVilleIds.includes(v.id));
    }
    return koperativeVilles;
  }, [user, koperativeVilles]);

  const hasSingleDepartureVille = departureVilles.length === 1;

  // Initialize koperative on mount
  useEffect(() => {
    const defaultKoperative = koperativeForm?.id ? null : user?.assignedKoperatives?.[0];
    const koperative = user?.koperative ?? defaultKoperative;
    if (koperative && koperativeForm?.id !== koperative.id) {
      setSelectedId(koperative.id);
      setKoperativeForm(koperative);
    }
  }, [user, koperativeForm?.id, setSelectedId, setKoperativeForm]);

  useEffect(() => {
    const shouldSetVille = isGuichetUser(user) && user?.guichets?.length && !currentVille;
    if (shouldSetVille) {
      const guichetWithVille = user?.guichets?.find(g => g?.gare?.ville);
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
      departureGare: departureGares.length === 1 ? departureGares[0] : undefined,
      arrivalGare: arrivalGares.length === 1 ? arrivalGares[0] : undefined,
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

  const {
    data: voyageClasses = [],
    isLoading: voyagesLoading,
    error: voyagesError,
  } = useGroupedVoyagesByKoperative(voyageFilter);

  const handleScheduleVoyage = useCallback(() => {
    if (koperativeForm?.id) {
      navigate(generateRoute.voyageScheduler(koperativeForm.id, i18n.language));
    }
  }, [koperativeForm?.id, navigate, i18n.language]);

  const handleManageSchedules = useCallback(() => {
    if (koperativeForm?.slug) {
      navigate(generateRoute.koperativeDetail(koperativeForm.slug, i18n.language));
    }
  }, [koperativeForm.slug, navigate, i18n.language]);

  const handleOpenVoyageScheduler = useCallback(() => {
    setVoyageEdition(false);
    setScheduleSuccess(false);
    setIsVoyageSchedulerOpen(true);
  }, [setIsVoyageSchedulerOpen, setScheduleSuccess, setVoyageEdition]);

  const handleCloseVoyageScheduler = useCallback(() => {
    setIsVoyageSchedulerOpen(false);
  }, [setIsVoyageSchedulerOpen]);

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
  const schedulerFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTodayInCurrentWeek && selectedDate.isSame(today)) {
      setSelectedTab(today.format('YYYYMMDD'));
      setSelectedDate(today);
    }
  }, [isTodayInCurrentWeek, weekDays, today, selectedDate, setSelectedDate, setSelectedTab]);

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

  const handleDeleteVoyage = useCallback(() => {
    console.warn('Voyage deletion not yet implemented');
  }, []);

  const handleEditVoyage = useCallback(() => {
    setVoyageEdition(true);
    setScheduleSuccess(false);
    setIsVoyageSchedulerOpen(true);
  }, [setIsVoyageSchedulerOpen, setScheduleSuccess, setVoyageEdition]);

  const handleOpenColisScheduler = useCallback(() => {
    setSelectedColis(null);
    setOpenColisScheduler(true);
  }, [setOpenColisScheduler, setSelectedColis]);

  const handleEditColis = useCallback(
    (colis: Colis) => {
      setSelectedColis(colis);
      setOpenColisScheduler(true);
    },
    [setOpenColisScheduler, setSelectedColis],
  );

  const handleViewColis = useCallback(
    (colis: Colis) => {
      setViewColis(colis);
    },
    [setViewColis],
  );

  const handleCloseColisDetails = useCallback(() => {
    setViewColis(null);
  }, [setViewColis]);

  const handleCloseColisScheduler = useCallback(() => {
    setOpenColisScheduler(false);
    setSelectedColis(null);
  }, [setOpenColisScheduler, setSelectedColis]);

  const handleKoperativeChange = useCallback(
    (value: Koperative | Koperative[] | null) => {
      const selected = Array.isArray(value) ? value[0] : value;
      setSelectedId(selected?.id ?? 0);
      setKoperativeForm(selected ?? {});
      setCurrentVille(null);
      setDestinationVille(null);
      setSelectedVoyage(null);
    },
    [setSelectedId, setKoperativeForm, setCurrentVille, setDestinationVille, setSelectedVoyage],
  );

  const handleVoyageSelect = useCallback(
    (voyage: Voyage) => {
      setSelectedVoyage(voyage);
      setIsVoyageSchedulerOpen(false);
      if (voyage.arrivalGare?.ville) {
        setDestinationVille(voyage.arrivalGare.ville);
      }
    },
    [setDestinationVille, setIsVoyageSchedulerOpen, setSelectedVoyage],
  );

  const koperativeId = koperativeForm?.id;
  const hasKoperative = Boolean(koperativeId);
  const showScheduler = isVoyageSchedulerOpen && hasKoperative;
  const showVoyagePanel = !showScheduler;
  const canEditVoyage = Boolean(currentVille && destinationVille);
  const hasColisToView = Boolean(viewColis);
  const showPrevWeekTab = !isTodayInCurrentWeek;
  const isSingleKoperative = (user?.assignedKoperatives?.length ?? 0) === 1;
  const koperativeOptions = user?.assignedKoperatives?.length ? user.assignedKoperatives : allKoperatives;

  useEffect(() => {
    if (showScheduler && schedulerFormRef.current) {
      schedulerFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showScheduler]);

  return (
    <ProtectedTx
      allowedRoles={[AuthorityEnum.ADMIN, AuthorityEnum.KOPERATIVE, AuthorityEnum.GUICHET]}
      fallback={
        <Box sx={{ maxWidth: 'md' }}>
          <Alert severity="error">{t(Labels.error_access_denied)}</Alert>
        </Box>
      }
    >
      <Box>
        <SEO title={t(Labels.voyage_notebook_title)} />
        <Grid container spacing={2}>
          {/* Left Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Koperative Selection */}
            <Box sx={{ mt: 2 }}>
              <KoperativeSelectionCard
                koperative={koperativeForm}
                options={koperativeOptions}
                readOnly={isSingleKoperative}
                disabled={hasUserKoperative}
                onKoperativeChange={handleKoperativeChange}
                onScheduleClick={handleScheduleVoyage}
                onManageClick={handleManageSchedules}
              />
            </Box>

            {/* Route Selection */}
            <Box sx={{ mt: 2 }}>
              <RouteSelectionCard
                koperativeVilles={koperativeVilles}
                departureVilles={departureVilles}
                isDepartureDisabled={hasSingleDepartureVille}
                currentVille={currentVille}
                destinationVille={destinationVille}
                onCurrentVilleChange={setCurrentVille}
                onDestinationVilleChange={setDestinationVille}
                onScheduleVoyage={handleOpenVoyageScheduler}
                onAddVille={() => setIsVilleDialogOpen(true)}
                koperativeId={koperativeId}
              />
            </Box>

            {/* Voyage List */}
            {currentVille && (
              <Box sx={{ mt: 2 }}>
                <VoyageListCard
                  currentVille={currentVille}
                  voyages={voyageClasses.flatMap(g => g.voyages)}
                  loading={voyagesLoading}
                  error={voyagesError}
                  selectedVoyage={selectedVoyage}
                  onSelectVoyage={handleVoyageSelect}
                  onScheduleVoyage={handleOpenVoyageScheduler}
                />
              </Box>
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
                {showPrevWeekTab && <StyledTab icon={<ArrowBackIosNewIcon />} value="prevweek" sx={{ minWidth: 48 }} />}
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
            <Card sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent ref={schedulerFormRef} sx={{ pb: 3 }}>
                {showScheduler && koperativeId && (
                  <SchedulerForm
                    koperativeId={koperativeId}
                    initialData={prefilledVoyageData}
                    departureVille={currentVille}
                    arrivalVille={destinationVille}
                    onClose={handleCloseVoyageScheduler}
                    onSuccess={() => {
                      setIsVoyageSchedulerOpen(false);
                      setSelectedVoyage(null);
                      setScheduleSuccess(true);
                    }}
                  />
                )}
                {showVoyagePanel && (
                  <VoyageDetailPanel
                    selectedVoyage={selectedVoyage}
                    selectedSubTab={selectedSubTab}
                    onSubTabChange={handleSubTabChange}
                    currentVille={currentVille}
                    destinationVille={destinationVille}
                    canEditVoyage={canEditVoyage}
                    onEditVoyage={handleEditVoyage}
                    onDeleteVoyage={handleDeleteVoyage}
                    onAddColis={handleOpenColisScheduler}
                    onEditColis={handleEditColis}
                    onViewColis={handleViewColis}
                    scheduleSuccess={scheduleSuccess}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE', 'GUICHET']}>
          {hasKoperative && (
            <Fab
              color="primary"
              aria-label="schedule voyage"
              onClick={handleScheduleVoyage}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 96,
                zIndex: 1000,
              }}
            >
              <ScheduleIcon />
            </Fab>
          )}
        </ProtectedTx>
        {koperativeId && (
          <VilleDialog
            open={isVilleDialogOpen}
            onClose={() => setIsVilleDialogOpen(false)}
            koperativeId={koperativeId}
            koperativeVilles={koperativeVilles}
          />
        )}
        {koperativeId && (
          <ColisSchedulerFormDrawer
            open={openColisScheduler}
            onClose={handleCloseColisScheduler}
            koperativeId={koperativeId}
            voyage={selectedVoyage}
            initialData={selectedColis ?? undefined}
            onSuccess={() => setOpenColisScheduler(false)}
          />
        )}
        <ColisDetailsDialog open={hasColisToView} onClose={handleCloseColisDetails} colis={viewColis} />
      </Box>
    </ProtectedTx>
  );
};

export default VoyagePage;
