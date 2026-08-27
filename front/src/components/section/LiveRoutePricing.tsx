import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Stack, type SxProps, type Theme, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from '@/utils/dayjs';
import LabelKeys from '@/labelKeys.json';
import { useRoutesByDepartureVilleId, useTopVilles } from '@/hooks/route.hooks';
import { useDetectedVille } from '@/hooks/ville.hooks';
import { useVoyageSearchStore } from '@/stores/voyage-search.store';
import LiveRoutePricingSkeleton from './skeleton/LiveRoutePricingSkeleton';
import RouteItemSkeleton from './components/RouteItemSkeleton';
import RouteItem from './components/RouteItem';
import { Route } from '@/models/Route';

interface LiveRoutePricingProps {
  sx?: SxProps<Theme>;
}

const LiveRoutePricing: React.FC<LiveRoutePricingProps> = ({ sx }) => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  const fromVille = useVoyageSearchStore(state => state.fromVille);
  const selectedDate = useMemo(() => dayjs().add(1, 'day').startOf('day'), []);

  const { data: topVilles, isLoading: isLoadingVilles } = useTopVilles();
  const { detectedVille } = useDetectedVille();

  const departureCities = useMemo(() => topVilles ?? [], [topVilles]);

  const activeVilleId = fromVille?.id ?? detectedVille?.id ?? departureCities[0]?.id;

  const {
    data: routesByVille,
    isLoading: isLoadingRoutes,
    error,
  } = useRoutesByDepartureVilleId(activeVilleId, selectedDate.tz('Indian/Antananarivo', true).format('YYYY-MM-DD'));

  const routes = routesByVille ?? [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted && (isLoadingRoutes || isLoadingVilles)) {
    return <LiveRoutePricingSkeleton />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{t(LabelKeys.error_loading_voyages)}</Typography>
      </Box>
    );
  }

  const hasRoutes = routes.length > 0;

  return (
    <Stack sx={{ ...sx }} spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        {t(LabelKeys.live_route_pricing_title)}
      </Typography>

      <Stack spacing={0}>
        {isLoadingRoutes && isMounted ? (
          ['RouteItem1', 'RouteItem2'].map(i => <RouteItemSkeleton key={i} />)
        ) : hasRoutes ? (
          routes.map((route: Route) => (
            <RouteItem key={route.id} route={route} showPromo={false} date={selectedDate.format('YYYY-MM-DD')} />
          ))
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            {t(LabelKeys.no_voyages_warning)}
          </Alert>
        )}
      </Stack>
    </Stack>
  );
};

export default LiveRoutePricing;
