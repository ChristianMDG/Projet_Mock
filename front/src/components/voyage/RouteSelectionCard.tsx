import React from 'react';
import { Alert, Autocomplete, Box, Card, CardActions, CardContent, Grid, TextField, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ButtonTx from '@/components/ui/ButtonTx';
import TaxibrousseRedIcon from '@/components/ui/TaxibrousseRedIcon';
import ProtectedTx from '@/components/ProtectedTx';
import { Ville } from '@/types';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface RouteSelectionCardProps {
  koperativeVilles: Ville[];
  currentVille: Ville | null;
  destinationVille: Ville | null;
  onCurrentVilleChange: (ville: Ville | null) => void;
  onDestinationVilleChange: (ville: Ville | null) => void;
  onScheduleVoyage: () => void;
  onAddVille: () => void;
  koperativeId?: number;
  departureVilles?: Ville[];
  isDepartureDisabled?: boolean;
}

const RouteSelectionCard: React.FC<RouteSelectionCardProps> = ({
  koperativeVilles,
  currentVille,
  destinationVille,
  onCurrentVilleChange,
  onDestinationVilleChange,
  onScheduleVoyage,
  onAddVille,
  koperativeId,
  departureVilles,
  isDepartureDisabled,
}) => {
  const { t } = useTranslation();

  const villesForDeparture = departureVilles ?? koperativeVilles;
  const departedVilles = villesForDeparture.filter(ville => ville.id !== destinationVille?.id);
  const destinationVilles = koperativeVilles.filter(ville => ville.id !== currentVille?.id);

  const hasMultipleVilles = koperativeVilles.length > 1;
  const hasNoKoperativeId = !koperativeId;

  if (hasMultipleVilles) {
    return (
      <Card sx={{ border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                disabled={isDepartureDisabled}
                options={departedVilles}
                getOptionLabel={(ville: Ville) => ville?.name ?? ''}
                value={currentVille}
                onChange={(_, value) => onCurrentVilleChange(value)}
                renderInput={params => (
                  <TextField {...params} label={t(Labels.ui_label_city_departure)} required margin="dense" />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                options={destinationVilles}
                getOptionLabel={(ville: Ville) => ville?.name ?? ''}
                value={destinationVille}
                onChange={(_, value) => onDestinationVilleChange(value)}
                renderInput={params => (
                  <TextField {...params} label={t(Labels.ui_label_city_destination)} margin="dense" />
                )}
                renderOption={(props, ville: Ville) => {
                  const { key, ...rest } = props;
                  return (
                    <Box
                      key={key}
                      component="li"
                      sx={{
                        margin: 1,
                        borderRadius: 2,
                        border: theme => `1.5px solid ${theme.palette.divider}`,
                      }}
                      {...rest}
                    >
                      <Box>
                        <Typography variant="h6">{ville.name}</Typography>
                        <Typography
                          variant="caption"
                          color="grey.600"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}
                        >
                          {currentVille?.name}
                          <TaxibrousseRedIcon sx={{ fontSize: 'inherit' }} />
                          <b>{ville.name}</b>
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
          <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE', 'GUICHET']}>
            <ButtonTx
              variant="contained"
              size="small"
              startIcon={<CalendarMonthIcon />}
              onClick={onScheduleVoyage}
              disabled={hasNoKoperativeId}
            >
              {t(Labels.button_schedule_voyage)}
            </ButtonTx>
          </ProtectedTx>
          <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE']}>
            <ButtonTx
              variant="contained"
              size="small"
              startIcon={<LocationCityIcon />}
              onClick={onAddVille}
              disabled={hasNoKoperativeId}
            >
              {t(Labels.button_add_ville)}
            </ButtonTx>
          </ProtectedTx>
        </CardActions>
      </Card>
    );
  }

  return (
    <Card sx={{ border: 1, borderColor: 'divider' }}>
      <CardContent>
        <Alert severity="info">
          <Typography variant="body2">{t(Labels.voyage_no_data_hint)}</Typography>
        </Alert>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE']}>
          <ButtonTx
            variant="contained"
            size="small"
            startIcon={<LocationCityIcon />}
            onClick={onAddVille}
            disabled={hasNoKoperativeId}
          >
            {t(Labels.button_add_ville)}
          </ButtonTx>
        </ProtectedTx>
      </CardActions>
    </Card>
  );
};

export default RouteSelectionCard;
