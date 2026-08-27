import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Drawer,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RouteIcon from '@mui/icons-material/Route';
import SaveIcon from '@mui/icons-material/Save';
import ButtonTx from '@/components/ui/ButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import GareAutocomplete from '@/components/shared/GareAutocomplete';
import ProtectedTx from '@/components/ProtectedTx';
import { useCreateOrUpdateRoute } from '@/hooks/route.hooks';
import { useGares } from '@/hooks/gare.hooks';
import { Route } from '@/models/Route';
import { Gare } from '@/models/Gare';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import useRouteFormStore from '@/stores/route-form.store';

interface RouteFormDrawerProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<Route>;
  defaultDepartureGare?: Gare;
  availableGares?: Gare[];
}

const RouteFormDrawer: React.FC<RouteFormDrawerProps> = ({
  open,
  onClose,
  initialData,
  defaultDepartureGare,
  availableGares,
}) => {
  const { t } = useTranslation();

  // --- ZUSTAND STATE ---
  const { form, loading, error, updateForm, setLoading, setError, resetForm } = useRouteFormStore();

  // --- HOOKS ---
  const createOrUpdateRoute = useCreateOrUpdateRoute();
  const { data: allGares = [], isLoading: garesLoading } = useGares();

  // Use provided availableGares or fall back to all gares
  const garesOptions = availableGares ?? allGares;
  const isGaresLoading = availableGares ? false : garesLoading;

  // --- EFFECTS ---
  useEffect(() => {
    const formData = {
      ...initialData,
      departureGare: initialData?.departureGare ?? defaultDepartureGare,
    };
    resetForm(formData);
  }, [initialData, defaultDepartureGare, open, resetForm]);

  // Auto-generate route name when both gares are available
  useEffect(() => {
    if (form.departureGare && form.arrivalGare && !initialData?.name) {
      const routeName = `${form.departureGare.name} - ${form.arrivalGare.name}`;
      updateForm({ name: routeName });
    }
  }, [form.departureGare, form.arrivalGare, initialData?.name, updateForm]);

  // --- HANDLERS ---
  const handleInputChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (
      field === 'estimatedDurationHours' ||
      field === 'distanceKm' ||
      field === 'fraisTaxibrousse' ||
      field === 'fraisKoperative'
    ) {
      updateForm({ [field]: value ? parseFloat(value) : null });
    } else {
      updateForm({ [field]: value });
    }
  };

  const handleSwitchChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({ [field]: event.target.checked });
  };

  const handleDepartureGareChange = (gare: Gare | null) => {
    updateForm({ departureGare: gare });
    if (gare && form.arrivalGare) {
      const routeName = `${gare.name} - ${form.arrivalGare.name}`;
      updateForm({ name: routeName });
    }
  };

  const handleArrivalGareChange = (gare: Gare | null) => {
    updateForm({ arrivalGare: gare });
    if (gare && form.departureGare) {
      const routeName = `${form.departureGare.name} - ${gare.name}`;
      updateForm({ name: routeName });
    }
  };

  const handleSave = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const routeData: Partial<Route> = {
        name: form.name.trim(),
        departureGare: form.departureGare?.id ? ({ id: form.departureGare.id } as Gare) : undefined,
        arrivalGare: form.arrivalGare?.id ? ({ id: form.arrivalGare.id } as Gare) : undefined,
        estimatedDurationHours: form.estimatedDurationHours ?? undefined,
        distanceKm: form.distanceKm ?? undefined,
        fraisTaxibrousse: form.fraisTaxibrousse ?? undefined,
        fraisKoperative: form.fraisKoperative ?? undefined,
        description: form.description.trim() || undefined,
        isActive: form.isActive,
      };

      if (typeof initialData?.id === 'number' && initialData.id > 0) {
        routeData.id = initialData.id;
      }

      await createOrUpdateRoute.mutateAsync(routeData);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t(Labels.route_form_save_error));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const isFormValid = form.name.trim() !== '' && form.departureGare && form.arrivalGare;
  const isDepartureGareDisabled = !!defaultDepartureGare;

  // Filter out departure gare from arrival options
  const availableArrivalGares = garesOptions.filter(gare => gare.id !== form.departureGare?.id);

  let buttonText;
  if (loading) {
    buttonText = t(Labels.button_saving);
  } else if (initialData?.id) {
    buttonText = t(Labels.button_edit);
  } else {
    buttonText = t(Labels.button_create);
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400, md: 500 },
          bgcolor: 'inherit',
        },
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 1,
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StyledIcon variant="secondary" icon={RouteIcon} />
              <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                {initialData?.id ? t(Labels.route_form_edit_title) : t(Labels.route_form_create_title)}
              </Typography>
            </Box>
          }
        />
        <CardContent sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            {/* Departure Gare */}
            <Grid size={12}>
              <GareAutocomplete
                id="route-form-departure-gare"
                value={form.departureGare ?? null}
                onChange={handleDepartureGareChange}
                label={t(Labels.route_form_departure_gare_label)}
                required
                disabled={loading || isDepartureGareDisabled}
                readOnly={isDepartureGareDisabled}
                options={garesOptions}
                isLoading={isGaresLoading}
              />
            </Grid>

            {/* Arrival Gare */}
            <Grid size={12}>
              <GareAutocomplete
                id="route-form-arrival-gare"
                value={form.arrivalGare ?? null}
                onChange={handleArrivalGareChange}
                label={t(Labels.route_form_arrival_gare_label)}
                required
                disabled={loading}
                options={availableArrivalGares}
                isLoading={isGaresLoading}
              />
            </Grid>
            {/* Route Name */}
            <Grid size={12}>
              <TextField
                fullWidth
                label={t(Labels.route_form_name_label)}
                value={form.name ?? ''}
                onChange={handleInputChange('name')}
                required
                disabled={loading}
                placeholder={t(Labels.route_form_name_placeholder)}
              />
            </Grid>

            {/* Duration */}
            <Grid size={6}>
              <TextField
                fullWidth
                label={t(Labels.route_form_duration_label)}
                value={form.estimatedDurationHours ?? ''}
                onChange={handleInputChange('estimatedDurationHours')}
                disabled={loading}
                type="number"
                placeholder="2.5"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 0.5,
                  },
                }}
              />
            </Grid>

            {/* Distance */}
            <Grid size={6}>
              <TextField
                fullWidth
                label={t(Labels.route_form_distance_label)}
                value={form.distanceKm ?? ''}
                onChange={handleInputChange('distanceKm')}
                disabled={loading}
                type="number"
                placeholder="150"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
              />
            </Grid>

            {/* Frais Taxibrousse */}
            <Grid size={6}>
              <TextField
                fullWidth
                label={t(Labels.route_form_frais_taxibrousse_label)}
                value={form.fraisTaxibrousse ?? ''}
                onChange={handleInputChange('fraisTaxibrousse')}
                disabled={loading}
                type="number"
                placeholder="5000"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 100,
                  },
                  input: {
                    endAdornment: (
                      <Typography variant="body2" color="text.secondary">
                        Ar
                      </Typography>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Frais Koperative */}
            <Grid size={6}>
              <TextField
                fullWidth
                label={t(Labels.route_form_frais_koperative_label)}
                value={form.fraisKoperative ?? ''}
                onChange={handleInputChange('fraisKoperative')}
                disabled={loading}
                type="number"
                placeholder="3000"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 100,
                  },
                  input: {
                    endAdornment: (
                      <Typography variant="body2" color="text.secondary">
                        Ar
                      </Typography>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Description */}
            <Grid size={12}>
              <TextField
                fullWidth
                label={t(Labels.route_form_description_label)}
                value={form.description ?? ''}
                onChange={handleInputChange('description')}
                disabled={loading}
                placeholder={t(Labels.route_form_description_placeholder)}
                multiline
                rows={3}
              />
            </Grid>

            {/* Active Switch */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch checked={form.isActive} onChange={handleSwitchChange('isActive')} disabled={loading} />
                }
                label={t(Labels.route_form_active_label)}
              />
            </Grid>
          </Grid>
        </CardContent>
        <ProtectedTx>
          <CardActions sx={{ mt: 'auto', gap: { xs: 2, md: 3 } }}>
            <ButtonTx
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
              startIcon={<CloseIcon />}
              sx={{ flex: 1 }}
            >
              {t(Labels.button_cancel)}
            </ButtonTx>
            <ButtonTx
              onClick={handleSave}
              variant="contained"
              disabled={loading || !isFormValid}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{ flex: 1 }}
            >
              {buttonText}
            </ButtonTx>
          </CardActions>
        </ProtectedTx>
      </Card>
    </Drawer>
  );
};

export default RouteFormDrawer;
