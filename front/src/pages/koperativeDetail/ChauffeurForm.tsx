import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SwipeableDrawer,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ButtonTx, StyledIcon } from '@/components/ui';
import ProtectedTx from '@/components/ProtectedTx';
import {
  Business as BusinessIcon,
  Close as CloseIcon,
  ContactPage as ContactPageIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  SportsMotorsports as ChauffeurIcon,
} from '@mui/icons-material';
import { useCreateChauffeur, useUpdateChauffeur } from '@/hooks/chauffeur.hooks';
import { useCloudinaryUpload } from '@/hooks/cloudinary.hook';
import { Chauffeur } from '@/types';
import { CinTypeEnum } from '@/models/enums';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { PhoneInput } from '@/components/shared';
import dayjs, { Dayjs } from 'dayjs';

const getIdTypeLabel = (type: CinTypeEnum, t: (key: string) => string): string => {
  switch (type) {
    case CinTypeEnum.NATIONAL_ID:
      return t(Labels.id_type_national_id);
    case CinTypeEnum.PASSPORT:
      return t(Labels.id_type_passport);
    case CinTypeEnum.DRIVING_LICENSE:
      return t(Labels.id_type_driving_license);
    case CinTypeEnum.OTHER:
      return t(Labels.id_type_other);
    default:
      return type;
  }
};

interface ChauffeurFormProps {
  open: boolean;
  onClose: () => void;
  koperativeId: number;
  initialData?: Partial<Chauffeur>;
  mode: 'create' | 'edit';
}

const getInitialFormData = (initialData?: Partial<Chauffeur>, koperativeId?: number) => ({
  firstName: initialData?.user?.firstName ?? '',
  lastName: initialData?.user?.lastName ?? '',
  phone: initialData?.user?.phone ?? '',
  email: initialData?.user?.email ?? '',
  address: initialData?.user?.address ?? '',
  idNumber: initialData?.user?.idNumber ?? '',
  idType: initialData?.user?.idType ?? CinTypeEnum.NATIONAL_ID,
  photo: initialData?.photo ?? null,
  licenseNumber: initialData?.licenseNumber ?? '',
  licenseAuthority: initialData?.licenseAuthority ?? '',
  licenseExpiry: initialData?.licenseExpiry ? dayjs(initialData.licenseExpiry) : null,
  isAvailable: initialData?.isAvailable ?? true,
  isActive: initialData?.user?.isActive ?? true,
  koperativeId: initialData?.koperativeId ?? koperativeId ?? undefined,
});

const ChauffeurForm: React.FC<ChauffeurFormProps> = ({ open, onClose, koperativeId, initialData, mode }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState(() => getInitialFormData(initialData, koperativeId));
  const [error, setError] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const createChauffeur = useCreateChauffeur(koperativeId);
  const updateChauffeur = useUpdateChauffeur(koperativeId);
  const { upload: uploadPhoto } = useCloudinaryUpload('chauffeurs');

  useEffect(() => {
    const newFormData = getInitialFormData(initialData, koperativeId);
    setForm(newFormData);
    setError(null);
  }, [initialData, open, koperativeId]);

  const isCreateMode = useMemo(() => mode === 'create', [mode]);
  const isEditMode = useMemo(() => mode === 'edit', [mode]);
  const loading = useMemo(
    () => createChauffeur.isPending || updateChauffeur.isPending,
    [createChauffeur.isPending, updateChauffeur.isPending],
  );

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

  const handleLicenseExpiryChange = useCallback((newValue: Dayjs | null) => {
    // Interpret the picked date as Indian/Antananarivo date
    const tzValue = newValue ? newValue.tz('Indian/Antananarivo', true) : null;
    setForm(prev => ({ ...prev, licenseExpiry: tzValue }));
  }, []);

  const handlePhotoUpload = useCallback(
    async (file: File) => {
      setPhotoUploading(true);
      try {
        const result = await uploadPhoto(file);
        if (result) {
          setForm(prev => ({
            ...prev,
            photo: {
              url: result.url,
              publicId: result.public_id ?? '',
            },
          }));
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(t(Labels.error_save_general) || 'Photo upload failed');
        }
      } finally {
        setPhotoUploading(false);
      }
    },
    [uploadPhoto, t],
  );

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    try {
      setError(null);
      if (form.photo && (!form.photo.url || form.photo.url.trim() === '')) {
        setError(t(Labels.error_save_general) || 'Invalid photo data. Please re-upload the photo.');
        return;
      }
      const isEdit = isEditMode && initialData?.id;
      const chauffeurData = {
        user: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || `${form.firstName?.toLowerCase()}.${form.lastName?.toLowerCase()}@taxibrousse.mg`,
          address: form.address.trim() ?? undefined,
          idNumber: form.idNumber.trim() ?? undefined,
          idType: form.idType,
          username: form.phone.trim(),
          isActive: form.isActive,
          isAdmin: false,
          id: initialData?.user?.id,
        },
        licenseNumber: form.licenseNumber.trim(),
        licenseAuthority: form.licenseAuthority.trim() ?? undefined,
        licenseExpiry: form.licenseExpiry?.tz('Indian/Antananarivo', true).format('YYYY-MM-DD') ?? undefined,
        photo: form.photo ?? undefined,
        isAvailable: form.isAvailable,
        koperativeId: form.koperativeId ?? koperativeId,
        id: initialData?.id,
      };
      if (isCreateMode) {
        await createChauffeur.mutateAsync(chauffeurData);
      } else if (isEdit && initialData?.id) {
        await updateChauffeur.mutateAsync({
          id: initialData.id,
          chauffeur: chauffeurData,
        });
      }
      onClose();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t(Labels.error_save_general));
    }
  }, [
    form,
    isCreateMode,
    isEditMode,
    initialData?.id,
    initialData?.user?.id,
    koperativeId,
    createChauffeur,
    updateChauffeur,
    onClose,
    t,
    loading,
  ]);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
    }
  }, [loading, onClose]);

  const isFormValid = useMemo(() => {
    return !!(form.firstName?.trim() && form.lastName?.trim() && form.phone?.trim() && form.licenseNumber?.trim());
  }, [form]);

  const isEditing = Boolean(initialData?.id);

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
          maxWidth: 600,
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
          avatar={<StyledIcon icon={ChauffeurIcon} variant="secondary" />}
          title={
            <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
              {isCreateMode ? t(Labels.chauffeur_form_create_title) : t(Labels.chauffeur_form_edit_title)}
            </Typography>
          }
        />
        <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Card sx={{ mb: 2 }}>
            <CardHeader
              avatar={<StyledIcon icon={ContactPageIcon} variant="secondary" />}
              title={
                <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                  {t(Labels.chauffeur_form_personal_info)}
                </Typography>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t(Labels.chauffeur_form_idnumber_label)}
                    value={form.idNumber ?? ''}
                    onChange={handleInputChange('idNumber')}
                    disabled={loading}
                    placeholder={t(Labels.chauffeur_form_idnumber_placeholder)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth disabled={loading}>
                    <InputLabel>{t(Labels.chauffeur_form_idtype_label)}</InputLabel>
                    <Select
                      value={form.idType ?? CinTypeEnum.NATIONAL_ID}
                      onChange={e => setForm(prev => ({ ...prev, idType: e.target.value as CinTypeEnum }))}
                      label={t(Labels.chauffeur_form_idtype_label)}
                    >
                      {Object.values(CinTypeEnum).map(type => (
                        <MenuItem key={type} value={type}>
                          {getIdTypeLabel(type, t)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t(Labels.chauffeur_form_firstname_label)}
                    placeholder={t(Labels.chauffeur_form_firstname_placeholder)}
                    value={form.firstName ?? ''}
                    onChange={handleInputChange('firstName')}
                    disabled={loading}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t(Labels.chauffeur_form_lastname_label)}
                    placeholder={t(Labels.chauffeur_form_lastname_placeholder)}
                    value={form.lastName ?? ''}
                    onChange={handleInputChange('lastName')}
                    disabled={loading}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={t(Labels.chauffeur_form_email_label)}
                    type="email"
                    value={form.email ?? ''}
                    onChange={handleInputChange('email')}
                    disabled={loading}
                    placeholder={t(Labels.chauffeur_form_email_placeholder)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <PhoneInput
                    fullWidth
                    label={t(Labels.chauffeur_form_phone_label)}
                    value={form.phone ?? ''}
                    onChange={value => setForm(prev => ({ ...prev, phone: value }))}
                    disabled={loading}
                    required
                    storageFormat={true}
                    showOperator={true}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label={t(Labels.chauffeur_form_address_label)}
                    value={form.address ?? ''}
                    onChange={handleInputChange('address')}
                    disabled={loading}
                    placeholder={t(Labels.chauffeur_form_address_placeholder)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={form.photo?.url}
                      alt={`${form.firstName} ${form.lastName}`}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {t(Labels.chauffeur_form_photo_label)}
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={photoUploading ? <CircularProgress size={20} /> : <PhotoCameraIcon />}
                        disabled={loading || photoUploading}
                        size="small"
                      >
                        {photoUploading
                          ? t(Labels.button_saving) || 'Uploading...'
                          : t(Labels.chauffeur_form_photo_button)}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handlePhotoUpload(file);
                            }
                          }}
                        />
                      </Button>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {t(Labels.chauffeur_form_photo_helper)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card sx={{ mb: 2 }}>
            <CardHeader
              avatar={<StyledIcon icon={BusinessIcon} variant="secondary" />}
              title={
                <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                  {t(Labels.chauffeur_form_professional_info)}
                </Typography>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label={t(Labels.chauffeur_form_license_label)}
                    placeholder={t(Labels.chauffeur_form_license_placeholder)}
                    value={form.licenseNumber ?? ''}
                    onChange={handleInputChange('licenseNumber')}
                    disabled={loading}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={t(Labels.chauffeur_form_license_authority_label)}
                    placeholder={t(Labels.chauffeur_form_license_authority_placeholder)}
                    value={form.licenseAuthority ?? ''}
                    onChange={handleInputChange('licenseAuthority')}
                    disabled={loading}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DatePicker
                    label={t(Labels.chauffeur_form_license_expiry_label)}
                    value={form.licenseExpiry}
                    onChange={handleLicenseExpiryChange}
                    disabled={loading}
                    timezone="Indian/Antananarivo"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <Box
                    sx={{
                      borderTop: 1,
                      borderColor: 'divider',
                      pt: 2,
                      mt: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Status Settings
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={form.isAvailable ?? true}
                              onChange={handleSwitchChange('isAvailable')}
                              disabled={loading}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {t(Labels.chauffeur_form_available_label)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {form.isAvailable
                                  ? t(Labels.chauffeur_form_available_description_yes)
                                  : t(Labels.chauffeur_form_available_description_no)}
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={form.isActive ?? true}
                              onChange={handleSwitchChange('isActive')}
                              disabled={loading}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {t(Labels.chauffeur_form_active_label)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {form.isActive
                                  ? t(Labels.chauffeur_form_active_description_yes)
                                  : t(Labels.chauffeur_form_active_description_no)}
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
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
            {(() => {
              let buttonLabel;
              if (loading) {
                buttonLabel = t(Labels.button_saving);
              } else if (isEditing) {
                buttonLabel = t(Labels.button_update);
              } else {
                buttonLabel = t(Labels.button_save);
              }
              return (
                <ButtonTx
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={loading || !isFormValid}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{ flex: 1 }}
                >
                  {buttonLabel}
                </ButtonTx>
              );
            })()}
          </CardActions>
        </ProtectedTx>
      </Card>
    </SwipeableDrawer>
  );
};

export default ChauffeurForm;
