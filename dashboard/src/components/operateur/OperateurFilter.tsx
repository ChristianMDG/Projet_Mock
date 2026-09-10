import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import { Search, FilterAltOff } from '@mui/icons-material';
import { StyledIcon } from '@/components/shared';
import { useOperateurStore } from '@/stores/operateur.store';
import { useKoperatives } from '@/hooks/koperative.hook';
import { useGares } from '@/hooks/gare.hook';
import Labels from '@/labelKeys.json';

export default function OperateurFilter() {
  const { t } = useTranslation();
  const { filters, setFilters, resetFilters } = useOperateurStore();
  const { data: koperatives } = useKoperatives();
  const { data: gares } = useGares();

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
          <TextField
            size="small"
            placeholder={t(Labels.operateur_search_placeholder)}
            value={filters.search ?? ''}
            onChange={(e) => setFilters({ search: e.target.value })}
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
          <FormControl size="small" fullWidth>
            <InputLabel>{t(Labels.common_status)}</InputLabel>
            <Select
              value={filters.isActive === undefined ? '' : String(filters.isActive)}
              label={t(Labels.common_status)}
              onChange={(e) => {
                const val = e.target.value;
                setFilters({ isActive: val === '' ? undefined : val === 'true' });
              }}
            >
              <MenuItem value="">{t(Labels.common_all)}</MenuItem>
              <MenuItem value="true">{t(Labels.operateur_active)}</MenuItem>
              <MenuItem value="false">{t(Labels.operateur_inactive)}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
          <Autocomplete
            size="small"
            options={koperatives ?? []}
            getOptionLabel={(option) => option.name}
            value={koperatives?.find((k) => k.id === filters.koperativeId) ?? null}
            onChange={(_, newValue) => {
              setFilters({ koperativeId: newValue ? newValue.id : undefined });
            }}
            renderInput={(params) => <TextField {...params} label={t(Labels.koperative_title)} />}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
          <Autocomplete
            size="small"
            options={gares ?? []}
            getOptionLabel={(option) => `${option.name}`}
            value={gares?.find((g) => g.id === filters.gareId) ?? null}
            onChange={(_, newValue) => {
              setFilters({ gareId: newValue ? newValue.id : undefined });
            }}
            renderInput={(params) => <TextField {...params} label={t(Labels.operateur_select_gare)} />}
            fullWidth
          />
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
