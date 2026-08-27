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
import SaveIcon from '@mui/icons-material/Save';
import TrainIcon from '@mui/icons-material/Train';
import ButtonTx from '@/components/ui/ButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import ProtectedTx from '@/components/ProtectedTx';
import VilleAutocomplete from '@/components/shared/VilleAutocomplete';
import { useCreateGare, useUpdateGare } from '@/hooks/gare.hooks';
import { Gare } from '@/models/Gare';
import { Ville } from '@/models/Ville';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import useGareFormStore from '@/stores/gare-form.store';
import FormCloudinaryUploader from '@/components/inputs/FormCloudinaryUploader';

interface GareFormDrawerProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<Gare>;
}

const GareFormDrawer: React.FC<GareFormDrawerProps> = ({ open, onClose, initialData }) => {
  const { t } = useTranslation();

  // --- ZUSTAND STATE ---
  const { form, loading, error, updateForm, setLoading, setError, resetForm } = useGareFormStore();

  // --- HOOKS ---
  const createGare = useCreateGare();
  const updateGare = useUpdateGare();

  // --- EFFECTS ---
  useEffect(() => {
    resetForm(initialData);
  }, [initialData, open, resetForm]);

  // --- HANDLERS ---
  const handleInputChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({ [field]: event.target.value });
  };

  const handleSwitchChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({ [field]: event.target.checked });
  };

  const handleVilleChange = (ville: Ville | null) => {
    updateForm({ ville });
  };

  const handleSave = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const gareData: Partial<Gare> = {
        name: form.name.trim(),
        address: form.address.trim() || undefined,
        ville: form.ville?.id ? ({ id: form.ville.id } as Ville) : undefined,
        description: form.description.trim() || undefined,
        photos: form.photos ?? undefined,
        isClosed: form.isClosed,
      };

      if (typeof initialData?.id === 'number' && initialData.id > 0) {
        await updateGare.mutateAsync({ id: initialData.id, gare: gareData });
      } else {
        await createGare.mutateAsync(gareData);
      }

      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t(Labels.gare_form_save_error));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const isFormValid = form.name.trim() !== '' && form.ville;
  const isVilleDisabled = !!initialData?.id;

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
              <StyledIcon variant="secondary" icon={TrainIcon} />
              <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                {initialData?.id ? t(Labels.gare_form_edit_title) : t(Labels.gare_form_create_title)}
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
            <Grid size={12}>
              <VilleAutocomplete
                id="gare-form-ville"
                value={form.ville ?? null}
                onChange={handleVilleChange}
                label={t(Labels.gare_form_city_label)}
                required
                disabled={loading || isVilleDisabled}
              />
            </Grid>

            {/* 2. Nom de la gare (required) */}
            <Grid size={12}>
              <TextField
                fullWidth
                label={t(Labels.gare_form_name_label)}
                value={form.name ?? ''}
                onChange={handleInputChange('name')}
                required
                disabled={loading}
                placeholder={t(Labels.gare_form_name_placeholder)}
              />
            </Grid>

            {/* 3. Adresse */}
            <Grid size={12}>
              <TextField
                fullWidth
                label={t(Labels.gare_form_address_label)}
                value={form.address ?? ''}
                onChange={handleInputChange('address')}
                disabled={loading}
                placeholder={t(Labels.gare_form_address_placeholder)}
                multiline
                rows={2}
              />
            </Grid>

            {/* 4. Description */}
            <Grid size={12}>
              <TextField
                fullWidth
                label={t(Labels.gare_form_description_label)}
                value={form.description ?? ''}
                onChange={handleInputChange('description')}
                disabled={loading}
                placeholder={t(Labels.gare_form_description_placeholder)}
                multiline
                rows={3}
              />
            </Grid>

            {/* 4. Gare images */}
            <Grid size={12}>
              <FormCloudinaryUploader
                images={form.photos ?? []}
                onImagesChange={images => updateForm({ photos: images })}
                cloudinaryFolder="gares"
                disabled={loading}
                maxWidth={120}
                maxHeight={120}
                uploadLabel={t(Labels.upload_images) || 'upload images'}
                deleteLabel="delete photo"
                uploadingLabel={t(Labels.uploading_images_status) || 'uploading images'}
                errorLabel="error during upload"
                multiple={true}
              />
            </Grid>

            {/* 5. Fermeture */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch checked={form.isClosed} onChange={handleSwitchChange('isClosed')} disabled={loading} />
                }
                label={t(Labels.gare_form_closed_label)}
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

export default GareFormDrawer;
