import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  LinearProgress,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonTx, StyledIcon } from '@/components/ui';
import ProtectedTx from '@/components/ProtectedTx';
import { GareAutocomplete, VilleAutocomplete } from '@/components/shared';
import {
  Close as CloseIcon,
  Info,
  LocationOn,
  People,
  Save as SaveIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import GuichetDestinations from './GuichetDestinations';
import { useCreateGuichet, useUpdateGuichet } from '@/hooks/guichet.hooks';
import { useGares } from '@/hooks/gare.hooks';
import { useOperatorsByKoperative } from '@/hooks/operator.hooks';
import { Gare, Guichet, UserOperator, Ville } from '@/types';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import useGuichetFormStore from '@/stores/guichet-form.store';

// Types and Interfaces
interface GuichetFormProps {
  open: boolean;
  onClose: () => void;
  koperativeId: number;
  initialData?: Partial<Guichet>;
  mode: 'create' | 'edit';
}

const GuichetForm: React.FC<GuichetFormProps> = ({ open, onClose, koperativeId, initialData, mode }) => {
  const { t } = useTranslation();

  // ===== ZUSTAND STATE =====
  const { formData, selectedVille, loading, error, updateFormData, setSelectedVille, setLoading, setError, resetForm } =
    useGuichetFormStore();

  // ===== DATA FETCHING HOOKS =====
  const createGuichet = useCreateGuichet(koperativeId);
  const updateGuichet = useUpdateGuichet(koperativeId);
  const { data: gares = [], isLoading: garesLoading } = useGares();
  const { data: operators = [], isLoading: operatorsLoading } = useOperatorsByKoperative(koperativeId);

  // ===== EFFECTS =====
  useEffect(() => {
    resetForm(initialData, koperativeId);
  }, [initialData, mode, open, koperativeId, resetForm]);

  // ===== COMPUTED VALUES =====
  const filteredGares = useMemo(() => {
    if (!selectedVille) return gares;
    return gares.filter(gare => gare.ville.id === selectedVille.id);
  }, [gares, selectedVille]);

  const selectedGare = useMemo(() => {
    if (!formData.gare?.id) return null;
    return (
      filteredGares.find(g => g.id === formData.gare?.id) ??
      gares.find(g => g.id === formData.gare?.id) ??
      formData.gare
    );
  }, [formData.gare, filteredGares, gares]);

  const selectedOperateurs = useMemo(() => {
    if (!formData.operateurs?.length) return [];
    return operators.filter(op => formData.operateurs?.some((selected: UserOperator) => selected.id === op.id));
  }, [formData.operateurs, operators]);

  const isFormValid = useMemo(() => {
    return !!(formData.name?.trim() && formData.gare);
  }, [formData.name, formData.gare]);

  // ===== EVENT HANDLERS =====
  const handleInputChange = useCallback(
    (field: keyof Guichet) => (event: React.ChangeEvent<HTMLInputElement>) => {
      updateFormData({ [field]: event.target.value });
    },
    [updateFormData],
  );

  const handleSwitchChange = useCallback(
    (field: keyof Guichet) => (event: React.ChangeEvent<HTMLInputElement>) => {
      updateFormData({ [field]: event.target.checked });
    },
    [updateFormData],
  );

  const handleVilleChange = useCallback(
    (ville: Ville | null) => {
      setSelectedVille(ville);
      // Clear gare selection when ville changes
      updateFormData({ gare: undefined });
    },
    [setSelectedVille, updateFormData],
  );

  const handleGareChange = useCallback(
    (gare: Gare | null) => {
      const updates: Partial<Guichet> = {
        gare: gare ?? undefined,
      };

      if (gare?.ville) {
        setSelectedVille(gare.ville);
      }

      updateFormData(updates);
    },
    [updateFormData, setSelectedVille],
  );

  const handleOperateursChange = useCallback(
    (operateurs: UserOperator[]) => {
      updateFormData({ operateurs });
    },
    [updateFormData],
  );

  const handleSubmit = useCallback(async () => {
    if (loading || !isFormValid) return;

    setLoading(true);
    setError(null);

    try {
      const guichetData: Partial<Guichet> = {
        name: formData.name?.trim(),
        gare: formData.gare ? ({ id: formData.gare.id } as Gare) : undefined,
        koperative: formData.koperative!,
        operateurs: formData.operateurs?.map((op: UserOperator) => ({ id: op.id }) as UserOperator) ?? [],
        phones: formData.phones?.trim() ?? undefined,
        isActive: formData.isActive,
        openingHours: formData.openingHours?.trim() ?? undefined,
      };

      if (mode === 'edit' && initialData?.id) {
        await updateGuichet.mutateAsync({
          id: initialData.id,
          guichet: guichetData,
        });
      } else {
        await createGuichet.mutateAsync(guichetData);
      }

      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t(Labels.error_save_general));
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    isFormValid,
    formData,
    mode,
    initialData?.id,
    updateGuichet,
    createGuichet,
    onClose,
    setLoading,
    setError,
    t,
  ]);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
    }
  }, [loading, onClose]);

  // ===== RENDER =====
  let buttonLabel = t(Labels.button_create);
  if (loading) {
    buttonLabel = t(Labels.button_saving);
  } else if (mode === 'edit') {
    buttonLabel = t(Labels.button_edit);
  }
  const isEditing = mode === 'edit';
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      onOpen={() => {}}
      disableSwipeToOpen={false}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%' },
          height: 1,
          maxWidth: 800,
          margin: '0 auto',
          bgcolor: 'inherit',
        },
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 1,
          borderRadius: { xs: 0, sm: 2 },
        }}
      >
        <CardHeader
          avatar={<StyledIcon icon={StoreIcon} variant="secondary" />}
          title={
            <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
              {isEditing ? t(Labels.guichet_form_edit_title) : t(Labels.guichet_form_create_title)}
            </Typography>
          }
        />
        <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader
                  avatar={<StyledIcon icon={Info} variant="secondary" />}
                  title={<Typography variant="h6">{t(Labels.guichet_form_general_info)}</Typography>}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label={t(Labels.guichet_form_name_label)}
                        value={formData.name ?? ''}
                        onChange={handleInputChange('name')}
                        required
                        disabled={loading}
                        placeholder={t(Labels.guichet_form_name_placeholder)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label={t(Labels.guichet_form_phones_label)}
                        value={formData.phones ?? ''}
                        onChange={handleInputChange('phones')}
                        disabled={loading}
                        placeholder={t(Labels.guichet_form_phones_placeholder)}
                        helperText={t(Labels.guichet_form_phones_helper)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label={t(Labels.guichet_form_opening_hours_label)}
                        value={formData.openingHours ?? ''}
                        onChange={handleInputChange('openingHours')}
                        disabled={loading}
                        placeholder={t(Labels.guichet_form_opening_hours_placeholder)}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!formData.isActive}
                            onChange={handleSwitchChange('isActive')}
                            disabled={loading}
                          />
                        }
                        label={t(Labels.guichet_form_active_label)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Location Information */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader
                  avatar={<StyledIcon icon={LocationOn} variant="secondary" />}
                  title={<Typography variant="h6">{t(Labels.guichet_form_location_title)}</Typography>}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <VilleAutocomplete
                        id="guichet-form-ville"
                        value={selectedVille}
                        onChange={handleVilleChange}
                        label={t(Labels.guichet_form_city_label)}
                        required
                        disabled={loading}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <GareAutocomplete
                        id="guichet-form-gare"
                        value={selectedGare}
                        onChange={handleGareChange}
                        label={t(Labels.guichet_form_station_label)}
                        required
                        disabled={loading || !selectedVille}
                        options={filteredGares}
                        isLoading={garesLoading}
                        helperText={!selectedVille ? t(Labels.select_city_first) : ''}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            {/* Destinations - Only in edit mode */}
            {mode === 'edit' && initialData?.id && (
              <Grid size={{ xs: 12 }}>
                <GuichetDestinations
                  guichetId={initialData.id}
                  koperativeId={koperativeId}
                  currentGareId={formData.gare?.id}
                />
              </Grid>
            )}
            {/* Operator Information */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader
                  avatar={<StyledIcon icon={People} variant="secondary" />}
                  title={<Typography variant="h6">{t(Labels.guichet_form_operator_title)}</Typography>}
                />
                <CardContent>
                  <Autocomplete
                    multiple
                    options={operators}
                    getOptionLabel={option => {
                      const name = `${option.firstName} ${option.lastName}`.trim();
                      const contact = option.phone ?? option.email;
                      return name ? `${name} (${contact})` : contact;
                    }}
                    value={selectedOperateurs}
                    onChange={(_, value) => handleOperateursChange(value)}
                    disabled={loading || operatorsLoading}
                    loading={operatorsLoading}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={t(Labels.guichet_form_operators_select)}
                        helperText={t(Labels.guichet_form_operators_helper)}
                        slotProps={{
                          input: {
                            ...(params as any).InputProps,
                            endAdornment: (
                              <>
                                {operatorsLoading && <CircularProgress size={20} />}
                                {(params as any).InputProps?.endAdornment}
                              </>
                            ),
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        <Box>
                          <Typography variant="h6">
                            {option.firstName && option.lastName
                              ? `${option.firstName} ${option.lastName}`
                              : (option.phone ?? option.email)}
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            {option.phone ? (
                              <>
                                {option.phone}
                                {option.email && ` • ${option.email}`}
                              </>
                            ) : (
                              option.email
                            )}
                          </Typography>
                        </Box>
                      </li>
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
        <ProtectedTx>
          {loading && <LinearProgress />}
          <CardActions sx={{ gap: { xs: 2, md: 3 }, p: 3 }}>
            <ButtonTx
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
              startIcon={<CloseIcon />}
              sx={{ flex: 1 }}
              hideTextOnMobile
            >
              {t(Labels.button_cancel)}
            </ButtonTx>
            <ButtonTx
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !isFormValid}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{ flex: 1 }}
            >
              {buttonLabel}
            </ButtonTx>
          </CardActions>
        </ProtectedTx>
      </Card>
    </SwipeableDrawer>
  );
};

export default GuichetForm;
