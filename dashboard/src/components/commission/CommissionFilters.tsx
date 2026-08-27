import { Box, Paper } from '@mui/material';
import type { Koperative } from '@/types/koperative.types';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';

interface CommissionFiltersProps {
  readonly selectedKoperative: Koperative | null;
  readonly onKoperativeChange: (koperative: Koperative | null) => void;
  readonly koperatives: Koperative[];
  readonly isLoading?: boolean;
}

export default function CommissionFilters({
  selectedKoperative,
  onKoperativeChange,
  koperatives,
  isLoading = false,
}: Readonly<CommissionFiltersProps>) {
  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box sx={{ maxWidth: 360 }}>
        <KoperativeAutocomplete
          value={selectedKoperative}
          onChange={onKoperativeChange}
          options={koperatives}
          isLoading={isLoading}
        />
      </Box>
    </Paper>
  );
}
