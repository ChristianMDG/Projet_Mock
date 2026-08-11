import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  Radio,
  RadioGroup,
  SwipeableDrawer,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ButtonTx, StyledIcon } from '@/components/ui';
import ProtectedTx from '@/components/ProtectedTx';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import { Crafter } from '@/models/Crafter';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useCloudinaryUpload } from '@/hooks/cloudinary.hook';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Box } from '@mui/system';
import { useKoperative } from '@/hooks/koperative.hooks';
import { SeatGrid } from '@/components/seats/SeatGrid';
import { DEFAULT_CONFIG_NAME, DEFAULT_SEAT_CAPACITY, getSeatCapacity } from '@/utils/seat.utils';
import dayjs, { Dayjs } from 'dayjs';
import { SeatConfig } from '@/types/type.props';
import { VehicleIcon as CrafterIcon } from '@/components/shared';

interface CrafterFormProps {
  open: boolean;
  koperativeId: number;
  initialData?: Partial<Crafter>;
  mode: 'create' | 'edit';
  loading?: boolean;
  error?: string | null;

  onClose: () => void;
  onSubmit: (crafter: Partial<Crafter>) => Promise<void>;
}

const getInitialFormData = (initialData?: Partial<Crafter>) => {
  return {
    registrationNumber: initialData?.registrationNumber ?? '',
    model: initialData?.model ?? '',
    kilometrage: initialData?.kilometrage ?? 0,
    isActive: initialData?.isActive ?? true,
    dateVisite: initialData?.dateVisite ? dayjs(initialData.dateVisite) : null,
    photo: initialData?.photo ?? undefined,
    seatCapacity: initialData?.seatCapacity ?? DEFAULT_SEAT_CAPACITY,
    configName: initialData?.configName ?? DEFAULT_CONFIG_NAME,
  };
};

const CrafterForm: React.FC<CrafterFormProps> = ({
  open,
  onClose,
  koperativeId,
  initialData,
  mode,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const { t } = useTranslation();
  const { upload: uploadPhoto } = useCloudinaryUpload('crafters');
  const { data: koperative } = useKoperative(koperativeId);

  const [form, setForm] = useState(() => getInitialFormData(initialData));
  const [photoUploading, setPhotoUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setForm(getInitialFormData(initialData));
    setFormError(null);
  }, [initialData, open]);

  const isCreateMode = useMemo(() => mode === 'create', [mode]);
  const isEditMode = useMemo(() => mode === 'edit', [mode]);

  const handleInputChange = useCallback(
    (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }));
    },
    [],
  );

  const handleSwitchChange = useCallback(
    (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.checked }));
    },
    [],
  );

  const handleDateChange = useCallback((newValue: Dayjs | null) => {
    // Interpret the picked date as Indian/Antananarivo date
    const tzValue = newValue ? newValue.tz('Indian/Antananarivo', true) : null;
    setForm(prev => ({ ...prev, dateVisite: tzValue }));
  }, []);

  const handleConfigChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const configName = event.target.value;
    const seatCapacity = getSeatCapacity(configName);
    setForm(prev => ({ ...prev, configName, seatCapacity }));
  }, []);

  const getSeatStatus = useCallback(() => 'available' as const, []);
  const handleSeatClick = useCallback((_seatConfig: SeatConfig) => {}, []);

  const previewCrafter = useMemo(
    () =>
      ({
        id: 0,
        seatCapacity: form.seatCapacity,
        configName: form.configName,
      }) as Crafter,
    [form.seatCapacity, form.configName],
  );

  const handlePhotoUpload = async (file: File) => {
    setPhotoUploading(true);
    try {
      const result = await uploadPhoto(file);
      if (result) {
        setForm(prev => ({ ...prev, photo: { url: result.url, publicId: result.public_id ?? '' } }));
      }
    } finally {
      setPhotoUploading(false);
    }
  };

  const isFormValid = useMemo(() => {
    return !!(form.registrationNumber?.trim() && form.seatCapacity && form.model?.trim());
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    setFormError(null);

    try {
      if (form.photo && (!form.photo.url || form.photo.url.trim() === '')) {
        setFormError(t(Labels.error_save_general));
        return;
      }

      await onSubmit({
        ...form,
        dateVisite: form.dateVisite ? form.dateVisite.tz('Indian/Antananarivo', true).format('YYYY-MM-DD') : undefined,
        koperative: koperative ? { id: koperative.id } : undefined,
      });
      onClose();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : t(Labels.error_save_general));
    }
  }, [form, onSubmit, onClose, loading, t, koperative]);

  const getSubmitButtonText = useCallback(() => {
    if (loading) return t(Labels.button_saving);
    return isEditMode ? t(Labels.button_update) : t(Labels.button_create);
  }, [loading, isEditMode, t]);

  const handleClose = useCallback(() => {
    if (!loading) onClose();
  }, [loading, onClose]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      onOpen={() => {}}
      disableSwipeToOpen={false}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: { xs: '100%', sm: '100%', md: '600px', lg: '700px' },
          height: { xs: '100%', sm: 'auto' },
          maxHeight: { xs: '100%', sm: '95vh' },
          margin: { xs: 0, sm: '0 auto' },
          bgcolor: 'inherit',
          borderRadius: { xs: 0, sm: '16px 16px 0 0' },
        },
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: { xs: '100vh', sm: 'auto' },
          borderRadius: { xs: 0, sm: 2 },
          overflow: 'hidden',
        }}
      >
        <CardHeader
          avatar={<StyledIcon icon={CrafterIcon} variant="secondary" />}
          title={
            <Typography variant="h4">
              {isCreateMode ? t(Labels.crafter_form_create_title) : t(Labels.crafter_form_edit_title)}
            </Typography>
          }
        />
        <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          {(formError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError ?? error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label={t(Labels.crafter_registration_number)}
                value={form.registrationNumber}
                onChange={handleInputChange('registrationNumber')}
                disabled={loading}
                placeholder="ABC-123-DEF"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label={t(Labels.crafter_model)}
                value={form.model}
                onChange={handleInputChange('model')}
                disabled={loading}
                placeholder={t(Labels.crafter_form_model_placeholder)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label={t(Labels.crafter_seat_capacity)}
                value={form.seatCapacity}
                onChange={handleInputChange('seatCapacity')}
                disabled={loading}
                helperText={t(Labels.crafter_form_seat_capacity_helper)}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label={t(Labels.crafter_kilometrage)}
                value={form.kilometrage}
                onChange={handleInputChange('kilometrage')}
                disabled={loading}
                slotProps={{ htmlInput: { min: 0 } }}
                helperText={t(Labels.crafter_form_kilometrage_helper)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label={t(Labels.crafter_date_visite)}
                value={form.dateVisite}
                onChange={handleDateChange}
                disabled={loading}
                timezone="Indian/Antananarivo"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText: t(Labels.crafter_form_date_visite_helper),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  minHeight: 56,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive ?? true}
                      onChange={handleSwitchChange('isActive')}
                      disabled={loading}
                    />
                  }
                  label={t(Labels.crafter_is_active)}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label={t(Labels.crafter_koperative)}
                value={koperative?.name ?? ''}
                disabled
                helperText={t(Labels.crafter_form_koperative_helper)}
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ButtonTx
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCameraIcon />}
                  disabled={loading || photoUploading}
                  sx={{
                    alignSelf: 'flex-start',
                  }}
                >
                  {photoUploading ? t(Labels.crafter_form_photo_uploading) : t(Labels.crafter_form_upload_photo)}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) await handlePhotoUpload(file);
                    }}
                  />
                </ButtonTx>
                {form.photo?.url && (
                  <Box
                    component="img"
                    src={form.photo.url}
                    alt="Crafter"
                    sx={{
                      width: '100%',
                      maxWidth: { xs: '100%', sm: 400 },
                      height: 'auto',
                      aspectRatio: '16/9',
                      borderRadius: 2,
                      objectFit: 'cover',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 1,
                    }}
                  />
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }} offset={{ sm: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t(Labels.crafter_seat_configuration_title)}
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <RadioGroup value={form.configName} onChange={handleConfigChange} row sx={{ mt: 1 }}>
                  <FormControlLabel
                    value="10places.json"
                    control={<Radio />}
                    label={t(Labels.crafter_seat_configuration_12_places)}
                    disabled={loading}
                  />
                  <FormControlLabel
                    value="18places.json"
                    control={<Radio />}
                    label={t(Labels.crafter_seat_configuration_20_places)}
                    disabled={loading}
                  />
                  <FormControlLabel
                    value="22places.json"
                    control={<Radio />}
                    label={t(Labels.crafter_seat_configuration_22_places)}
                    disabled={loading}
                  />
                </RadioGroup>
              </FormControl>
              <SeatGrid crafter={previewCrafter} getSeatStatus={getSeatStatus} onSeatClick={handleSeatClick} readonly />
            </Grid>
          </Grid>
        </CardContent>
        <ProtectedTx>
          {loading && <LinearProgress />}
          <CardActions sx={{ gap: 2, p: 2 }}>
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
              {getSubmitButtonText()}
            </ButtonTx>
          </CardActions>
        </ProtectedTx>
      </Card>
    </SwipeableDrawer>
  );
};

export default CrafterForm;
