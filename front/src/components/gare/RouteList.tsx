import React from 'react';
import { Alert, Box, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import IconButtonTx from '@/components/ui/IconButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import { useRoutesByConnectedGare } from '@/hooks/route.hooks';
import { useTranslation } from 'react-i18next';
import { Route } from '@/models/Route';
import Labels from '@/labelKeys.json';
import { useCurrencyFormatter } from '@/utils/currency.utils';

interface RouteListProps {
  gareId: number;
  onEditRoute?: (route: Route) => void;
  onDeleteRoute?: (route: Route) => void;
}

const RouteList: React.FC<RouteListProps> = ({ gareId, onEditRoute, onDeleteRoute }) => {
  const { t } = useTranslation();
  const { formatFrais } = useCurrencyFormatter();
  const { data: availableRoutes = [], isLoading, error } = useRoutesByConnectedGare(gareId);

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {t(Labels.ui_error_general)}: {error.message}
      </Alert>
    );

  return (
    <>
      {availableRoutes.length > 0 ? (
        <Grid container spacing={1.5}>
          {availableRoutes.map(route => (
            <Grid key={route.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      <StyledIcon icon={LocationCityIcon} variant="secondary" />
                      <Typography variant="h6" noWrap>
                        {route.arrivalGare?.ville?.name ?? route.arrivalGare?.name}
                      </Typography>
                    </Box>
                    {route.fraisKoperative != null && route.fraisKoperative > 0 && (
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', ml: 1 }}>
                        {formatFrais(route.fraisKoperative)}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      {route.estimatedDurationHours != null && route.estimatedDurationHours > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          ~{route.estimatedDurationHours}h
                        </Typography>
                      )}

                      {route.arrivalGare?.ville?.name &&
                        route.arrivalGare?.name &&
                        route.arrivalGare.ville.name !== route.arrivalGare.name && (
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {route.arrivalGare.name}
                          </Typography>
                        )}
                    </Box>

                    <Stack direction="row" spacing={0.5}>
                      <IconButtonTx
                        size="small"
                        onClick={() => onEditRoute?.(route)}
                        sx={{ minWidth: 'auto' }}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButtonTx>
                      <IconButtonTx
                        size="small"
                        onClick={() => onDeleteRoute?.(route)}
                        sx={{ minWidth: 'auto' }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButtonTx>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography color="text.secondary">{t(Labels.ui_message_no_routes)}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t(Labels.ui_message_create_routes_help)}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default RouteList;
