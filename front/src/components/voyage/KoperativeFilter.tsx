import { Box, Chip, Typography, type Theme } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import Labels from '@/labelKeys.json';
import type { Koperative } from '@/types';
import { useEffect } from 'react';
import KoperativeAvatar from '@/components/ui/KoperativeAvatar';

interface KoperativeFilterProps {
  availableKoperatives: Pick<Koperative, 'id' | 'name' | 'logoUrl'>[];
  selectedKoperativeId: number | null;
  onKoperativeChange: (koperativeId: number | null) => void;
  t: (key: string) => string;
}

// Reusable sx styles generator for chips
const getChipStyles = (isSelected: boolean) => (theme: Theme) => ({
  fontWeight: isSelected ? 600 : 500,
  fontSize: '0.875rem',
  borderRadius: '100px',
  border: '2px solid',
  borderColor: isSelected ? 'primary.main' : theme.palette.divider,
  transition: 'all 0.2s ease-in-out',
  backgroundColor: isSelected ? 'primary.main' : 'transparent',
  color: isSelected ? 'primary.contrastText' : 'text.primary',
  paddingLeft: 0.5,
  '&:hover': {
    backgroundColor: isSelected ? 'primary.dark' : theme.palette.action.hover,
  },
});

export const KoperativeFilter = ({
  availableKoperatives,
  selectedKoperativeId,
  onKoperativeChange,
  t,
}: KoperativeFilterProps) => {
  const hasKoperatives = availableKoperatives.length > 1;
  const isSingle = availableKoperatives.length === 1;

  useEffect(() => {
    if (isSingle) {
      const targetId = availableKoperatives[0].id ?? null;
      const isDifferent = selectedKoperativeId !== targetId;
      if (isDifferent) {
        onKoperativeChange(targetId);
      }
    }
  }, [isSingle, availableKoperatives, selectedKoperativeId, onKoperativeChange]);

  if (hasKoperatives) {
    return (
      <Box sx={{ my: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <BusinessIcon color="primary" />
          <Typography variant="body2" color="text.secondary">
            {t(Labels.select_koperative_description)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {/* Individual Cooperative Chips */}
          {availableKoperatives.map(koop => {
            const isSelected = selectedKoperativeId === koop.id;

            return (
              <Chip
                key={koop.id}
                label={koop.name}
                onClick={() => onKoperativeChange(koop.id ?? null)}
                avatar={<KoperativeAvatar logoUrl={koop.logoUrl} name={koop.name} size={24} isSelected={isSelected} />}
                sx={getChipStyles(isSelected)}
              />
            );
          })}
        </Box>
      </Box>
    );
  }

  return null;
};
