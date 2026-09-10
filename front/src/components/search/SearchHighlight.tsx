import React, { memo } from 'react';
import { Typography, useTheme, alpha, type SxProps, type Theme } from '@mui/material';

export interface SearchHighlightProps {
  text: string;
  query?: string;
  component?: React.ElementType;
  sx?: SxProps<Theme>;
  highlightSx?: SxProps<Theme>;
}

const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const SearchHighlight: React.FC<SearchHighlightProps> = ({
  text,
  query = '',
  component = 'span',
  sx,
  highlightSx,
}) => {
  const theme = useTheme();
  const trimmedQuery = query.trim();
  const hasQuery = Boolean(trimmedQuery);

  if (hasQuery) {
    const words = trimmedQuery.split(/\s+/).filter(Boolean);
    const hasWords = words.length > 0;

    if (hasWords) {
      const pattern = words.map(escapeRegExp).join('|');
      const regex = new RegExp(`(${pattern})`, 'gi');
      const parts = text.split(regex);

      return (
        <Typography component={component} sx={sx}>
          {parts.map((part, index) => {
            const isMatch = words.some(word => word.toLowerCase() === part.toLowerCase());
            if (isMatch) {
              return (
                <Typography
                  key={`${part}-${index}`}
                  component="mark"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.16),
                    color: 'primary.main',
                    px: 0.35,
                    py: 0.1,
                    borderRadius: 0.5,
                    fontWeight: 700,
                    ...highlightSx,
                  }}
                >
                  {part}
                </Typography>
              );
            }
            return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
          })}
        </Typography>
      );
    }
  }

  return (
    <Typography component={component} sx={sx}>
      {text}
    </Typography>
  );
};

export default memo(SearchHighlight);
