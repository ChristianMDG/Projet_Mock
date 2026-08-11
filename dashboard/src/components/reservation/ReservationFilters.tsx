import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  InputAdornment,
} from '@mui/material';
import { Search, FilterAltOff, Phone } from '@mui/icons-material';
import { useReservationStore } from '@/stores/reservation.store';
import { ReservationStatusEnum, ReservationStatusLabels } from '@/types/reservation.types';
import Labels from '@/labelKeys.json';

export default function ReservationFilters() {
  const { t } = useTranslation();
  const { filters, setFilters, resetFilters } = useReservationStore();

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'stretch' }}>
        <TextField
          size="small"
          placeholder={t(Labels.common_search)}
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flex: 1 }}
        />

        <TextField
          size="small"
          placeholder={t(Labels.reservation_filter_phone)}
          value={filters.phoneNumber}
          onChange={(e) => setFilters({ phoneNumber: e.target.value })}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flex: 1 }}
        />

        <FormControl size="small" sx={{ flex: 1 }}>
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

        <Button variant="outlined" startIcon={<FilterAltOff />} onClick={resetFilters} sx={{ flex: 1, height: 40 }}>
          {t(Labels.common_reset)}
        </Button>
      </Stack>
    </Box>
  );
}
