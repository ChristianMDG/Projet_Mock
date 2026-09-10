import React, { memo } from 'react';
import { ListSubheader, Stack, Typography } from '@mui/material';
import { SearchResultCountChip } from './RenderLabel';

export interface SearchSectionHeaderProps {
  title: string;
  count?: number;
  icon?: React.ReactNode;
}

export const SearchSectionHeader: React.FC<SearchSectionHeaderProps> = ({ title, count, icon }) => {
  const hasCount = typeof count === 'number';

  return (
    <ListSubheader
      sx={{
        bgcolor: 'background.paper',
        lineHeight: 2.2,
        px: 2,
        py: 0.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {icon}
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            {title}
          </Typography>
        </Stack>
        {hasCount && <SearchResultCountChip count={count} />}
      </Stack>
    </ListSubheader>
  );
};

export default memo(SearchSectionHeader);
