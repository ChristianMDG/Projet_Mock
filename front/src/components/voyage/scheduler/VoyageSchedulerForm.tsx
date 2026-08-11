import React from 'react';
import Labels from '@/labelKeys.json';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, WorkspacePremium as WorkspacePremiumIcon } from '@mui/icons-material';
import { FieldArray, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { RecurrenceTypeEnum } from '@/models/enums';
import { Ville } from '@/models/Ville';
import { Gare } from '@/models/Gare';
import { Crafter } from '@/models/Crafter';
import { Chauffeur } from '@/models/Chauffeur';
import { Classe } from '@/models/Classe';
import { ClasseEntry } from './SchedulerFormDrawer';
import ButtonTx from '@/components/ui/ButtonTx';
import VoyageSchedulerCardTitle from './VoyageSchedulerCardTitle';
import {
  FormAutocomplete,
  FormDatePicker,
  FormDateTimePicker,
  FormMonthlyDateSelector,
  FormRecurrenceTypeSelector,
  FormTextField,
  FormWeekdaySelector,
} from '@/components/inputs';

interface VoyageSchedulerFormContentProps {
  filteredDepartureGares: Gare[];
  filteredArrivalGares: Gare[];
  crafters: Crafter[];
  chauffeurs: Chauffeur[];
  classes: Classe[];
  isEditMode: boolean;
  isLoading: boolean;
  currentError: Error | null;
  onClose: () => void;
  departureVille?: Ville | null;
  arrivalVille?: Ville | null;
}

interface FormValues {
  classeEntries: ClasseEntry[];
  description: string;
  departureGare: Gare | null;
  arrivalGare: Gare | null;
  departureTime: string;
  estimatedArrivalTime: string;
  recurrenceType: RecurrenceTypeEnum;
  customInterval: number;
  koperative: { id: number };
  recurrenceStartDate: string;
  recurrenceEndDate: string;
  selectedWeekdays: number[];
  selectedMonthlyDates: number[];
}

const VoyageSchedulerForm: React.FC<VoyageSchedulerFormContentProps> = ({
  filteredDepartureGares,
  filteredArrivalGares,
  crafters,
  chauffeurs,
  classes,
  isEditMode,
  isLoading,
  currentError,
  onClose,
  departureVille,
  arrivalVille,
}) => {
  const { t } = useTranslation();
  const { values, isValid } = useFormikContext<FormValues>();

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
      <CardHeader
        title={
          <VoyageSchedulerCardTitle
            isEditMode={isEditMode}
            departureVille={departureVille}
            arrivalVille={arrivalVille}
          />
        }
        sx={{ pb: { xs: 1, sm: 2 } }}
      />

      <CardContent sx={{ flexGrow: 1, overflow: 'auto', px: { xs: 2, sm: 3 } }}>
        {currentError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {currentError.message}
          </Alert>
        )}

        {/* Classes & Prices — one voyage per class */}
        <FieldArray name="classeEntries">
          {({ push, remove }) => {
            const selectedIds = values.classeEntries.map(e => e.classe?.id).filter(Boolean);
            const allUsed = classes.length > 0 && selectedIds.length >= classes.length;
            const hasClasses = classes.length > 0;

            return (
              <Card sx={{ mb: 2 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkspacePremiumIcon color="primary" fontSize="small" />
                      <Typography variant="h6">{t(Labels.ui_reservation_classe)}</Typography>
                      {hasClasses && !isEditMode && (
                        <Chip
                          label={`${values.classeEntries.length} voyage${values.classeEntries.length > 1 ? 's' : ''}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  action={
                    hasClasses &&
                    !isEditMode && (
                      <Tooltip title={allUsed ? 'Toutes les classes sont déjà ajoutées' : 'Ajouter une classe'}>
                        <span>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => push({ classe: null, pricePerSeat: 0 } as ClasseEntry)}
                            disabled={allUsed}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          >
                            Classe
                          </Button>
                        </span>
                      </Tooltip>
                    )
                  }
                />
                <CardContent>
                  {values.classeEntries.map((entry, index) => {
                    const otherSelectedIds = values.classeEntries
                      .filter((_, i) => i !== index)
                      .map(e => e.classe?.id)
                      .filter(Boolean);
                    const rowOptions = classes.filter(c => !otherSelectedIds.includes(c.id));

                    return (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'flex-start',
                          mb: 1.5,
                        }}
                      >
                        <Grid container spacing={1.5} sx={{ flex: 1 }}>
                          {hasClasses && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormAutocomplete<Classe>
                                name={`classeEntries[${index}].classe`}
                                label={t(Labels.ui_reservation_classe)}
                                options={rowOptions}
                                getOptionLabel={option => option.name ?? ''}
                              />
                            </Grid>
                          )}
                          <Grid size={{ xs: 12, sm: hasClasses ? 6 : 12 }}>
                            <FormTextField
                              name={`classeEntries[${index}].pricePerSeat`}
                              label={t(Labels.voyage_price_per_seat)}
                              type="number"
                              inputProps={{ min: 0, step: 500 }}
                              required
                            />
                            {entry.classe?.description && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {entry.classe.description}
                              </Typography>
                            )}
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormTextField
                              name={`classeEntries[${index}].availableSeats`}
                              label={t(Labels.voyage_available_seats)}
                              type="number"
                              inputProps={{ min: 1, max: 50 }}
                              required
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormAutocomplete<Crafter>
                              name={`classeEntries[${index}].crafter`}
                              label={t(Labels.voyage_select_crafter)}
                              options={crafters}
                              getOptionLabel={option => `${option.model} (${option.registrationNumber})`}
                              helperText="Facultatif"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormAutocomplete<Chauffeur>
                              name={`classeEntries[${index}].chauffeur`}
                              label={t(Labels.voyage_select_chauffeur)}
                              options={chauffeurs}
                              getOptionLabel={option => `${option.user?.firstName} ${option.user?.lastName}`}
                              helperText="Facultatif"
                            />
                          </Grid>
                        </Grid>
                        {values.classeEntries.length > 1 && (
                          <IconButton
                            onClick={() => remove(index)}
                            color="error"
                            size="small"
                            sx={{ mt: 0.5, flexShrink: 0 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            );
          }}
        </FieldArray>

        {/* General Information */}
        <Card sx={{ mb: 2 }}>
          <CardHeader title={t(Labels.voyage_schedule_general_info)} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormTextField name="description" label={t(Labels.voyage_description)} multiline rows={2} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Route Information */}
        <Card sx={{ mb: 2 }}>
          <CardHeader title={t(Labels.voyage_schedule_route_info)} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormAutocomplete<Gare>
                  name="departureGare"
                  label={t(Labels.voyage_departure_gare)}
                  options={filteredDepartureGares}
                  getOptionLabel={option => option.name ?? ''}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormAutocomplete<Gare>
                  name="arrivalGare"
                  label={t(Labels.voyage_arrival_gare)}
                  options={filteredArrivalGares}
                  getOptionLabel={option => option.name ?? ''}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Timing */}
        <Card sx={{ mb: 2 }}>
          <CardHeader title={t(Labels.voyage_schedule_timing)} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormDateTimePicker name="departureTime" label={t(Labels.voyage_departure_time)} required />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormDateTimePicker name="estimatedArrivalTime" label={t(Labels.voyage_estimated_arrival)} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  {t(Labels.voyage_departure_time)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recurrence - Hidden for edit mode */}
        {!isEditMode && (
          <Card sx={{ mb: 2 }}>
            <CardHeader title={t(Labels.voyage_schedule_recurrence)} />
            <CardContent>
              <FormRecurrenceTypeSelector />

              {values.recurrenceType !== RecurrenceTypeEnum.ONE_OFF && (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormDatePicker
                      name="recurrenceStartDate"
                      label={t(Labels.voyage_recurrence_start_date)}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormDatePicker name="recurrenceEndDate" label={t(Labels.voyage_recurrence_end_date)} required />
                  </Grid>

                  {values.recurrenceType === RecurrenceTypeEnum.CUSTOM && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="customInterval"
                        label={t(Labels.voyage_custom_interval)}
                        type="number"
                        inputProps={{ min: 1 }}
                        helperText={t(Labels.voyage_custom_interval_help)}
                      />
                    </Grid>
                  )}

                  {values.recurrenceType === RecurrenceTypeEnum.WEEKLY && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" gutterBottom>
                        {t(Labels.voyage_select_weekdays)}
                      </Typography>
                      <FormWeekdaySelector />
                    </Grid>
                  )}

                  {values.recurrenceType === RecurrenceTypeEnum.MONTHLY && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" gutterBottom>
                        {t(Labels.voyage_select_monthly_dates)}
                      </Typography>
                      <FormMonthlyDateSelector />
                    </Grid>
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ gap: { xs: 2, md: 3 }, p: 3 }}>
        {isLoading && <LinearProgress />}
        <ButtonTx variant="outlined" onClick={onClose} disabled={isLoading} sx={{ flex: 1 }}>
          {t(Labels.button_cancel)}
        </ButtonTx>
        <ButtonTx
          type="submit"
          variant="contained"
          loading={isLoading}
          disabled={!isValid || isLoading}
          sx={{ flex: 1 }}
        >
          {isLoading ? t(Labels.button_saving) : isEditMode ? t(Labels.button_update) : t(Labels.button_save)}
        </ButtonTx>
      </CardActions>
    </Card>
  );
};

export default VoyageSchedulerForm;
