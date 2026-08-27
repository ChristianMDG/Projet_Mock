import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import StyledIcon from '@/components/ui/StyledIcon';
import { useGuichetDestinations, useUpdateGuichetDestinations } from '@/hooks/guichet.hooks';
import { useKoperativeGuichets } from '@/hooks/koperative.hooks';
import { Gare } from '@/types';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import Grid from '@mui/material/Grid';
import ProtectedTx from '@/components/ProtectedTx';
import GareAutocomplete from '@/components/shared/GareAutocomplete';

interface GuichetDestinationsProps {
  guichetId: number;
  koperativeId: number;
  currentGareId?: number;
}

const GuichetDestinations: React.FC<GuichetDestinationsProps> = ({ guichetId, koperativeId, currentGareId }) => {
  const { t } = useTranslation();
  const [selectedGare, setSelectedGare] = useState<Gare | null>(null);

  // Fetch data
  const { data: destinations = [], isLoading: destinationsLoading } = useGuichetDestinations(guichetId);
  const { data: koperativeGuichets = [], isLoading: garesLoading } = useKoperativeGuichets(koperativeId);
  const updateDestinations = useUpdateGuichetDestinations(guichetId);

  // Only show gares from this cooperative's guichets, excluding the current gare and already added destinations
  const availableGares = useMemo(() => {
    if (!koperativeGuichets.length) return [];
    const destinationIds = destinations.map(d => d.id);
    return koperativeGuichets
      .map(g => g.gare)
      .filter((gare): gare is Gare => !!gare && gare.id !== currentGareId && !destinationIds.includes(gare.id));
  }, [koperativeGuichets, destinations, currentGareId]);

  const handleAddDestination = async () => {
    if (!selectedGare) return;

    try {
      const updatedDestinations = [...destinations, selectedGare];
      await updateDestinations.mutateAsync(updatedDestinations);
      setSelectedGare(null);
    } catch (error) {
      console.error('Failed to add destination:', error);
    }
  };

  const handleRemoveDestination = async (gareId: number) => {
    try {
      const updatedDestinations = destinations.filter(d => d.id !== gareId);
      await updateDestinations.mutateAsync(updatedDestinations);
    } catch (error) {
      console.error('Failed to remove destination:', error);
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={<StyledIcon icon={MapIcon} variant="secondary" />}
        title={<Typography variant="h6">{t(Labels.guichet_form_destinations_title)}</Typography>}
        subheader={<Typography variant="body2">{t(Labels.guichet_form_destinations_helper)}</Typography>}
      />
      <CardContent>
        <Grid container spacing={2}>
          {/* Add new destination */}
          <ProtectedTx>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <GareAutocomplete
                  value={selectedGare}
                  onChange={setSelectedGare}
                  label={t(Labels.guichet_form_destinations_select)}
                  disabled={garesLoading || updateDestinations.isPending}
                  options={availableGares}
                  isLoading={garesLoading}
                />
                <Button
                  variant="contained"
                  onClick={handleAddDestination}
                  disabled={!selectedGare || updateDestinations.isPending}
                  startIcon={updateDestinations.isPending ? <CircularProgress size={20} /> : <AddIcon />}
                  sx={{ minWidth: 'fit-content' }}
                >
                  {t(Labels.guichet_form_destinations_add_button)}
                </Button>
              </Box>
            </Grid>
          </ProtectedTx>

          {/* Display error */}
          {updateDestinations.isError && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">{t(Labels.error_save_general)}</Alert>
            </Grid>
          )}

          {/* Success message */}
          {updateDestinations.isSuccess && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="success">{t(Labels.guichet_form_destinations_save_success)}</Alert>
            </Grid>
          )}

          {/* Destinations list */}
          <Grid size={{ xs: 12 }}>
            {destinationsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : destinations.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {t(Labels.guichet_form_destinations_empty)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(Labels.guichet_form_destinations_empty_description)}
                </Typography>
              </Box>
            ) : (
              <List>
                {destinations.map(destination => (
                  <ListItem
                    key={destination.id}
                    secondaryAction={
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveDestination(destination.id!)}
                        disabled={updateDestinations.isPending}
                        startIcon={<DeleteIcon />}
                      >
                        {t(Labels.button_delete)}
                      </Button>
                    }
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">{destination.name}</Typography>
                          <Chip label={destination.ville?.name} size="small" color="primary" />
                        </Box>
                      }
                      secondary={destination.address}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GuichetDestinations;
