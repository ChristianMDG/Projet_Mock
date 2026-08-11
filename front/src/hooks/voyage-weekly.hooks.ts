import React, { useCallback, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { useVoyageSearchStore } from '@/stores/voyage-search.store';
import { useWeeklyVoyageResults } from '@/hooks/voyage.hooks';
import { useTranslation } from 'react-i18next';

export const useVoyageWeeklyLogic = () => {
  const { i18n } = useTranslation();

  // Individual selectors to prevent object recreation causing infinite loops
  const error = useVoyageSearchStore(state => state.error);
  const hasSearched = useVoyageSearchStore(state => state.hasSearched);
  const fromVille = useVoyageSearchStore(state => state.fromVille);
  const toVille = useVoyageSearchStore(state => state.toVille);
  const departureDate = useVoyageSearchStore(state => state.departureDate);
  const koperativeId = useVoyageSearchStore(state => state.koperativeId);
  const passengers = useVoyageSearchStore(state => state.passengers);
  const searchResults = useVoyageSearchStore(state => state.searchResults);
  const availableKoperatives = useVoyageSearchStore(state => state.availableKoperatives);

  // Stable action references using individual selectors to avoid object recreation
  const setLoading = useVoyageSearchStore(state => state.setLoading);
  const setDepartureDate = useVoyageSearchStore(state => state.setDepartureDate);
  const setKoperativeId = useVoyageSearchStore(state => state.setKoperativeId);
  const setSearchResults = useVoyageSearchStore(state => state.setSearchResults);
  const setAvailableKoperatives = useVoyageSearchStore(state => state.setAvailableKoperatives);

  // Search query for voyages
  const searchQuery = useMemo(() => {
    return {
      departureVilleId: fromVille?.id,
      arrivalVilleId: toVille?.id,
      departureDate: departureDate ? departureDate.tz('Indian/Antananarivo', true).format('YYYY-MM-DD') : '',
      koperativeId: koperativeId ?? undefined,
      language: i18n.language,
      passengers: passengers,
    };
  }, [fromVille?.id, toVille?.id, departureDate, koperativeId, i18n.language, passengers]);

  const weeklyQuery = useWeeklyVoyageResults(searchQuery);
  const selectedTab = useMemo(() => Number(departureDate.format('YYYYMMDD')), [departureDate]);

  useEffect(() => {
    if (weeklyQuery.data?.weeklyResults && hasSearched) {
      const selectedDay = weeklyQuery.data.weeklyResults.find(day => day.resultId === selectedTab);

      setSearchResults(selectedDay?.voyages ?? []);
      if (!Boolean(koperativeId)) {
        setAvailableKoperatives(selectedDay?.koperatives ?? []);
      }
      setLoading(false);
    }
  }, [
    weeklyQuery.data?.weeklyResults,
    selectedTab,
    hasSearched,
    koperativeId,
    setSearchResults,
    setAvailableKoperatives,
    setLoading,
  ]);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, resultId: number) => {
      const selectedDay = weeklyQuery.data?.weeklyResults?.find(item => item.resultId === resultId);
      if (selectedDay) {
        setDepartureDate(dayjs(selectedDay.date));
        setSearchResults(selectedDay.voyages ?? []);
      }
    },
    [weeklyQuery.data, setDepartureDate, setSearchResults],
  );

  const handleKoperativeChange = useCallback(
    (event: { target: { value: string } }) => {
      const value = event.target.value;
      setKoperativeId(value && value !== '' ? Number(value) : null);
    },
    [setKoperativeId],
  );

  return {
    error,
    hasSearched,
    fromVille,
    toVille,
    departureDate,
    koperativeId,
    searchResults,
    availableKoperatives,
    // Hook results
    weeklyQuery,
    selectedTab,
    handleTabChange,
    handleKoperativeChange,
    setKoperativeId,
  };
};
