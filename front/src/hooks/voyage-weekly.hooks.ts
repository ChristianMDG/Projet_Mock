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
  const departureTimeGroup = useVoyageSearchStore(state => state.departureTimeGroup);

  // Stable action references using individual selectors to avoid object recreation
  const setLoading = useVoyageSearchStore(state => state.setLoading);
  const setDepartureDate = useVoyageSearchStore(state => state.setDepartureDate);
  const setKoperativeId = useVoyageSearchStore(state => state.setKoperativeId);
  const setSearchResults = useVoyageSearchStore(state => state.setSearchResults);
  const setAvailableKoperatives = useVoyageSearchStore(state => state.setAvailableKoperatives);
  const setDepartureTimeGroup = useVoyageSearchStore(state => state.setDepartureTimeGroup);

  // Search query for voyages
  const searchQuery = useMemo(() => {
    return {
      departureVilleId: fromVille?.id,
      arrivalVilleId: toVille?.id,
      departureDate: departureDate ? departureDate.tz('Indian/Antananarivo', true).format('YYYY-MM-DD') : '',
      language: i18n.language,
      passengers: passengers,
    };
  }, [fromVille?.id, toVille?.id, departureDate, i18n.language, passengers]);

  const weeklyQuery = useWeeklyVoyageResults(searchQuery);
  const selectedTab = useMemo(() => Number(departureDate.format('YYYYMMDD')), [departureDate]);

  useEffect(() => {
    if (weeklyQuery.data?.weeklyResults && hasSearched) {
      const selectedDay = weeklyQuery.data.weeklyResults.find(day => day.resultId === selectedTab);

      setSearchResults(selectedDay?.voyages ?? []);
      setAvailableKoperatives(selectedDay?.koperatives ?? []);
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
        setDepartureTimeGroup(null);
      }
    },
    [weeklyQuery.data, setDepartureDate, setSearchResults, setDepartureTimeGroup],
  );

  const handleKoperativeChange = useCallback(
    (koperativeIdToSelect: number | null) => {
      setKoperativeId(koperativeIdToSelect);
      setDepartureTimeGroup(null);
    },
    [setKoperativeId, setDepartureTimeGroup],
  );

  return {
    error,
    hasSearched,
    fromVille,
    toVille,
    departureDate,
    koperativeId,
    departureTimeGroup,
    searchResults,
    availableKoperatives,
    // Hook results
    weeklyQuery,
    selectedTab,
    handleTabChange,
    handleKoperativeChange,
    setKoperativeId,
    setDepartureTimeGroup,
  };
};
