import { useTranslation } from 'react-i18next';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid, InputAdornment } from '@mui/material';
import { Search, FilterAltOff, Phone } from '@mui/icons-material';
import { StyledIcon } from '@/components/shared';
import { useReservationStore } from '@/stores/reservation.store';
import { ReservationStatusEnum, ReservationStatusLabels } from '@/types/reservation.types';
import Labels from '@/labelKeys.json';

export default function ReservationFilters() {
  const { t } = useTranslation();
  const { filters, setFilters, resetFilters } = useReservationStore();

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
          <TextField
            size="small"
            placeholder={t(Labels.common_search)}
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon icon={Search} />
                  </InputAdornment>
                ),
              },
            }}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
          <TextField
            size="small"
            placeholder={t(Labels.reservation_filter_phone)}
            value={filters.phoneNumber}
            onChange={(e) => setFilters({ phoneNumber: e.target.value })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon icon={Phone} />
                  </InputAdornment>
                ),
              },
            }}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
          <FormControl size="small" fullWidth>
            <InputLabel>{t(Labels.common_status)}</InputLabel>
            <Select
              value={filters.status}
              label={t(Labels.common_status)}
              onChange={(e) => setFilters({ status: e.target.value as ReservationStatusEnum | '' })}
            >
              <MenuItem value="">{t(Labels.common_all)}</MenuItem>
              {Object.entries(ReservationStatusLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {t(label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<FilterAltOff />}
            onClick={resetFilters}
            sx={{ height: 40, width: '100%' }}
          >
            {t(Labels.common_reset)}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
