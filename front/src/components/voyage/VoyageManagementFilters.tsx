import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FilterIcon from '@mui/icons-material/FilterList';
import { DatePicker } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useKoperatives } from '../../hooks/koperative.hooks';
import { useGares } from '../../hooks/gare.hooks';
import { VoyageManagementFilters as FilterType } from '../../stores/voyage-management.store';
import { mergeDatePickerSlotProps } from '@/utils/datePickerUtils';
import { VoyageStatusEnum } from '../../models/enums';
import { Koperative } from '../../models/Koperative';
import { Gare } from '../../models/Gare';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';
import GareAutocomplete from '@/components/shared/GareAutocomplete';

interface VoyageManagementFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: Partial<FilterType>) => void;
  onClearFilters: () => void;
}

const VoyageManagementFilters: React.FC<VoyageManagementFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const { data: koperatives = [] } = useKoperatives();
  const { data: gares = [] } = useGares();

  const statusOptions = [
    { value: VoyageStatusEnum.SCHEDULED, label: t(Labels.enum_voyage_status_scheduled) },
    { value: VoyageStatusEnum.ONGOING, label: t(Labels.enum_voyage_status_ongoing) },
    { value: VoyageStatusEnum.COMPLETED, label: t(Labels.enum_voyage_status_completed) },
    { value: VoyageStatusEnum.CANCELLED, label: t(Labels.enum_voyage_status_cancelled) },
    { value: VoyageStatusEnum.DELAYED, label: t(Labels.enum_voyage_status_delayed) },
  ];

  const hasActiveFilters =
    filters.koperativeIds.length > 0 ||
    filters.gareIds.length > 0 ||
    filters.statusFilter.length > 0 ||
    (filters.dateRange.startDate ?? false) ||
    (filters.dateRange.endDate ?? false) ||
    filters.searchQuery ||
    filters.routeFilter ||
    filters.showTemplatesOnly ||
    filters.showInstancesOnly;

  const handleKoperativeChange = (value: Koperative[]) => {
    const selectedIds = value.map(k => k.id ?? 0);
    onFiltersChange({ koperativeIds: selectedIds });
  };

  const handleGareChange = (value: Gare[]) => {
    const selectedIds = value.map(g => g.id ?? 0);
    onFiltersChange({ gareIds: selectedIds });
  };

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const selectedStatuses = Array.isArray(event.target.value) ? (event.target.value as VoyageStatusEnum[]) : [];
    onFiltersChange({ statusFilter: selectedStatuses });
  };

  return (
    <Card elevation={1}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FilterIcon color="primary" />
            <Typography variant="h6" component="h2">
              {t(Labels.voyage_management_filters_title)}
            </Typography>
          </Box>
          {hasActiveFilters && (
            <Button size="small" startIcon={<ClearIcon />} onClick={onClearFilters} color="secondary">
              {t(Labels.ui_cancel)}
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <KoperativeAutocomplete
              multiple
              value={koperatives.filter(k => filters.koperativeIds.includes(k.id ?? 0))}
              onChange={val => handleKoperativeChange(val as Koperative[])}
              label={t(Labels.voyage_management_filters_koperative)}
              options={koperatives}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <GareAutocomplete
              multiple
              value={gares.filter((g: Gare) => filters.gareIds.includes(g.id ?? 0))}
              onChange={val => handleGareChange(val as Gare[])}
              label={t(Labels.voyage_filter_gares)}
              options={gares}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t(Labels.voyage_management_filters_status)}</InputLabel>
              <Select
                multiple
                value={filters.statusFilter}
                onChange={handleStatusChange}
                label={t(Labels.voyage_management_filters_status)}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(value => (
                      <Chip key={value} label={statusOptions.find(s => s.value === value)?.label} size="small" />
                    ))}
                  </Box>
                )}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <DatePicker
              label={t(Labels.voyage_management_filters_date_from)}
              value={filters.dateRange.startDate}
              onChange={value =>
                onFiltersChange({
                  dateRange: { ...filters.dateRange, startDate: value },
                })
              }
              timezone="Indian/Antananarivo"
              slotProps={mergeDatePickerSlotProps({
                textField: {
                  size: 'small',
                  variant: 'outlined',
                },
              })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <DatePicker
              label={t(Labels.voyage_management_filters_date_to)}
              value={filters.dateRange.endDate}
              onChange={value =>
                onFiltersChange({
                  dateRange: { ...filters.dateRange, endDate: value },
                })
              }
              timezone="Indian/Antananarivo"
              slotProps={mergeDatePickerSlotProps({
                textField: {
                  size: 'small',
                  variant: 'outlined',
                },
              })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <TextField
              fullWidth
              size="small"
              label={t(Labels.search)}
              value={filters.searchQuery}
              onChange={e => onFiltersChange({ searchQuery: e.target.value })}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <TextField
              fullWidth
              size="small"
              label={t(Labels.voyage_management_filters_route)}
              value={filters.routeFilter}
              onChange={e => onFiltersChange({ routeFilter: e.target.value })}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.showTemplatesOnly}
                    onChange={e => onFiltersChange({ showTemplatesOnly: e.target.checked })}
                    size="small"
                  />
                }
                label={t(Labels.template_management)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.showInstancesOnly}
                    onChange={e => onFiltersChange({ showInstancesOnly: e.target.checked })}
                    size="small"
                  />
                }
                label={t(Labels.instance_management)}
              />
            </Box>
          </Grid>
        </Grid>

        {hasActiveFilters && (
          <Box
            sx={{
              mt: 2,
            }}
          >
            <Typography variant="caption" color="textSecondary" gutterBottom>
              {t(Labels.filters)}:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {filters.koperativeIds.map(id => {
                const koperative = koperatives.find(k => k.id === id);
                return koperative ? (
                  <Chip
                    key={id}
                    label={koperative.name}
                    size="small"
                    onDelete={() =>
                      onFiltersChange({
                        koperativeIds: filters.koperativeIds.filter(kid => kid !== id),
                      })
                    }
                  />
                ) : null;
              })}
              {filters.gareIds.map(id => {
                const gare = gares.find((g: Gare) => g.id === id);
                return gare ? (
                  <Chip
                    key={id}
                    label={gare.name}
                    size="small"
                    onDelete={() =>
                      onFiltersChange({
                        gareIds: filters.gareIds.filter(gid => gid !== id),
                      })
                    }
                  />
                ) : null;
              })}
              {filters.statusFilter.map(status => (
                <Chip
                  key={status}
                  label={statusOptions.find(s => s.value === status)?.label}
                  size="small"
                  onDelete={() =>
                    onFiltersChange({
                      statusFilter: filters.statusFilter.filter(s => s !== status),
                    })
                  }
                />
              ))}
              {filters.dateRange.startDate && (
                <Chip
                  label={`From: ${filters.dateRange.startDate.format('DD/MM/YYYY')}`}
                  size="small"
                  onDelete={() =>
                    onFiltersChange({
                      dateRange: { ...filters.dateRange, startDate: null },
                    })
                  }
                />
              )}
              {filters.dateRange.endDate && (
                <Chip
                  label={`To: ${filters.dateRange.endDate.format('DD/MM/YYYY')}`}
                  size="small"
                  onDelete={() =>
                    onFiltersChange({
                      dateRange: { ...filters.dateRange, endDate: null },
                    })
                  }
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default VoyageManagementFilters;
