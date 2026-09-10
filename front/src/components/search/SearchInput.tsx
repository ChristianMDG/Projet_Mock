import React, { forwardRef } from 'react';
import { TextField, InputAdornment, IconButton, CircularProgress, Chip, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  placeholder?: string;
  isSearching?: boolean;
  autoFocus?: boolean;
  showShortcut?: boolean;
  size?: 'small' | 'medium';
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      onKeyDown,
      onFocus,
      placeholder = 'Rechercher...',
      isSearching = false,
      autoFocus = false,
      showShortcut = true,
      size = 'medium',
    },
    ref,
  ) => {
    const hasValue = Boolean(value.trim());

    return (
      <TextField
        fullWidth
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        autoFocus={autoFocus}
        placeholder={placeholder}
        size={size}
        slotProps={{
          input: {
            inputRef: ref,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  {isSearching && <CircularProgress size={16} color="primary" />}
                  {hasValue && (
                    <IconButton size="small" onClick={onClear} edge="end" sx={{ p: 0.25 }} aria-label="Clear search">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                  {showShortcut && (
                    <Chip
                      label="⌘K"
                      size="small"
                      sx={{
                        display: { xs: 'none', md: 'inline-flex' },
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: 'action.selected',
                      }}
                    />
                  )}
                </Stack>
              </InputAdornment>
            ),
            sx: {
              bgcolor: 'background.paper',
            },
          },
        }}
      />
    );
  },
);

SearchInput.displayName = 'SearchInput';
export default SearchInput;
