import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Ville } from '@/api/ville.api';

interface VilleSelectorProps {
  villes: Ville[];
  selectedVilleId: number | null;
  onSelect: (villeId: number | null) => void;
  loading?: boolean;
}

export default function VilleSelector({ villes, selectedVilleId, onSelect, loading = false }: VilleSelectorProps) {
  const { t } = useTranslation();
  const label = t(Labels.route_select_departure);
  const handleChange = (event: SelectChangeEvent<number | null>) => {
    onSelect(event.target.value as number | null);
  };

  return (
    <FormControl fullWidth sx={{ minWidth: 240 }}>
      <InputLabel id="ville-select-label">{label}</InputLabel>
      <Select<number | null>
        labelId="ville-select-label"
        value={selectedVilleId ?? ''}
        label={label}
        onChange={handleChange}
        disabled={loading}
        MenuProps={{
          slotProps: {
            paper: {
              style: {
                maxHeight: 300,
              },
            },
          },
        }}
      >
        <MenuItem value="">
          <em>{t(Labels.common_none)}</em>
        </MenuItem>
        {villes.map((ville) => (
          <MenuItem key={ville.id} value={ville.id}>
            {ville.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
