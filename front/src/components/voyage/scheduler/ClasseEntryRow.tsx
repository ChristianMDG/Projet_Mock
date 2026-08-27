import React, { useEffect, useMemo } from 'react';
import Labels from '@/labelKeys.json';
import { Box, Button, Divider, Grid, Stack, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt1';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { countUsableSeats } from '@/utils/seat.utils';
import { Crafter } from '@/models/Crafter';
import { Chauffeur } from '@/models/Chauffeur';
import { Classe } from '@/models/Classe';
import { ClasseEntry } from './SchedulerForm';
import { FormAutocomplete, FormTextField } from '@/components/inputs';

interface FormValues {
  classeEntries: ClasseEntry[];
  description: string;
  departureGare: { id: number } | null;
  arrivalGare: { id: number } | null;
  departureTime: string;
  estimatedArrivalTime: string;
  recurrenceType: string;
  customInterval: number;
  koperative: { id: number };
  recurrenceStartDate: string;
  recurrenceEndDate: string;
  selectedWeekdays: number[];
  selectedMonthlyDates: number[];
}

export interface ClasseEntryRowProps {
  index: number;
  entry: ClasseEntry;
  hasClasses: boolean;
  rowOptions: Classe[];
  availableCrafters: Crafter[];
  availableChauffeurs: Chauffeur[];
  canRemove: boolean;
  showDivider: boolean;
  onRemove: () => void;
  onOpenCrafterForm: () => void;
  onOpenChauffeurForm: () => void;
}

const ClasseEntryRow: React.FC<ClasseEntryRowProps> = ({
  index,
  entry,
  hasClasses,
  rowOptions,
  availableCrafters,
  availableChauffeurs,
  canRemove,
  showDivider,
  onRemove,
  onOpenCrafterForm,
  onOpenChauffeurForm,
}) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<FormValues>();
  const priceColumnSize = hasClasses ? 6 : 12;
  const hasClasseDescription = Boolean(entry.classe?.description);

  const selectedCrafter = entry.crafter;
  const derivedAvailableSeats = useMemo(() => {
    if (selectedCrafter) {
      if (selectedCrafter.seatConfig) return countUsableSeats(selectedCrafter.seatConfig);
      return selectedCrafter.seatCapacity;
    }
    return undefined;
  }, [selectedCrafter]);

  useEffect(() => {
    if (derivedAvailableSeats !== undefined && entry.availableSeats !== derivedAvailableSeats) {
      void setFieldValue(`classeEntries[${index}].availableSeats`, derivedAvailableSeats);
    }
  }, [derivedAvailableSeats, entry.availableSeats, index, setFieldValue]);

  return (
    <Box sx={{ mb: showDivider ? 2 : 0 }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
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
          <Grid size={{ xs: 12, sm: priceColumnSize }}>
            <FormTextField
              name={`classeEntries[${index}].priceKoperative`}
              label={t(Labels.voyage_price_per_seat)}
              type="number"
              inputProps={{ min: 0, step: 500 }}
              required
            />
            {hasClasseDescription && (
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>
                {entry.classe?.description}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <FormAutocomplete<Crafter>
                  name={`classeEntries[${index}].crafter`}
                  label={t(Labels.voyage_select_crafter)}
                  options={availableCrafters}
                  getOptionLabel={option => `${option.model} (${option.registrationNumber})`}
                  required
                />
              </Box>
              <Tooltip title={t(Labels.crafter_form_add_button)} arrow>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onOpenCrafterForm}
                  sx={{ minWidth: 'auto', py: 2 }}
                >
                  <DirectionsBusIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <FormAutocomplete<Chauffeur>
                  name={`classeEntries[${index}].chauffeur`}
                  label={t(Labels.voyage_select_chauffeur)}
                  options={availableChauffeurs}
                  getOptionLabel={option => `${option.user?.firstName} ${option.user?.lastName}`}
                  required
                />
              </Box>
              <Tooltip title={t(Labels.chauffeur_form_add_button)} arrow>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onOpenChauffeurForm}
                  sx={{ minWidth: 'auto', py: 2 }}
                >
                  <PersonAddIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormTextField
              name={`classeEntries[${index}].availableSeats`}
              label={t(Labels.voyage_available_seats)}
              type="number"
              inputProps={{ min: 1, max: 50, readOnly: true }}
              disabled
              required
            />
          </Grid>
        </Grid>
        {canRemove && (
          <Button
            onClick={onRemove}
            variant="contained"
            color="error"
            size="small"
            sx={{ mt: 0.5, flexShrink: 0, minWidth: 'auto', px: 1.5 }}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        )}
      </Box>
      {showDivider && <Divider sx={{ mt: 2 }} />}
    </Box>
  );
};

export default ClasseEntryRow;
