import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Ville } from '@/api/ville.api';

interface VilleSelectorProps {
  villes: Ville[];
  selectedVilleId: number | null;
  onSelect: (villeId: number | null) => void;
  loading?: boolean;
}

export default function VilleSelector({ villes, selectedVilleId, onSelect, loading = false }: VilleSelectorProps) {
  const handleChange = (event: SelectChangeEvent<number | null>) => {
    onSelect(event.target.value as number | null);
  };

  return (
    <FormControl fullWidth sx={{ minWidth: 240 }}>
      <InputLabel id="ville-select-label">Select Ville (Departure)</InputLabel>
      <Select<number | null>
        labelId="ville-select-label"
        value={selectedVilleId ?? ''}
        label="Select Ville (Departure)"
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
          <em>-- None --</em>
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
