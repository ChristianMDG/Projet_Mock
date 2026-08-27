import { useState, useEffect, SyntheticEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Button,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  useMediaQuery,
  Paper,
} from '@mui/material';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import DatasetIcon from '@mui/icons-material/Dataset';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SwapVillesButton from '@/components/shared/SwapVillesButton';
import { OrderList, GuestOrderSearch } from '@/components/order';
import GuestReservationList from '@/components/reservation/GuestReservationList';

import StyledTab from '@/components/ui/StyledTab';
import TaxibrousseRedIcon from '@/components/ui/TaxibrousseRedIcon';
import { getStyledTabListSx } from '@/utils/tabStyles';

import { DatePicker } from '@mui/x-date-pickers';

import VilleAutocomplete from '@/components/shared/VilleAutocomplete';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';
import { useKoperatives } from '@/hooks/koperative.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useAuthStore } from '@/stores/auth.store';
import { useVoyageSearchStore } from '@/stores/voyage-search.store';
import { Koperative } from '@/models/Koperative';
import { ROUTES } from '@/constants/routes';
import dayjs, { voyageDateUtils } from '@/utils/dayjs';
import { useVoyageSearchUrl } from '@/hooks/useVoyageSearchUrl';
import { useDetectedVille } from '@/hooks/ville.hooks';
import Business from '@mui/icons-material/Business';
import { mergeDatePickerSlotProps } from '@/utils/datePickerUtils';
import { trackEvent } from '@/hooks/google-analytics.hook';

interface SearchFormProps {
  navigateOnSearch?: boolean;
}

export default function SearchForm({ navigateOnSearch = true }: SearchFormProps) {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme => theme.breakpoints.down('sm'), {
    defaultMatches: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  // Use false during SSR to match server render
  const isMobile = mounted ? isMobileQuery : false;

  const isNotSearchPage = location.pathname !== ROUTES.searchResults[i18n.language];

  const { fromVille, toVille, departureDate, passengers, koperativeId, setError, swapVilles, setSearchParams } =
    useVoyageSearchStore();

  const { data: koperatives = [], isLoading: koperativesLoading, error: koperativesError } = useKoperatives();

  const { detectedVille } = useDetectedVille();

  const [tabId, setTabId] = useState('koperativa');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const { buildUrlQuery } = useVoyageSearchUrl();

  // Pre-select departure city from geolocation if not already set
  useEffect(() => {
    if (fromVille) return;
    if (detectedVille) setSearchParams({ fromVille: detectedVille });
  }, [detectedVille, fromVille, setSearchParams]);

  const handleToggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const handleTabChange = (_event: SyntheticEvent, tabId: string) => {
    setTabId(tabId);
  };

  const handleSwapCities = () => {
    setIsSwapping(true);
    swapVilles();

    // Add a small delay for visual feedback
    setTimeout(() => {
      setIsSwapping(false);
    }, 300);
  };

  const handleSearch = () => {
    if (fromVille && toVille) {
      trackEvent('search_voyages_clicked', 'Search', `${fromVille.name} → ${toVille.name}`);

      setSearchParams({
        error: null,
        searchResults: [],
        availableKoperatives: [],
        hasSearched: true,
      });

      const search = buildUrlQuery({
        fromVilleName: fromVille.name,
        toVilleName: toVille.name,
        departureDate: (dayjs.isDayjs(departureDate) ? departureDate : dayjs(departureDate))
          .tz('Indian/Antananarivo', true)
          .format('YYYY-MM-DD'),
        passengers,
        koperativeId,
      });

      // Navigate to search results page if not already there
      if (navigateOnSearch && isNotSearchPage) {
        navigate({ pathname: ROUTES.searchResults[i18n.language], search });
      } else {
        navigate({ pathname: location.pathname, search }, { replace: true });
        setTimeout(() => {
          document.getElementById('weekly-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      setError(t(Labels.voyage_search_select_cities));
    }
  };

  return (
    <TabContext value={tabId}>
      <TabList onChange={handleTabChange} variant="scrollable" sx={getStyledTabListSx()}>
        <StyledTab
          icon={<AirportShuttleIcon />}
          label={t(Labels.search_voyages_tab)}
          iconPosition="start"
          value="koperativa"
        />
        <StyledTab
          icon={<ConfirmationNumberIcon />}
          label={t(Labels.search_my_reservations_tab)}
          iconPosition="start"
          value="reservations"
        />
        <StyledTab
          icon={<DatasetIcon />}
          label={t(Labels.search_handefa_kolis_tab)}
          iconPosition="start"
          value="colis"
        />
        <StyledTab disabled cardStyle={false} />
      </TabList>
      <TabPanel sx={{ padding: 0 }} value="koperativa">
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid container size={12} spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <VilleAutocomplete
                  id="search-from-ville"
                  value={fromVille}
                  onChange={v => setSearchParams({ fromVille: v })}
                  label={t(Labels.voyage_search_from_city)}
                  placeholder={t(Labels.ui_label_city_departure)}
                  startIcon={TripOriginIcon}
                  excludeVille={toVille}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <VilleAutocomplete
                  id="search-to-ville"
                  value={toVille}
                  onChange={v => setSearchParams({ toVille: v })}
                  label={t(Labels.voyage_search_to_city)}
                  placeholder={t(Labels.ui_label_city_destination)}
                  startIcon={LocationOnIcon}
                  excludeVille={fromVille}
                />
              </Grid>
              <Grid
                size={{ xs: 12, sm: 12, md: 4 }}
                container
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'nowrap',
                }}
              >
                <SwapVillesButton
                  onClick={handleSwapCities}
                  isSwapping={isSwapping}
                  disabled={(!fromVille && !toVille) || isSwapping}
                />
                <ToggleButton
                  value="advanced"
                  selected={showAdvancedOptions}
                  onChange={handleToggleAdvancedOptions}
                  aria-label="Options avancées"
                  sx={{
                    height: '56px',
                    width: '76px',
                    borderRadius: 2,
                  }}
                >
                  <TaxibrousseRedIcon />
                </ToggleButton>
              </Grid>
            </Grid>
            <Collapse in={showAdvancedOptions} timeout="auto" sx={{ width: 1 }}>
              <Grid container size={12} spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <DatePicker
                    name="search-departure-date"
                    label={t(Labels.voyage_search_departure_date)}
                    format="dddd D MMMM"
                    value={dayjs.isDayjs(departureDate) ? departureDate : dayjs(departureDate)}
                    onChange={newValue => newValue && setSearchParams({ departureDate: newValue })}
                    minDate={voyageDateUtils.now()}
                    open={datePickerOpen}
                    onOpen={() => setDatePickerOpen(true)}
                    onClose={() => setDatePickerOpen(false)}
                    timezone="Indian/Antananarivo"
                    slotProps={mergeDatePickerSlotProps({
                      textField: {
                        id: 'search-departure-date',
                        onClick: () => setDatePickerOpen(!datePickerOpen),
                      },
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel id="search-passengers-label">{t(Labels.voyage_search_passengers)}</InputLabel>
                    <Select
                      id="search-passengers"
                      labelId="search-passengers-label"
                      value={passengers}
                      label={t(Labels.voyage_search_passengers)}
                      onChange={e => setSearchParams({ passengers: e.target.value as number })}
                      inputProps={{
                        id: 'search-passengers-input',
                      }}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <MenuItem key={num} value={num}>
                          {num} {num === 1 ? 'Passager' : 'Passagers'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  size={{ xs: 12, sm: 12, md: 4 }}
                  sx={{
                    display: { md: 'block' },
                  }}
                >
                  <KoperativeAutocomplete
                    id="search-trip-type"
                    value={koperatives.find(k => k.id === koperativeId) ?? null}
                    onChange={value => setSearchParams({ koperativeId: (value as Koperative)?.id ?? null })}
                    label={t(Labels.filter_by_cooperative)}
                    options={koperatives}
                    isLoading={koperativesLoading}
                    fetchError={koperativesError}
                    startIcon={Business}
                  />
                </Grid>
              </Grid>
            </Collapse>
            <Grid
              container
              size={12}
              spacing={2}
              direction="row"
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <Grid size={{ xs: 12, md: 'auto' }} sx={{ ml: { md: 'auto' } }}>
                <Button
                  fullWidth={isMobile}
                  size="large"
                  variant="contained"
                  endIcon={<FindInPageIcon />}
                  onClick={handleSearch}
                  aria-label={t(Labels.button_search_voyages) ?? 'Rechercher'}
                >
                  {t(Labels.button_search_voyages)}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>
      <TabPanel sx={{ padding: 0 }} value="colis">
        {isAuthenticated ? <OrderList /> : <GuestOrderSearch />}
      </TabPanel>
      <TabPanel sx={{ padding: 0 }} value="reservations">
        <GuestReservationList />
      </TabPanel>
    </TabContext>
  );
}
