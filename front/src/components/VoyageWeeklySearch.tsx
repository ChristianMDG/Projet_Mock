import { Alert, Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVoyageWeeklyLogic } from '@/hooks/voyage-weekly.hooks';
import { useGroupedVoyages } from '@/hooks/voyage.hooks';
import Labels from '@/labelKeys.json';
import { WeeklyHeader } from './voyage/WeeklyHeader';
import { WeeklyTabs } from './voyage/WeeklyTabs';
import { KoperativeFilter } from './voyage/KoperativeFilter';
import { VoyageResults } from './voyage/VoyageResults';
import { KoperativeWeeklyGrid } from './voyage/KoperativeWeeklyGrid';
import { VoyageItemSkeleton } from '@/skeleton/VoyageItemSkeleton';
import VoyageWeeklyResultsSkeleton from '@/skeleton/VoyageWeeklyResultsSkeleton';
import { voyageDateUtils } from '@/utils/dayjs';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import VoyageMonthlyCalendar from '@/components/voyage/VoyageMonthlyCalendar';
import { useVoyageSearchStore } from '@/stores/voyage-search.store';

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
  } = useVoyageWeeklyLogic();

  const fromVille = useVoyageSearchStore(state => state.fromVille);
  const toVille = useVoyageSearchStore(state => state.toVille);
  const passengers = useVoyageSearchStore(state => state.passengers);
  const setDepartureDate = useVoyageSearchStore(state => state.setDepartureDate);
  const setSearchParams = useVoyageSearchStore(state => state.setSearchParams);

  const { t, i18n } = useTranslation();

  const groupedFilter = useMemo(
    () => ({
      departureVilleId: fromVille?.id,
      arrivalVilleId: toVille?.id,
      departureDate: departureDate ? departureDate.format('YYYY-MM-DD') : '',
      koperativeId: koperativeId ?? undefined,
      language: i18n.language,
      passengers,
    }),
    [fromVille?.id, toVille?.id, departureDate, koperativeId, i18n.language, passengers],
  );

  const { data: voyageClasses = [] } = useGroupedVoyages(groupedFilter);

  const handleKoperativeGridClick = (koperativeIdClicked: number) => {
    setKoperativeId(koperativeIdClicked);

    const firstAvailableDay = weeklyQuery.data?.weeklyResults?.find(
      day => day.hasVoyages && day.koperatives?.some(k => k.id === koperativeIdClicked),
    );
    if (firstAvailableDay) {
      setDepartureDate(dayjs(firstAvailableDay.date));
      setSearchParams({ hasSearched: true });
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

  const hasNoResultsForSelectedDate = !Boolean(voyageClasses?.length) && weeklyQuery?.data?.weeklyResults;
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
          onKoperativeChange={handleKoperativeChange}
          t={t}
        />
      </Box>

      {hasNoResultsForSelectedDate && hasWeeklySummaries ? (
        <KoperativeWeeklyGrid
          summaries={weeklyQuery.data!.koperativeSummaries ?? []}
          onKoperativeClick={handleKoperativeGridClick}
          selectedDate={formattedDate}
        />
      ) : voyageClasses?.length ? (
        <VoyageResults voyageClasses={voyageClasses} language={i18n.language} selectedDate={formattedDate} />
      ) : (
        <Box sx={{ mt: 2, width: '100%' }}>
          <Alert severity="info">
            <Typography variant="body2">
              {t(Labels.voyage_search_no_results, { date: formattedDate })} —{' '}
              {t(Labels.voyage_no_results_check_calendar)}
            </Typography>
          </Alert>
          {fromVille?.id && toVille?.id && (
            <Box sx={{ mt: 2, width: '100%' }}>
              <VoyageMonthlyCalendar
                departureVilleId={fromVille.id}
                arrivalVilleId={toVille.id}
                koperativeId={koperativeId ?? undefined}
                passengers={passengers}
                onDaySelect={handleMonthlyDaySelect}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  ) : (
    <></>
  );
};

export default VoyageWeeklySearch;
