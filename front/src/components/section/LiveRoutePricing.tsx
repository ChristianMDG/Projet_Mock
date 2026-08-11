import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Stack, type SxProps, type Theme, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from '@/utils/dayjs';
import type { Dayjs } from 'dayjs';
import LabelKeys from '@/labelKeys.json';
import { useRoutesByDepartureVilleId, useTopVilles } from '@/hooks/route.hooks';
import { useDetectedVille } from '@/hooks/ville.hooks';
import LiveRoutePricingSkeleton from './skeleton/LiveRoutePricingSkeleton';
import RouteItemSkeleton from './components/RouteItemSkeleton';
import RouteFilters from './components/RouteFilters';
import RouteItem from './components/RouteItem';
import { Ville } from '@/models/Ville';
import { Route } from '@/models/Route';

interface LiveRoutePricingProps {
  sx?: SxProps<Theme>;
}

const LiveRoutePricing: React.FC<LiveRoutePricingProps> = ({ sx }) => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  const tomorrow = useMemo(() => dayjs().add(1, 'day').startOf('day'), []);
  const [selectedDate] = useState<Dayjs>(tomorrow);

  const { data: topVilles, isPending: isLoadingVilles } = useTopVilles();
  const [departureCity, setDepartureCity] = useState<Ville | null>(null);
  const { detectedVille } = useDetectedVille();

  const {
    data: routesByVille,
    isPending: isLoadingRoutes,
    error,
  } = useRoutesByDepartureVilleId(departureCity?.id, selectedDate.tz('Indian/Antananarivo', true).format('YYYY-MM-DD'));

  const routes = routesByVille ?? [];
  const departureCities = topVilles ?? [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (departureCities.length > 0 && !departureCity) {
      setDepartureCity(departureCities.find(v => v.id === detectedVille?.id) ?? departureCities[0]);
    }
  }, [departureCities, departureCity, detectedVille]);

  // Show the full skeleton while cities (villes) are loading (initial state)
  if (isMounted && isLoadingVilles) {
    return <LiveRoutePricingSkeleton />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{t(LabelKeys.error_loading_voyages)}</Typography>
      </Box>
    );
  }

  return (
    <Stack sx={{ ...sx }}>
      <Stack
        direction="row"
        sx={{
          mb: 2,
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {t(LabelKeys.live_route_pricing_title)}
        </Typography>
        <Typography variant="h3" sx={{ color: 'red', fontSize: '1.5rem', fontWeight: 700, ml: 1 }}>
          TAXIBROUSSE
        </Typography>
      </Stack>

      <RouteFilters
        departureCity={departureCity}
        onDepartureCityChange={setDepartureCity}
        uniqueDepartureCities={departureCities}
      />

      <Stack spacing={0}>
        {isLoadingRoutes ? (
          ['RouteItem1', 'RouteItem2'].map(i => <RouteItemSkeleton key={i} />)
        ) : routes.length > 0 ? (
          routes.map((route: Route) => (
            <RouteItem key={route.id} route={route} showPromo={false} date={selectedDate.format('YYYY-MM-DD')} />
          ))
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {t(LabelKeys.no_voyages_warning)}
          </Alert>
        )}
      </Stack>
    </Stack>
  );
};

export default LiveRoutePricing;
