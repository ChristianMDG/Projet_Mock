import { Alert, Box } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVoyageWeeklyLogic } from '@/hooks/voyage-weekly.hooks';
import { useGroupedVoyages } from '@/hooks/voyage.hooks';
import Labels from '@/labelKeys.json';
import { WeeklyHeader } from './voyage/WeeklyHeader';
import { WeeklyTabs } from './voyage/WeeklyTabs';
import { KoperativeFilter } from './voyage/KoperativeFilter';
import { VoyageWeeklyResults } from './voyage/VoyageWeeklyResults';
import { VoyageItemSkeleton } from '@/skeleton/VoyageItemSkeleton';
import VoyageWeeklyResultsSkeleton from '@/skeleton/VoyageWeeklyResultsSkeleton';
import { voyageDateUtils } from '@/utils/dayjs';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useVoyageSearchStore } from '@/stores/voyage-search.store';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';

const VoyageWeeklySearch = ({ onEditSearch }: { onEditSearch?: () => void }) => {
  const {
    error,
    hasSearched,
    departureDate,
    koperativeId,
    availableKoperatives,
    weeklyQuery,
    selectedTab,
    handleTabChange,
    handleKoperativeChange,
    setKoperativeId,
    departureTimeGroup,
    setDepartureTimeGroup,
  } = useVoyageWeeklyLogic();

  const fromVille = useVoyageSearchStore(state => state.fromVille);
  const toVille = useVoyageSearchStore(state => state.toVille);
  const passengers = useVoyageSearchStore(state => state.passengers);
  const setDepartureDate = useVoyageSearchStore(state => state.setDepartureDate);
  const setSearchParams = useVoyageSearchStore(state => state.setSearchParams);
  const setExpandedVoyage = useSeatSelectionStore(state => state.setExpandedVoyage);

  const { t, i18n } = useTranslation();

  const groupedFilter = useMemo(
    () => ({
      departureVilleId: fromVille?.id,
      arrivalVilleId: toVille?.id,
      departureDate: departureDate ? departureDate.format('YYYY-MM-DD') : '',
      koperativeId: koperativeId ?? undefined,
      language: i18n.language,
      passengers,
      departureTimeGroup: departureTimeGroup ?? undefined,
    }),
    [fromVille?.id, toVille?.id, departureDate, koperativeId, i18n.language, passengers, departureTimeGroup],
  );

  const { data: voyageClasses = [], isLoading: voyagesLoading } = useGroupedVoyages(groupedFilter);

  const handleKoperativeGridClick = (koperativeIdClicked: number) => {
    setKoperativeId(koperativeIdClicked);
    setDepartureTimeGroup(null);

    const firstAvailableDay = weeklyQuery.data?.weeklyResults?.find(
      day => day.hasVoyages && day.koperatives?.some(k => k.id === koperativeIdClicked),
    );
    if (firstAvailableDay) {
      setDepartureDate(dayjs(firstAvailableDay.date));
      setSearchParams({ hasSearched: true });
    }
  };

  const handleKoperativeFilterChange = (koperativeIdClicked: number | null) => {
    handleKoperativeChange(koperativeIdClicked);

    if (koperativeIdClicked) {
      const correspondingClass = voyageClasses?.find(vc => vc.koperative?.id === koperativeIdClicked);
      const firstVoyage = correspondingClass?.voyages?.[0];
      if (firstVoyage?.id) {
        setExpandedVoyage(firstVoyage.id, firstVoyage.classe?.name ?? '');
      }
    }
  };

  if (weeklyQuery.isLoading) {
    return (
      <Box sx={{ my: 4 }}>
        <VoyageWeeklyResultsSkeleton tabCount={7} />
        {Array.from({ length: 3 }, (_, i) => (
          <VoyageItemSkeleton key={i} />
        ))}
      </Box>
    );
  }

  if (error || weeklyQuery.error) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="error">{error ?? weeklyQuery.error?.message ?? t(Labels.voyage_weekly_error)}</Alert>
      </Box>
    );
  }

  const selectedDayResult = weeklyQuery.data?.weeklyResults?.find(day => day.resultId === selectedTab);
  const availableTimeGroups = selectedDayResult?.availableTimeGroups ?? [];
  const hasVoyagesOnSelectedDate = selectedDayResult?.hasVoyages ?? false;

  const hasWeeklySummaries = Boolean(weeklyQuery.data?.koperativeSummaries?.length);
  const formattedDate = voyageDateUtils.formatWithLocale(departureDate, 'dddd D MMMM', i18n.language);

  const handleMonthlyDaySelect = (date: Dayjs) => {
    setDepartureDate(date);
    setSearchParams({ hasSearched: true });
  };

  return hasSearched ? (
    <Box id="weekly-results">
      <Box sx={{ my: 4 }}>
        <WeeklyHeader onEditSearch={onEditSearch} t={t} />

        {weeklyQuery.data?.weeklyResults && (
          <WeeklyTabs
            weeklyResults={weeklyQuery.data.weeklyResults}
            selectedTab={selectedTab}
            language={i18n.language}
            onTabChange={handleTabChange}
          />
        )}

        <KoperativeFilter
          availableKoperatives={availableKoperatives}
          selectedKoperativeId={koperativeId}
          onKoperativeChange={handleKoperativeFilterChange}
          t={t}
        />
      </Box>

      <VoyageWeeklyResults
        loading={voyagesLoading}
        hasWeeklySummaries={hasWeeklySummaries}
        koperativeSummaries={weeklyQuery.data?.koperativeSummaries ?? []}
        voyageClasses={voyageClasses}
        formattedDate={formattedDate}
        language={i18n.language}
        koperativeId={koperativeId}
        passengers={passengers}
        fromVille={fromVille}
        toVille={toVille}
        onKoperativeClick={handleKoperativeGridClick}
        onDaySelect={handleMonthlyDaySelect}
        availableTimeGroups={availableTimeGroups}
        hasVoyagesOnSelectedDate={hasVoyagesOnSelectedDate}
      />
    </Box>
  ) : (
    <></>
  );
};

export default VoyageWeeklySearch;
