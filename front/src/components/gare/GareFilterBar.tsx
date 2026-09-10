import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import VilleAutocomplete from '@/components/shared/VilleAutocomplete';
import ButtonTx from '@/components/ui/ButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import ProtectedTx from '@/components/ProtectedTx';
import { Ville } from '@/types';
import { GareFilter } from '@/types/type.util';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface SimpleGareFilterBarProps {
  filter: Partial<GareFilter>;
  onFilterChange: (filter: Partial<GareFilter>) => void;
  onReset: () => void;
  onAdd: () => void;
  isLoading: boolean;
}

const GareFilterBar: React.FC<SimpleGareFilterBarProps> = ({ filter, onFilterChange, onAdd, isLoading }) => {
  const { t } = useTranslation();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ name: event.target.value });
  };

  const handleVilleChange = (value: Ville[]) => {
    onFilterChange({ ville: value });
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value === 'all') {
      onFilterChange({ isClosed: undefined });
      return;
    }
    onFilterChange({ isClosed: value === 'closed' });
  };

  let statusValue: 'all' | 'open' | 'closed' = 'all';
  if (filter.isClosed === true) {
    statusValue = 'closed';
  } else if (filter.isClosed === false) {
    statusValue = 'open';
  }

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: theme => `1px solid ${theme.palette.divider}` }}>
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: 'flex-end',
        }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            id="gare-filter-search"
            fullWidth
            value={filter.name ?? ''}
            onChange={handleSearchChange}
            label={t(Labels.gare_page_search_placeholder)}
            placeholder={t(Labels.gare_page_search_placeholder)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon icon={SearchIcon} />
                  </InputAdornment>
                ),
                endAdornment:
                  filter.name && filter.name.length > 0 ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => onFilterChange({ name: '' })}>
                        <ClearIcon
                          sx={{
                            fontSize: 'small',
                          }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <VilleAutocomplete
            id="gare-filter-ville"
            multiple
            value={filter.ville ?? []}
            onChange={handleVilleChange}
            label={t(Labels.voyage_filter_gares)}
            placeholder={t(Labels.voyage_filter_gares_placeholder)}
            startIcon={DepartureBoardIcon}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="gare-filter-status-label">{t(Labels.gare_page_filter_status)}</InputLabel>
            <Select
              id="gare-filter-status"
              labelId="gare-filter-status-label"
              value={statusValue}
              label={t(Labels.gare_page_filter_status)}
              onChange={handleStatusChange}
            >
              <MenuItem value="all">{t(Labels.gare_page_filter_all_status)}</MenuItem>
              <MenuItem value="open">{t(Labels.gare_page_status_open)}</MenuItem>
              <MenuItem value="closed">{t(Labels.gare_page_status_closed)}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <ProtectedTx allowedRoles={['ADMIN']}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
              <ButtonTx variant="contained" startIcon={<AddIcon />} onClick={onAdd} disabled={isLoading}>
                {t(Labels.gare_page_add_button)}
              </ButtonTx>
            </Box>
          </Grid>
        </ProtectedTx>
      </Grid>
    </Paper>
  );
};

export default GareFilterBar;
