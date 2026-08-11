import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';
import LabelKeys from '@/labelKeys.json';
import { Ville } from '@/models/Ville';

interface RouteFiltersProps {
  departureCity: Ville | null;
  onDepartureCityChange: (value: Ville | null) => void;
  uniqueDepartureCities: Ville[];
}

const RouteFilters: React.FC<RouteFiltersProps> = ({ departureCity, onDepartureCityChange, uniqueDepartureCities }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 2, sm: 1 } }}>
      <Typography variant="body1" sx={{ color: 'text.primary' }}>
        {t(LabelKeys.departing_from)}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControl variant="standard">
          <Select
            value={departureCity ? departureCity.id : ''}
            onChange={e => {
              const selected = uniqueDepartureCities.find(c => c.id === e.target.value);
              onDepartureCityChange(selected || null);
            }}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              '&:before, &:after': { borderBottomColor: theme => `${theme.palette.primary.main} !important` },
              '& .MuiSelect-select': { py: 0, borderBottom: theme => `2px solid ${theme.palette.primary.main}` },
            }}
          >
            {uniqueDepartureCities.map(city => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default RouteFilters;
