import React, { useId } from 'react';
import {
  Autocomplete,
  type AutocompleteRenderInputParams,
  CircularProgress,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem,
  TextField,
  createFilterOptions,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useTranslation } from 'react-i18next';
import type { Koperative } from '@/types/koperative.types';
import StyledIcon from './StyledIcon';
import Labels from '@/labelKeys.json';

export interface KoperativeAutocompleteProps {
  value: Koperative | null;
  onChange: (koperative: Koperative | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  readOnly?: boolean;
  id?: string;
  startIcon?: React.ElementType;
  options: Koperative[];
  isLoading?: boolean;
  fetchError?: unknown;
  size?: 'small' | 'medium';
}

const KoperativeAutocomplete: React.FC<KoperativeAutocompleteProps> = ({
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  readOnly = false,
  id: providedId,
  startIcon: StartIcon,
  options: koperatives,
  isLoading = false,
  fetchError,
  size = 'small',
}) => {
  const { t } = useTranslation();
  const fallbackId = useId();

  const getKoperativeLabel = (koperative: Koperative) => koperative?.name ?? '';
  const filter = createFilterOptions<Koperative>();

  const customFilterOptions = (
    options: Koperative[],
    params: { inputValue: string; getOptionLabel: (option: Koperative) => string }
  ) => {
    const filtered = filter(options, params);
    const tooMany = filtered.length >= 4;
    if (tooMany) {
      return [...filtered.slice(0, 4), { id: 0, name: `+${filtered.length - 4} koperativa hafa` } as Koperative];
    }

    return filtered;
  };

  return (
    <Autocomplete<Koperative, false, false, false>
      id={providedId ?? `koperative-autocomplete-${fallbackId}`}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={koperatives}
      filterOptions={customFilterOptions}
      getOptionLabel={getKoperativeLabel}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      loading={isLoading}
      disabled={disabled || Boolean(fetchError)}
      readOnly={readOnly}
      noOptionsText={isLoading ? t(Labels.common_loading) : t(Labels.common_none)}
      fullWidth={fullWidth}
      size={size}
      autoHighlight
      clearOnEscape
      slots={{ listbox: MenuList }}
      slotProps={{
        paper: {
          elevation: 6,
          sx: {
            mt: 0.5,
            borderRadius: 3,
          },
        },
      }}
      renderOption={(props, koperative) => (
        <MenuItem disabled={koperative.id === 0} {...props} key={koperative.id}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <StyledIcon icon={BusinessIcon} />
          </ListItemIcon>
          <ListItemText primary={getKoperativeLabel(koperative)} />
        </MenuItem>
      )}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={label ?? t(Labels.commission_filter_koperative)}
          placeholder={placeholder}
          required={required}
          error={error || Boolean(fetchError)}
          helperText={fetchError ? t(Labels.common_error) : helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: StartIcon ? (
              <InputAdornment position="start">
                <StyledIcon icon={StartIcon} />
              </InputAdornment>
            ) : (
              params.InputProps.startAdornment
            ),
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default KoperativeAutocomplete;
