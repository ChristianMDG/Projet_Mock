import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Typography,
} from '@mui/material';
import ClassIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { RecurrenceTypeEnum, VoyageStatusEnum } from '@/models/enums';
import { Gare } from '@/models/Gare';
import { Crafter } from '@/models/Crafter';
import { Chauffeur } from '@/models/Chauffeur';
import { Classe } from '@/models/Classe';
import { useField, useFormikContext } from 'formik';
import {
  FormDatePicker,
  FormDateTimePicker,
  FormMonthlyDateSelector,
  FormRecurrenceTypeSelector,
  FormSelectField,
  FormSwitchField,
  FormTextField,
  FormWeekdaySelector,
} from '@/components/inputs';
import VehicleIcon from '@/components/shared/VehicleIcon';
import StyledIcon from '@/components/ui/StyledIcon';

interface VoyageFormValues {
  id?: number;
  description: string;
  departureGareId: number | '';
  arrivalGareId: number | '';
  departureTime: string;
  estimatedArrivalTime: string;
  availableSeats: number | '';
  priceKoperative: number | '';
  crafterId: number | '';
  chauffeurId: number | '';
  classeId: number | '';
  status: VoyageStatusEnum;
  recurrenceType: RecurrenceTypeEnum;
  customInterval: number | '';
  selectedWeekdays: number[];
  selectedMonthlyDates: number[];
  recurrenceStartDate: string;
  recurrenceEndDate: string;
  isTemplate: boolean;
}

interface VoyageFormFieldsProps {
  onClose: () => void;
  isLoading: boolean;
  gares: Gare[];
  crafters: Crafter[];
  chauffeurs: Chauffeur[];
  classes: Classe[];
}

const VoyageFormFields: React.FC<VoyageFormFieldsProps> = ({
  onClose,
  isLoading,
  gares,
  crafters,
  chauffeurs,
  classes,
}) => {
  const { t } = useTranslation();
  const { values, errors, touched, isSubmitting } = useFormikContext<VoyageFormValues>();
  const [, weekdaysMeta] = useField('selectedWeekdays');
  const [, monthlyDatesMeta] = useField('selectedMonthlyDates');

  return (
    <Grid container spacing={2}>
      {/* Basic Information */}
      <Grid size={{ xs: 12 }}>
        <FormTextField name="description" label={t(Labels.voyage_description)} required />
      </Grid>
      {/* Route & Stations */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormSelectField
          name="departureGareId"
          label={t(Labels.voyage_departure_gare)}
          required
          startIcon={<StyledIcon icon={RouteIcon} />}
        >
          <MenuItem value="">{t(Labels.voyage_select_placeholder)}</MenuItem>
          {gares.map(gare => (
            <MenuItem key={gare.id} value={gare.id}>
              {gare.name} - {gare.ville?.name}
            </MenuItem>
          ))}
        </FormSelectField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormSelectField
          name="arrivalGareId"
          label={t(Labels.voyage_arrival_gare)}
          required
          startIcon={<StyledIcon icon={RouteIcon} />}
        >
          <MenuItem value="">{t(Labels.voyage_select_placeholder)}</MenuItem>
          {gares.map(gare => (
            <MenuItem key={gare.id} value={gare.id}>
              {gare.name} - {gare.ville?.name}
            </MenuItem>
          ))}
        </FormSelectField>
      </Grid>
      {/* Timing */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormDateTimePicker name="departureTime" label={t(Labels.voyage_departure_time)} required />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormDateTimePicker name="estimatedArrivalTime" label={t(Labels.voyage_estimated_arrival)} />
      </Grid>
      {/* Capacity & Pricing */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormTextField
          name="availableSeats"
          label={t(Labels.voyage_available_seats)}
          type="number"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <StyledIcon icon={VehicleIcon} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormTextField
          name="priceKoperative"
          label={t(Labels.voyage_price_per_seat)}
          type="number"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <StyledIcon icon={AttachMoneyIcon} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      {/* Vehicle & Driver */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormSelectField
          name="crafterId"
          label={t(Labels.voyage_select_crafter)}
          required
          startIcon={<StyledIcon icon={VehicleIcon} />}
        >
          <MenuItem value="">{t(Labels.voyage_select_placeholder)}</MenuItem>
          {crafters.map(crafter => (
            <MenuItem key={crafter.id} value={crafter.id}>
              {crafter.model} ({crafter.registrationNumber})
            </MenuItem>
          ))}
        </FormSelectField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormSelectField
          name="chauffeurId"
          label={t(Labels.voyage_select_chauffeur)}
          required
          startIcon={<StyledIcon icon={PersonIcon} />}
        >
          <MenuItem value="">{t(Labels.voyage_select_placeholder)}</MenuItem>
          {chauffeurs.map(chauffeur => (
            <MenuItem key={chauffeur.id} value={chauffeur.id}>
              {chauffeur.user?.firstName} {chauffeur.user?.lastName}
            </MenuItem>
          ))}
        </FormSelectField>
      </Grid>
      {classes.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <FormSelectField
            name="classeId"
            label={t(Labels.ui_reservation_classe)}
            startIcon={<StyledIcon icon={ClassIcon} />}
          >
            <MenuItem value="">{t(Labels.voyage_select_placeholder)}</MenuItem>
            {classes.map(classe => (
              <MenuItem key={classe.id} value={classe.id}>
                {classe.name}
              </MenuItem>
            ))}
          </FormSelectField>
        </Grid>
      )}
      {/* Status */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormSelectField name="status" label={t(Labels.voyage_status)}>
          {Object.values(VoyageStatusEnum).map(status => (
            <MenuItem key={status} value={status}>
              {status.replace('_', ' ')}
            </MenuItem>
          ))}
        </FormSelectField>
      </Grid>
      {/* Recurrence Configuration */}
      <Grid size={{ xs: 12 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{t(Labels.voyage_schedule_recurrence)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormRecurrenceTypeSelector name="recurrenceType" />
              </Grid>

              {values.recurrenceType === RecurrenceTypeEnum.WEEKLY && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t(Labels.voyage_select_weekdays)}
                  </Typography>
                  <FormWeekdaySelector name="selectedWeekdays" />
                  {weekdaysMeta.touched && weekdaysMeta.error && (
                    <FormHelperText error>{weekdaysMeta.error}</FormHelperText>
                  )}
                </Grid>
              )}

              {values.recurrenceType === RecurrenceTypeEnum.MONTHLY && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t(Labels.voyage_select_monthly_dates)}
                  </Typography>
                  <FormMonthlyDateSelector name="selectedMonthlyDates" />
                  {monthlyDatesMeta.touched && monthlyDatesMeta.error && (
                    <FormHelperText error>{monthlyDatesMeta.error}</FormHelperText>
                  )}
                </Grid>
              )}

              {values.recurrenceType === RecurrenceTypeEnum.CUSTOM && (
                <Grid size={{ xs: 12 }}>
                  <FormTextField
                    name="customInterval"
                    label={t(Labels.voyage_custom_interval)}
                    type="number"
                    helperText={t(Labels.voyage_custom_interval_help)}
                  />
                </Grid>
              )}

              {values.recurrenceType !== RecurrenceTypeEnum.ONE_OFF && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormDatePicker name="recurrenceStartDate" label={t(Labels.voyage_recurrence_start_date)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormDatePicker name="recurrenceEndDate" label={t(Labels.voyage_recurrence_end_date)} />
                  </Grid>
                </>
              )}

              <Grid size={{ xs: 12 }}>
                <FormSwitchField name="isTemplate" label={t(Labels.voyage_is_template)} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      {/* Action Buttons */}
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            mt: 2,
          }}
        >
          <Button onClick={onClose} variant="outlined">
            {t(Labels.ui_cancel)}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || isSubmitting}
            startIcon={isLoading || isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {t(Labels.button_save)}
          </Button>
        </Box>
      </Grid>
      {/* Error Alert */}
      {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="error">{t(Labels.error_required_fields)}</Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default VoyageFormFields;
