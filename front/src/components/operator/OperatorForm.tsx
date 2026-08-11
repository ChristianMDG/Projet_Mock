import React, { useEffect } from 'react';
import {
  Alert,
  Autocomplete,
  AutocompleteRenderInputParams,
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
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonTx, StyledIcon } from '@/components/ui';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';
import ProtectedTx from '@/components/ProtectedTx';
import {
  Business,
  Close as CloseIcon,
  ContactPage,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useCreateOperator, useUpdateOperator } from '@/hooks/operator.hooks';
import { useUpdateUserAccount, useUserConnected } from '@/hooks/user.hooks';
import { useKoperativeGuichets, useKoperatives } from '@/hooks/koperative.hooks';
import { useCloudinaryUpload } from '@/hooks/cloudinary.hook';
import { useTranslation } from 'react-i18next';
import { Guichet, Koperative, UserOperator } from '@/types';
import { CinTypeEnum } from '@/models/enums';
import { normalizePhoneNumber, validatePhoneNumber } from '@/utils/phoneUtils';
import useOperatorFormStore from '@/stores/operator-form.store';
import { useAuth } from '@/context/AuthContext';
import Labels from '@/labelKeys.json';

// Helper function to get translated ID type labels
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

interface OperatorFormProps {
  initialData?: Partial<UserOperator>;
  onClose?: () => void;
  editKoperative?: boolean;
}

const OperatorForm: React.FC<OperatorFormProps> = ({ initialData, onClose, editKoperative = true }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { form, error, updateForm, setError, resetForm } = useOperatorFormStore();
  const createOperator = useCreateOperator();
  const updateOperator = useUpdateOperator();
  const updateUserAccount = useUpdateUserAccount();
  const currentUserInfo = useUserConnected({ editKoperative });

  const { data: koperatives = [], isLoading: koperativesLoading } = useKoperatives();
  const { data: guichets = [], isLoading: guichetsLoading } = useKoperativeGuichets(form.koperative?.id ?? 0);
  const { upload: uploadPhoto } = useCloudinaryUpload('operators');

  useEffect(() => {
    resetForm(initialData);
    setError(null);
  }, [initialData, resetForm, setError]);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    updateForm({ [field]: value });
  };

  const handleKoperativeChange = (koperative: Koperative | null) => {
    updateForm({ koperative, guichets: [] });
  };

  const handleGuichetsChange = (guichets: Guichet[]) => updateForm({ guichets });

  const handlePhotoUpload = async (file: File) => {
    try {
      const result = await uploadPhoto(file);
      if (result) {
        updateForm({ photo: { url: result.url, publicId: result.public_id ?? '' } });
      }
    } catch (error) {
      console.error('Photo upload error:', error);
    }
  };

  const loading = createOperator.isPending || updateOperator.isPending || updateUserAccount.isPending;
  const isEditing = Boolean(initialData?.id);
  const koperativePreFilled = Boolean(initialData?.koperative);
  const isFormValid = form.firstName.trim() && form.lastName.trim() && form.idNumber.trim();

  // Determine if this is a user account update (when editKoperative is false and editing current user)
  const isUserAccountUpdate = !editKoperative && isEditing && user && user.id === initialData?.id;

  const validatePhoneInput = (): string | null => {
    const phoneRaw = form.phone.trim();
    const { isValid, message } = validatePhoneNumber(phoneRaw, true);
    if (!isValid) {
      setError(message ?? t(Labels.error_invalid_madagascar_phone));
      return null;
    }
    return normalizePhoneNumber(phoneRaw) ?? phoneRaw;
  };

  const buildOperatorData = (normalizedPhone: string): Partial<UserOperator> => ({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim() || undefined,
    phone: normalizedPhone,
    username: normalizedPhone,
    address: form.address.trim() || undefined,
    idNumber: form.idNumber.trim() || undefined,
    idType: form.idType,
    password: form.password ?? undefined,
    photo: form.photo ?? undefined,
    koperative: { id: form.koperative?.id ?? undefined },
    guichets:
      form.guichets?.map(
        (guichet: Guichet) =>
          ({
            id: guichet.id,
          }) as Guichet,
      ) ?? [],
    isActive: form.isActive,
    withKoperative: editKoperative,
  });

  const executeUpdate = async (operatorData: Partial<UserOperator>) => {
    if (!initialData?.id) return;

    if (isUserAccountUpdate) {
      const result = await updateUserAccount.mutateAsync({
        id: initialData.id,
        accountData: operatorData,
      });
      if (result === 'success_user_created') {
        setError(t(Labels.operator_profile_updated_success));
      }
    } else {
      await updateOperator.mutateAsync({
        id: initialData.id,
        operator: operatorData,
      });
    }

    if (initialData.id && user && user?.id === initialData.id) {
      await currentUserInfo.refetch();
    }
  };

  const handleSave = async () => {
    if (loading) return;

    const normalizedPhone = validatePhoneInput();
    if (!normalizedPhone) return;

    setError(null);
    const operatorData = buildOperatorData(normalizedPhone);

    try {
      if (isEditing && initialData?.id) {
        await executeUpdate(operatorData);
      } else {
        await createOperator.mutateAsync(operatorData);
      }
      if (onClose) handleClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t(Labels.operator_form_error_save));
    }
  };

  const handleClose = () => {
    if (!loading && onClose) onClose();
  };

  const getSaveButtonText = () => {
    if (loading) return t(Labels.button_saving);
    if (isEditing) return t(Labels.button_update);
    return t(Labels.button_save);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 1,
        borderRadius: { xs: 0, sm: 2 },
      }}
    >
      <CardHeader
        avatar={<StyledIcon icon={PersonIcon} variant="secondary" />}
        title={
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            {isEditing ? `${form.firstName} ${form.lastName}` : t(Labels.operator_form_create_title)}
          </Typography>
        }
        subheader={
          isEditing && (
            <Typography variant="body2" color="text.secondary">
              {form.phone}
            </Typography>
          )
        }
      />
      <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
        {error && (
          <Alert
            severity={error.startsWith(t(Labels.operator_profile_updated_success)) ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}
        <Card sx={{ mb: 2 }}>
          <CardHeader
            avatar={<StyledIcon icon={ContactPage} variant="secondary" />}
            title={
              <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                {t(Labels.operator_form_personal_info)}
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t(Labels.operator_form_idnumber_label)}
                  value={form.idNumber ?? ''}
                  onChange={handleChange('idNumber')}
                  required
                  disabled={loading}
                  placeholder={t(Labels.operator_form_idnumber_placeholder)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel>{t(Labels.operator_form_idtype_label)}</InputLabel>
                  <Select
                    value={form.idType ?? CinTypeEnum.NATIONAL_ID}
                    onChange={e => updateForm({ idType: e.target.value as CinTypeEnum })}
                    label={t(Labels.operator_form_idtype_label)}
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
                  label={t(Labels.operator_form_firstname_label)}
                  value={form.firstName ?? ''}
                  onChange={handleChange('firstName')}
                  required
                  disabled={loading}
                  placeholder={t(Labels.operator_form_firstname_placeholder)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t(Labels.operator_form_lastname_label)}
                  value={form.lastName ?? ''}
                  onChange={handleChange('lastName')}
                  required
                  placeholder={t(Labels.operator_form_lastname_placeholder)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t(Labels.operator_form_phone_label)}
                  value={form.phone ?? ''}
                  onChange={handleChange('phone')}
                  disabled={loading}
                  placeholder={t(Labels.operator_form_phone_placeholder)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t(Labels.operator_form_email_label)}
                  type="email"
                  value={form.email ?? ''}
                  onChange={handleChange('email')}
                  disabled={loading}
                  placeholder={t(Labels.operator_form_email_placeholder)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label={t(Labels.authform_password)}
                  type="password"
                  value={form.password ?? ''}
                  onChange={handleChange('password')}
                  disabled={loading}
                  placeholder={t(Labels.authform_password)}
                  autoComplete="new-password"
                  required={!isEditing}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label={t(Labels.operator_form_address_label)}
                  value={form.address ?? ''}
                  onChange={handleChange('address')}
                  disabled={loading}
                  placeholder={t(Labels.operator_form_address_placeholder)}
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
                      {t(Labels.operator_form_photo_label)}
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCameraIcon />}
                      disabled={loading}
                      size="small"
                    >
                      {t(Labels.operator_form_photo_button)}
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
                      {t(Labels.operator_form_photo_helper)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {editKoperative && (
          <Card sx={{ mb: 2 }}>
            <CardHeader
              avatar={<StyledIcon icon={Business} variant="secondary" />}
              title={
                <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                  {t(Labels.operator_form_professional_info)}
                </Typography>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <KoperativeAutocomplete
                    value={form.koperative ?? null}
                    onChange={val => handleKoperativeChange(val as Koperative | null)}
                    label={t(Labels.operator_form_koperative_label)}
                    options={koperatives}
                    isLoading={koperativesLoading}
                    disabled={loading || koperativesLoading || koperativePreFilled}
                    readOnly={koperativePreFilled}
                  />
                </Grid>
                <Grid size={12}>
                  <Autocomplete
                    multiple
                    options={guichets}
                    getOptionLabel={(option: Guichet) => {
                      const gareName = option.gare?.name ?? t(Labels.operator_form_guichets_gare_fallback);
                      const villeInfo = option.gare?.ville?.name ? ` (${option.gare.ville.name})` : '';
                      return `${option.name} - ${gareName}${villeInfo}`;
                    }}
                    value={form.guichets ?? []}
                    onChange={(_, value: Guichet[]) => handleGuichetsChange(value)}
                    loading={guichetsLoading}
                    disabled={loading || guichetsLoading || !form.koperative}
                    isOptionEqualToValue={(option: Guichet, value: Guichet) => option.id === value.id}
                    noOptionsText={guichetsLoading ? t(Labels.loading) : t(Labels.ui_gare_no_available)}
                    autoHighlight
                    clearOnEscape
                    slots={{ listbox: MenuList }}
                    slotProps={{
                      paper: {
                        elevation: 6,
                        sx: { marginTop: 0.5, borderRadius: 4 },
                      },
                    }}
                    renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: Guichet) => (
                      <MenuItem {...props} key={option.id}>
                        <ListItemIcon>
                          <StyledIcon icon={Business} />
                        </ListItemIcon>
                        <ListItemText
                          primary={option.name}
                          secondary={
                            option.gare
                              ? `${option.gare.name}${option.gare.ville?.name ? ` - ${option.gare.ville.name}` : ''}`
                              : t(Labels.operator_form_guichets_gare_fallback)
                          }
                        />
                      </MenuItem>
                    )}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextField
                        {...params}
                        label={t(Labels.operator_form_guichets_label)}
                        helperText={
                          !form.koperative
                            ? t(Labels.operator_form_guichets_no_koperative)
                            : t(Labels.operator_form_guichets_helper)
                        }
                        slotProps={{
                          ...params.slotProps,
                          input: {
                            ...params.slotProps.input,
                            endAdornment: (
                              <>
                                {guichetsLoading && <CircularProgress color="inherit" size={20} />}
                                {params.slotProps.input.endAdornment}
                              </>
                            ),
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <FormControlLabel
                    control={<Switch checked={form.isActive} onChange={handleChange('isActive')} disabled={loading} />}
                    label={
                      <Box>
                        <Typography variant="body1">{t(Labels.operator_form_active_label)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {form.isActive
                            ? t(Labels.operator_form_active_description_yes)
                            : t(Labels.operator_form_active_description_no)}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
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
            onClick={handleSave}
            variant="contained"
            disabled={loading || !isFormValid}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ flex: 1 }}
          >
            {getSaveButtonText()}
          </ButtonTx>
        </CardActions>
      </ProtectedTx>
    </Card>
  );
};

export default OperatorForm;
