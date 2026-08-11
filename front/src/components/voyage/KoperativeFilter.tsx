import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import Labels from '@/labelKeys.json';
import type { Koperative } from '@/types';

interface KoperativeFilterProps {
  availableKoperatives: Pick<Koperative, 'id' | 'name'>[];
  selectedKoperativeId: number | null;
  onKoperativeChange: (event: SelectChangeEvent) => void;
  t: (key: string) => string;
}

export const KoperativeFilter = ({
  availableKoperatives,
  selectedKoperativeId,
  onKoperativeChange,
  t,
}: KoperativeFilterProps) => {
  return availableKoperatives.length ? (
    <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <BusinessIcon />
        <Typography variant="body2" color="text.secondary">
          {t(Labels.select_koperative_description)}
        </Typography>
      </Box>
      <Select
        displayEmpty
        size="small"
        value={selectedKoperativeId?.toString() ?? ''}
        onChange={onKoperativeChange}
        sx={{ '& .MuiSelect-select': { fontSize: '0.875rem' } }}
        MenuProps={{ slotProps: { paper: { sx: { mt: 1, maxHeight: 240, borderRadius: 1 } } } }}
      >
        <MenuItem value="">{t(Labels.all_koperatives)}</MenuItem>
        {availableKoperatives.map(koop => (
          <MenuItem key={koop.id} value={koop.id}>
            {koop.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  ) : (
    <></>
  );
};
