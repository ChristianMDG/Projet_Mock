import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  Chip,
  Button,
  Alert,
  LinearProgress,
  Grid,
} from '@mui/material';
import { AltRoute, Search, FilterList, Refresh } from '@mui/icons-material';
import type { Route } from '@/api/route.api';
import { useRoutesByVille, useUpdateRoute } from '@/hooks/route.hook';
import { useVilles } from '@/hooks/ville.hook';
import { useRouteStore } from '@/stores/route.store';
import { SectionHeader } from '@/components/shared';
import VilleSelector from '@/components/VilleSelector';
import RouteList from '@/components/RouteList';
import RouteEditForm from '@/components/RouteEditForm';
import Labels from '@/labelKeys.json';

export default function RouteManagementPage() {
  const { t } = useTranslation();
  const [selectedVilleId, setSelectedVilleId] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all');

  const { editingRoute, setEditingRoute } = useRouteStore();
  const { data: villes = [], isLoading: loadingVilles } = useVilles();
  const { data: routes = [], isLoading: loadingRoutes } = useRoutesByVille(selectedVilleId);
  const updateRouteMutation = useUpdateRoute();

  // Filtrer les routes
  const filteredRoutes = React.useMemo(() => {
    let filtered = routes;

    // Filtre par statut
    if (statusFilter === 'active') {
      filtered = filtered.filter((r) => r.isActive === true);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((r) => r.isActive === false);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name?.toLowerCase().includes(query) ||
          r.arrivalGare?.name?.toLowerCase().includes(query) ||
          r.arrivalGare?.ville?.name?.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [routes, statusFilter, searchQuery]);

  const handleUpdateRoute = async (updatedRouteData: Partial<Route>) => {
    const originalRoute = routes.find((r) => r.id === updatedRouteData.id);
    if (originalRoute) {
      const mergedRoute = { ...originalRoute, ...updatedRouteData };
      await updateRouteMutation.mutateAsync(mergedRoute);
    }
  };

  const handleToggleStatus = async (route: Route) => {
    await handleUpdateRoute({ id: route.id, isActive: !route.isActive });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const selectedVille = villes.find((v) => v.id === selectedVilleId);

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <SectionHeader
          icon={<AltRoute />}
          title={t(Labels.route_title)}
          subtitle={`${filteredRoutes.length} ${filteredRoutes.length !== 1 ? t(Labels.route_count_plural) : t(Labels.route_count)}`}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <VilleSelector
          villes={villes}
          selectedVilleId={selectedVilleId}
          onSelect={setSelectedVilleId}
          loading={loadingVilles}
        />
      </Box>

      {selectedVilleId ? (
        <Box>
          {/* Filtres */}
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FilterList fontSize="small" color="primary" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {t(Labels.route_filters)}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button size="small" startIcon={<Refresh />} onClick={handleResetFilters}>
                  {t(Labels.user_refresh)}
                </Button>
              </Box>

              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 12, sm: 'grow' }}>
                  <TextField
                    placeholder={t(Labels.route_search_placeholder)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 'auto' }}>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={t(Labels.route_filter_all)}
                      variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                      color={statusFilter === 'all' ? 'primary' : 'default'}
                      onClick={() => setStatusFilter('all')}
                      sx={{ cursor: 'pointer' }}
                    />
                    <Chip
                      label={t(Labels.route_filter_active)}
                      variant={statusFilter === 'active' ? 'filled' : 'outlined'}
                      color={statusFilter === 'active' ? 'success' : 'default'}
                      onClick={() => setStatusFilter('active')}
                      sx={{ cursor: 'pointer' }}
                    />
                    <Chip
                      label={t(Labels.route_filter_inactive)}
                      variant={statusFilter === 'inactive' ? 'filled' : 'outlined'}
                      color={statusFilter === 'inactive' ? 'default' : 'default'}
                      onClick={() => setStatusFilter('inactive')}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Stack>
                </Grid>
              </Grid>

              {(searchQuery || statusFilter !== 'all') && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {filteredRoutes.length} {t(Labels.route_results_found)}
                  </Typography>
                  <Button size="small" onClick={handleResetFilters}>
                    {t(Labels.route_reset_filters)}
                  </Button>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t(Labels.route_routes_for)} {selectedVille?.name ?? '-'}
            </Typography>
          </Box>

          {/* Chargement */}
          {loadingRoutes && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

          {/* Aucune route */}
          {!loadingRoutes && filteredRoutes.length === 0 && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {searchQuery || statusFilter !== 'all' ? t(Labels.route_no_results) : t(Labels.route_no_data)}
            </Alert>
          )}

          {/* Liste des routes */}
          {!loadingRoutes && filteredRoutes.length > 0 && (
            <>
              <RouteList
                routes={filteredRoutes}
                onUpdateRoute={handleUpdateRoute}
                onToggleStatus={handleToggleStatus}
                onEditRoute={(r) => setEditingRoute(r)}
                title={t(Labels.route_title)}
              />

              <RouteEditForm
                open={!!editingRoute}
                route={editingRoute}
                onClose={() => setEditingRoute(null)}
                onSave={async (data) => {
                  await handleUpdateRoute(data);
                  setEditingRoute(null);
                }}
              />
            </>
          )}
        </Box>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="textSecondary">
            {t(Labels.route_select_city)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
