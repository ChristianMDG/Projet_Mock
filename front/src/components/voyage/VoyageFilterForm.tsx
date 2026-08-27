import React from 'react';
import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from '@mui/material';
import FilterIcon from '@mui/icons-material/FilterList';
import { useTranslation } from 'react-i18next';
import { useGares } from '@/hooks/gare.hooks';
import { useKoperatives } from '@/hooks/koperative.hooks';
import { VoyageStatusEnum, VoyageStatusLabels } from '@/models/enums';
import { Gare } from '@/types';
import Labels from '@/labelKeys.json';
import KoperativeVerifiedIcon from '@/components/shared/KoperativeVerifiedIcon';
import GareAutocomplete from '@/components/shared/GareAutocomplete';
interface VoyageFilterFormProps {
  isAdmin: boolean;
  userKoperativeId: number | null;
  selectedGareIds: number[];
  selectedKoperativeId: number | null;
  selectedStatus: VoyageStatusEnum;
  onFilterChange: (filters: { gareIds?: number[]; koperativeId?: number; status?: VoyageStatusEnum }) => void;
  showStatusFilter?: boolean;
}

export const VoyageFilterForm: React.FC<VoyageFilterFormProps> = ({
  isAdmin,
  selectedGareIds,
  selectedKoperativeId,
  selectedStatus,
  onFilterChange,
  showStatusFilter = false,
}) => {
  const { t } = useTranslation();
  const { data: gares = [] } = useGares();
  const { data: koperatives = [] } = useKoperatives();

  const handleGareChange = (newValue: Gare[]) => {
    const gareIds = newValue.map(gare => gare.id!);
    onFilterChange({ gareIds });
  };

  const handleKoperativeChange = (event: SelectChangeEvent<number | string>) => {
    const koperativeId = event.target.value === '' ? undefined : Number(event.target.value);
    onFilterChange({ koperativeId });
  };

  const handleStatusChange = (event: SelectChangeEvent<VoyageStatusEnum>) => {
    const status = event.target.value as VoyageStatusEnum;
    onFilterChange({ status });
  };

  const selectedGares = gares.filter(gare => selectedGareIds.includes(gare.id!));
  const showGareFilter = !isAdmin || Boolean(selectedKoperativeId);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterIcon sx={{ mr: 1 }} color="action" />
        <Typography variant="h6">{t(Labels.voyage_filters)}</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Gare Filter - Always visible for operators, optional for admins */}
        {showGareFilter && (
          <Grid size={{ xs: 12, md: 6 }}>
            <GareAutocomplete
              multiple
              value={selectedGares}
              onChange={val => handleGareChange(val as Gare[])}
              label={t(Labels.voyage_filter_gares)}
              placeholder={t(Labels.voyage_filter_gares_placeholder)}
              options={gares}
            />
          </Grid>
        )}

        {/* Koperative Filter - Only for admins */}
        {isAdmin && (
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>{t(Labels.voyage_filter_koperative)}</InputLabel>
              <Select
                value={selectedKoperativeId ?? ''}
                onChange={handleKoperativeChange}
                label={t(Labels.voyage_filter_koperative)}
              >
                {koperatives.map(koperative => (
                  <MenuItem key={koperative.id} value={koperative.id}>
                    {koperative.name}
                    <KoperativeVerifiedIcon koperative={koperative} fontSize="small" />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Status Filter - Only when showStatusFilter is true */}
        {showStatusFilter && (
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>{t(Labels.voyage_filter_status)}</InputLabel>
              <Select value={selectedStatus} onChange={handleStatusChange} label={t(Labels.voyage_filter_status)}>
                {Object.values(VoyageStatusEnum).map(status => (
                  <MenuItem key={status} value={status}>
                    {VoyageStatusLabels[status]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Current Filters Display */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {selectedGareIds.length > 0 && (
              <Chip
                label={`${selectedGareIds.length} ${t(Labels.voyage_filter_gares_selected)}`}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {selectedKoperativeId && (
              <Chip
                label={koperatives.find(k => k.id === selectedKoperativeId)?.name}
                color="secondary"
                variant="outlined"
                size="small"
              />
            )}
            {showStatusFilter && (
              <Chip label={VoyageStatusLabels[selectedStatus]} color="info" variant="outlined" size="small" />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
