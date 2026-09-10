import React, { useId } from 'react';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
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
import { Koperative } from '@/models/Koperative';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import StyledIcon from '@/components/ui/StyledIcon';

interface KoperativeAutocompleteProps {
  value: Koperative | null | Koperative[];
  onChange: (koperative: Koperative | null | Koperative[]) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  multiple?: boolean;
  readOnly?: boolean;
  id?: string;
  startIcon?: React.ElementType;
  options: Koperative[];
  isLoading?: boolean;
  fetchError?: unknown;
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
  multiple = false,
  readOnly = false,
  id: providedId,
  startIcon: StartIcon,
  options: koperatives,
  isLoading = false,
  fetchError,
}) => {
  const { t } = useTranslation();
  const fallbackId = useId();

  const getKoperativeLabel = (koperative: Koperative) => koperative?.name ?? '';
  const filter = createFilterOptions<Koperative>();

  const customFilterOptions = (
    options: Koperative[],
    params: { inputValue: string; getOptionLabel: (option: Koperative) => string },
  ) => {
    const filtered = filter(options, params);
    const tooMany = filtered.length >= 4;
    if (tooMany) {
      return [
        ...filtered.slice(0, 4),
        { id: 0, name: t(Labels.ui_koperative_more_results, { count: filtered.length - 4 }) } as Koperative,
      ];
    }

    return filtered;
  };

  return (
    <Autocomplete<Koperative, boolean, false, false>
      id={providedId ?? `koperative-autocomplete-${fallbackId}`}
      multiple={multiple}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={koperatives}
      filterOptions={customFilterOptions}
      getOptionLabel={getKoperativeLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      disabled={disabled || !!fetchError}
      readOnly={readOnly}
      noOptionsText={isLoading ? t(Labels.loading) : t(Labels.ui_koperative_no_available)}
      fullWidth={fullWidth}
      autoHighlight
      clearOnEscape
      slots={{ listbox: MenuList }}
      slotProps={{
        paper: {
          elevation: 6,
          sx: {
            marginTop: 0.5,
            borderRadius: 4,
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
          label={label}
          placeholder={placeholder}
          required={required}
          error={error || Boolean(fetchError)}
          helperText={fetchError ? t(Labels.error_loading_voyages) : helperText}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps?.input,
              startAdornment: StartIcon ? (
                <InputAdornment position="start">
                  <StyledIcon icon={StartIcon} />
                </InputAdornment>
              ) : (
                params.slotProps?.input?.startAdornment
              ),
              endAdornment: (
                <>
                  {isLoading && <CircularProgress color="inherit" size={20} />}
                  {params.slotProps?.input?.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default KoperativeAutocomplete;
