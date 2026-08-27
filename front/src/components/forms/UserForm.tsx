import React, { useEffect } from 'react';
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
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import ButtonTx from '@/components/ui/ButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import { useUpdateUserAccount, useUserConnected } from '@/hooks/user.hooks';
import { useCloudinaryUpload } from '@/hooks/cloudinary.hook';
import { useTranslation } from 'react-i18next';
import { UserOperator } from '@/types';
import { CinTypeEnum } from '@/models/enums';
import { normalizePhoneNumber, validatePhoneNumber } from '@/utils/phoneUtils';
import { useAuth } from '@/context/AuthContext';
import Labels from '@/labelKeys.json';
import useUserFormStore from '@/stores/user-form.store';

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

interface UserFormProps {
  initialData?: Partial<UserOperator>;
  onClose?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onClose }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { form, error, updateForm, setError, resetForm } = useUserFormStore();
  const updateUserAccount = useUpdateUserAccount();
  const currentUserInfo = useUserConnected({ editKoperative: false });

  const { upload: uploadPhoto } = useCloudinaryUpload('users');

  useEffect(() => {
    resetForm(initialData);
    setError(null);
  }, [initialData, resetForm, setError]);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    updateForm({ [field]: value });
  };

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

  const loading = updateUserAccount.isPending;
  const isEditing = Boolean(initialData?.id);
  const isFormValid = form.firstName?.trim() && form.lastName?.trim();

  const validatePhoneInput = (): string | null => {
    const phoneRaw = form.phone?.trim() ?? '';
    const { isValid, message } = validatePhoneNumber(phoneRaw, true);
    if (!isValid) {
      setError(message ?? t(Labels.error_invalid_madagascar_phone));
      return null;
    }
    return normalizePhoneNumber(phoneRaw) ?? phoneRaw;
  };

  const buildUserData = (normalizedPhone: string): Partial<UserOperator> => ({
    firstName: form.firstName?.trim(),
    lastName: form.lastName?.trim(),
    email: form.email?.trim() || undefined,
    phone: normalizedPhone,
    username: normalizedPhone,
    address: form.address?.trim() || undefined,
    idNumber: form.idNumber?.trim() || undefined,
    idType: form.idType,
    password: form.password ?? undefined,
    photo: form.photo ?? undefined,
    isActive: form.isActive,
  });

  const executeUpdate = async (userData: Partial<UserOperator>) => {
    if (!initialData?.id) return;

    const result = await updateUserAccount.mutateAsync({
      id: initialData.id,
      accountData: userData,
    });

    if (result === 'success_user_created') {
      setError(t(Labels.operator_profile_updated_success));
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
    const userData = buildUserData(normalizedPhone);

    try {
      if (isEditing && initialData?.id) {
        await executeUpdate(userData);
      }
      if (onClose) handleClose();
    } catch (e: unknown) {
      const raw = e instanceof Error ? e.message : t(Labels.operator_form_error_save);
      setError(raw.startsWith('error_') ? t(raw) : raw);
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
    <Card sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
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
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t(Labels.operator_form_idnumber_label)}
              value={form.idNumber ?? ''}
              onChange={handleChange('idNumber')}
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
              disabled={loading}
              placeholder={t(Labels.operator_form_lastname_placeholder)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t(Labels.operator_form_phone_label)}
              value={form.phone ?? ''}
              onChange={handleChange('phone')}
              required
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
              <Avatar src={form.photo?.url} alt={`${form.firstName} ${form.lastName}`} sx={{ width: 80, height: 80 }} />
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
      <Box>
        {loading && <LinearProgress />}
        <CardActions sx={{ gap: { xs: 2, md: 3 }, p: 3 }}>
          <ButtonTx
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            startIcon={<CloseIcon />}
            sx={{ flex: 1 }}
            hideTextOnMobile
            isProtected={false}
          >
            {t(Labels.button_cancel)}
          </ButtonTx>
          <ButtonTx
            onClick={handleSave}
            variant="contained"
            disabled={loading || !isFormValid}
            isProtected={false}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ flex: 1 }}
          >
            {getSaveButtonText()}
          </ButtonTx>
        </CardActions>
      </Box>
    </Card>
  );
};

export default UserForm;
