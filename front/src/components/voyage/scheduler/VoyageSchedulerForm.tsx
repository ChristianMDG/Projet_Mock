import React, { useState } from 'react';
import Labels from '@/labelKeys.json';
import { Alert, Box, Button, Chip, Grid, LinearProgress, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt1';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { FieldArray, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { RecurrenceTypeEnum, VoyageTypeEnum } from '@/models/enums';
import { Ville } from '@/models/Ville';
import { Gare } from '@/models/Gare';
import { Crafter } from '@/models/Crafter';
import { Chauffeur } from '@/models/Chauffeur';
import { Classe } from '@/models/Classe';
import { ClasseEntry } from './SchedulerForm';
import ButtonTx from '@/components/ui/ButtonTx';
import VoyageSchedulerCardTitle from './VoyageSchedulerCardTitle';
import {
  FormAutocomplete,
  FormDatePicker,
  FormDateTimePicker,
  FormMonthlyDateSelector,
  FormRecurrenceTypeSelector,
  FormTextField,
  FormVoyageTypeSelector,
  FormWeekdaySelector,
} from '@/components/inputs';
import { useGetCraftersByKoperative, useCreateCrafter } from '@/hooks/crafter.hooks';
import { useChauffeursByKoperative } from '@/hooks/chauffeur.hooks';
import ChauffeurForm from '@/pages/koperativeDetail/ChauffeurForm';
import CrafterForm from '@/pages/koperativeDetail/CrafterForm';
import FormSection from './FormSection';
import InlinePanel from './InlinePanel';
import ClasseEntryRow from './ClasseEntryRow';

interface VoyageSchedulerFormContentProps {
  filteredDepartureGares: Gare[];
  filteredArrivalGares: Gare[];
  classes: Classe[];
  isEditMode: boolean;
  isLoading: boolean;
  currentError: Error | null;
  onClose: () => void;
  departureVille?: Ville | null;
  arrivalVille?: Ville | null;
  koperativeId: number;
}

interface FormValues {
  classeEntries: ClasseEntry[];
  description: string;
  pourcentageMinimumAvance: number;
  departureGare: Gare | null;
  arrivalGare: Gare | null;
  departureTime: string;
  estimatedArrivalTime: string;
  recurrenceType: RecurrenceTypeEnum;
  typeVoyage: VoyageTypeEnum;
  customInterval: number;
  koperative: { id: number };
  recurrenceStartDate: string;
  recurrenceEndDate: string;
  selectedWeekdays: number[];
  selectedMonthlyDates: number[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const VoyageSchedulerForm: React.FC<VoyageSchedulerFormContentProps> = ({
  filteredDepartureGares,
  filteredArrivalGares,
  classes,
  isEditMode,
  isLoading,
  currentError,
  onClose,
  departureVille,
  arrivalVille,
  koperativeId,
}) => {
  const { t } = useTranslation();
  const { values, isValid, setFieldValue } = useFormikContext<FormValues>();

  const [crafterRowIndex, setCrafterRowIndex] = useState<number | null>(null);
  const [chauffeurRowIndex, setChauffeurRowIndex] = useState<number | null>(null);
  const [crafterFormError, setCrafterFormError] = useState<string | null>(null);

  const crafterFormOpen = crafterRowIndex !== null;
  const chauffeurFormOpen = chauffeurRowIndex !== null;

  const createCrafter = useCreateCrafter();

  const { data: availableCrafters = [] } = useGetCraftersByKoperative(koperativeId ?? 0);
  const { data: availableChauffeurs = [] } = useChauffeursByKoperative(koperativeId ?? 0);

  const handleCrafterCreate = async (crafterData: Partial<Crafter>) => {
    setCrafterFormError(null);
    try {
      const created = await createCrafter.mutateAsync(crafterData);
      if (crafterRowIndex !== null) {
        await setFieldValue(`classeEntries[${crafterRowIndex}].crafter`, created);
      }
      setCrafterRowIndex(null);
    } catch (error: unknown) {
      setCrafterFormError(error instanceof Error ? error.message : t(Labels.error_save_general));
      throw error;
    }
  };

  const handleCloseCrafterForm = () => {
    setCrafterRowIndex(null);
    setCrafterFormError(null);
  };

  const handleChauffeurCreated = async (chauffeur: Chauffeur) => {
    if (chauffeurRowIndex !== null) {
      await setFieldValue(`classeEntries[${chauffeurRowIndex}].chauffeur`, chauffeur);
    }
  };

  const handleCloseChauffeurForm = () => {
    setChauffeurRowIndex(null);
  };

  const isRecurrent = values.recurrenceType !== RecurrenceTypeEnum.ONE_OFF;
  const showWeeklySelector = values.recurrenceType === RecurrenceTypeEnum.WEEKLY;
  const showMonthlySelector = values.recurrenceType === RecurrenceTypeEnum.MONTHLY;
  const showCustomInterval = values.recurrenceType === RecurrenceTypeEnum.CUSTOM;
  const showRecurrenceSection = !isEditMode;
  const hasError = Boolean(currentError);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ pb: 2 }}>
        <VoyageSchedulerCardTitle isEditMode={isEditMode} departureVille={departureVille} arrivalVille={arrivalVille} />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        {hasError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {currentError?.message}
          </Alert>
        )}

        {/* Classes & Prices — one voyage per class */}
        <FieldArray name="classeEntries">
          {({ push, remove }) => {
            const selectedIds = values.classeEntries.map(e => e.classe?.id).filter(Boolean);
            const hasClasses = classes.length > 0;
            const allUsed = hasClasses && selectedIds.length >= classes.length;
            const showClasseControls = hasClasses && !isEditMode;
            const entriesCount = values.classeEntries.length;
            const hasMultipleEntries = entriesCount > 1;

            return (
              <FormSection
                icon={<WorkspacePremiumIcon color="primary" fontSize="small" />}
                title={t(Labels.ui_reservation_classe)}
                badge={
                  showClasseControls ? (
                    <Chip
                      label={`${entriesCount} voyage${entriesCount > 1 ? 's' : ''}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ) : undefined
                }
                action={
                  showClasseControls && (
                    <Tooltip title={allUsed ? 'Toutes les classes sont déjà ajoutées' : 'Ajouter une classe'}>
                      <span>
                        <Button
                          startIcon={<AddIcon />}
                          onClick={() =>
                            push({
                              classe: null,
                              priceKoperative: 0,
                              availableSeats: 18,
                              crafter: null,
                              chauffeur: null,
                            } as ClasseEntry)
                          }
                          disabled={allUsed}
                          size="small"
                          variant="outlined"
                        >
                          Classe
                        </Button>
                      </span>
                    </Tooltip>
                  )
                }
              >
                {values.classeEntries.map((entry, index) => {
                  return (
                    <ClasseEntryRow
                      key={index}
                      index={index}
                      entry={entry}
                      hasClasses={hasClasses}
                      rowOptions={classes}
                      availableCrafters={availableCrafters}
                      availableChauffeurs={availableChauffeurs}
                      canRemove={hasMultipleEntries}
                      showDivider={index < entriesCount - 1}
                      onRemove={() => remove(index)}
                      onOpenCrafterForm={() => setCrafterRowIndex(index)}
                      onOpenChauffeurForm={() => setChauffeurRowIndex(index)}
                    />
                  );
                })}
              </FormSection>
            );
          }}
        </FieldArray>

        {/* General Information */}
        <FormSection title={t(Labels.voyage_schedule_general_info)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormVoyageTypeSelector />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField
                name="pourcentageMinimumAvance"
                label={t(Labels.voyage_pourcentage_minimum_avance)}
                type="number"
                inputProps={{ min: 0, max: 100, step: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextField name="description" label={t(Labels.voyage_description)} multiline rows={2} />
            </Grid>
          </Grid>
        </FormSection>

        {/* Route Information */}
        <FormSection title={t(Labels.voyage_schedule_route_info)}>
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
        </FormSection>

        {/* Timing */}
        <FormSection title={t(Labels.voyage_schedule_timing)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormDateTimePicker name="departureTime" label={t(Labels.voyage_departure_time)} required />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormDateTimePicker name="estimatedArrivalTime" label={t(Labels.voyage_estimated_arrival)} />
            </Grid>
          </Grid>
        </FormSection>

        {/* Recurrence */}
        {showRecurrenceSection && (
          <FormSection title={t(Labels.voyage_schedule_recurrence)}>
            <FormRecurrenceTypeSelector />

            {isRecurrent && (
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormDatePicker name="recurrenceStartDate" label={t(Labels.voyage_recurrence_start_date)} required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormDatePicker name="recurrenceEndDate" label={t(Labels.voyage_recurrence_end_date)} required />
                </Grid>
                {showCustomInterval && (
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
                {showWeeklySelector && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" gutterBottom>
                      {t(Labels.voyage_select_weekdays)}
                    </Typography>
                    <FormWeekdaySelector />
                  </Grid>
                )}
                {showMonthlySelector && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" gutterBottom>
                      {t(Labels.voyage_select_monthly_dates)}
                    </Typography>
                    <FormMonthlyDateSelector />
                  </Grid>
                )}
              </Grid>
            )}
          </FormSection>
        )}

        {/* Inline Crafter creation */}
        <InlinePanel
          open={crafterFormOpen}
          icon={<DirectionsBusIcon color="primary" />}
          title={t(Labels.crafter_form_create_title)}
          onClose={handleCloseCrafterForm}
        >
          <CrafterForm
            open={crafterFormOpen}
            onClose={handleCloseCrafterForm}
            koperativeId={koperativeId}
            mode="create"
            onSubmit={handleCrafterCreate}
            loading={createCrafter.isPending}
            error={crafterFormError}
          />
        </InlinePanel>

        {/* Inline Chauffeur creation */}
        <InlinePanel
          open={chauffeurFormOpen}
          icon={<PersonAddIcon color="primary" />}
          title={t(Labels.chauffeur_form_create_title)}
          onClose={handleCloseChauffeurForm}
        >
          <ChauffeurForm
            open={chauffeurFormOpen}
            onClose={handleCloseChauffeurForm}
            koperativeId={koperativeId}
            mode="create"
            onCreated={handleChauffeurCreated}
          />
        </InlinePanel>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, pt: 2 }}>
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
      </Box>
    </Box>
  );
};

export default VoyageSchedulerForm;
