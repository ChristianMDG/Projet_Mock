import React from 'react';
import { useFormikContext } from 'formik';
import Labels from '@/labelKeys.json';
import { FormTextField } from '@/components/inputs';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import ColisSchedulerCardTitle from './ColisSchedulerCardTitle';
import { Crafter } from '@/types';

interface ColisSchedulerFormProps {
  crafters: Crafter[];
  isEditMode: boolean;
  isLoading: boolean;
  currentError: Error | null;
  onClose: () => void;
  onSave?: () => void;
}

const ColisSchedulerForm: React.FC<ColisSchedulerFormProps> = ({
  crafters,
  isEditMode,
  isLoading,
  currentError,
  onClose,
}) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<{ crafterId: number | string; status: string; type: string }>();

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: { xs: '100vh', sm: 'auto' },
        maxHeight: { xs: '100vh', sm: '95vh' },
        borderRadius: { xs: 0, sm: 2 },
        overflow: 'hidden',
      }}
    >
      <CardHeader title={<ColisSchedulerCardTitle isEditMode={isEditMode} />} sx={{ pb: { xs: 1, sm: 2 } }} />

      <CardContent sx={{ flexGrow: 1, overflow: 'auto', px: { xs: 2, sm: 3 } }}>
        {currentError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {currentError.message}
          </Alert>
        )}
        <Card sx={{ mb: 2 }}>
          <CardHeader title={t(Labels.colis_form_sender_info)} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField name="senderName" label={t(Labels.colis_form_sender_name_label)} fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField name="senderPhone" label={t(Labels.colis_form_sender_phone_label)} fullWidth required />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardHeader title={t(Labels.colis_form_recipient_info)} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField
                  name="recipientName"
                  label={t(Labels.colis_form_recipient_name_label)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField
                  name="recipientPhone"
                  label={t(Labels.colis_form_recipient_phone_label)}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardHeader title={t(Labels.colis_form_package_info)} />
          <CardContent>
            <Grid spacing={2} container>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="type"
                  select
                  label={t(Labels.colis_form_type_label)}
                  fullWidth
                  value={values.type || ''}
                  onChange={e => setFieldValue('type', e.target.value)}
                >
                  <MenuItem value="">
                    <em>{t(Labels.colis_type_none)}</em>
                  </MenuItem>
                  <MenuItem value="DOCUMENT">{t(Labels.colis_type_document)}</MenuItem>
                  <MenuItem value="FRAGILE">{t(Labels.colis_type_fragile)}</MenuItem>
                  <MenuItem value="PERISHABLE">{t(Labels.colis_type_perishable)}</MenuItem>
                  <MenuItem value="STANDARD">{t(Labels.colis_type_standard)}</MenuItem>
                  <MenuItem value="VALUABLE">{t(Labels.colis_type_valuable)}</MenuItem>
                  <MenuItem value="OTHER">{t(Labels.colis_type_other)}</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField type="text" name="content" label={t(Labels.colis_form_content_label)} fullWidth />
              </Grid>
              <Grid spacing={2} container size={{ xs: 12 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField
                    name="weight"
                    label={t(Labels.colis_form_weight_label)}
                    type="number"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField
                    name="price"
                    label={t(Labels.colis_form_price_label)}
                    type="number"
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  name="estimatedValue"
                  label={t(Labels.colis_form_estimated_value_label)}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  type="text"
                  name="description"
                  label={t(Labels.colis_form_description_label)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="crafterId"
                  select
                  label={t(Labels.colis_form_crafter_label)}
                  fullWidth
                  helperText={t(Labels.crafter_koperative_context_helper)}
                  value={values.crafterId}
                  onChange={e => setFieldValue('crafterId', e.target.value)}
                >
                  <MenuItem value="">
                    <em>{t(Labels.colis_crafter_none)}</em>
                  </MenuItem>
                  {crafters.map((crafter: Crafter) => (
                    <MenuItem key={crafter.id} value={crafter.id}>
                      {crafter.model} - {crafter.registrationNumber}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="status"
                  select
                  label={t(Labels.colis_form_status_label)}
                  fullWidth
                  required
                  value={values.status}
                  onChange={e => setFieldValue('status', e.target.value)}
                >
                  <MenuItem value="REGISTERED">{t(Labels.colis_status_registered)}</MenuItem>
                  <MenuItem value="LOADED">{t(Labels.colis_status_loaded)}</MenuItem>
                  <MenuItem value="IN_TRANSIT">{t(Labels.colis_status_in_transit)}</MenuItem>
                  <MenuItem value="DELIVERED">{t(Labels.colis_status_delivered)}</MenuItem>
                  <MenuItem value="CANCELLED">{t(Labels.colis_status_cancelled)}</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container size={{ xs: 12 }} spacing={2}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Grid size={{ xs: 8 }}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {isEditMode ? t(Labels.colis_form_submit_update) : t(Labels.colis_form_submit_create)}
              </Button>
            </Grid>
          )}
          <Grid size={{ xs: 4 }}>
            <Button fullWidth variant="outlined" onClick={onClose}>
              {t(Labels.button_close)}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ColisSchedulerForm;
