import React, { memo } from 'react';
import { Stack, Chip, alpha } from '@mui/material';

export interface SearchResultCountChipProps {
  count: number;
}

export const SearchResultCountChip: React.FC<SearchResultCountChipProps> = ({ count }) => {
  return (
    <Chip
      label={count}
      size="small"
      sx={{
        height: 20,
        fontSize: '0.72rem',
        fontWeight: 700,
        bgcolor: theme => alpha(theme.palette.text.secondary, 0.1),
        color: 'text.secondary !important',
        borderRadius: '10px',
        '& .MuiChip-label': { px: 0.8 },
      }}
    />
  );
};

export interface RenderLabelProps {
  label: string;
  count?: number;
}

export const RenderLabel: React.FC<RenderLabelProps> = ({ label, count }) => {
  const hasCount = typeof count === 'number' && count > 0;

  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      <span>{label}</span>
      {hasCount && <SearchResultCountChip count={count} />}
    </Stack>
  );
};

export default memo(RenderLabel);
