import { useId } from 'react';

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
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Ville } from '@/models/Ville';
import { useVilles } from '@/hooks/ville.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { StyledIcon } from '../ui';
import type { SvgIconComponent } from '@mui/icons-material';

interface VilleAutocompleteProps<Multiple extends boolean = false> {
  value: Multiple extends true ? Ville[] : Ville | null;
  onChange: (value: Multiple extends true ? Ville[] : Ville | null) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  multiple?: Multiple;
  id?: string;
  startIcon?: SvgIconComponent;
}

const VilleAutocomplete = <Multiple extends boolean = false>({
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  multiple,
  id: providedId,
  startIcon: StartIcon,
}: VilleAutocompleteProps<Multiple>) => {
  const { t } = useTranslation();
  const { data: villes = [], isLoading, error: queryError } = useVilles();

  const getVilleLabel = (ville: Ville) => ville?.name ?? '';
  const getVilleDetails = (ville: Ville) => [ville?.province, ville?.region].filter(Boolean).join(' • ');
  const filter = createFilterOptions<Ville>();

  const customFilterOptions = (
    options: Ville[],
    params: { inputValue: string; getOptionLabel: (option: Ville) => string },
  ) => {
    const filtered = filter(options, params);
    const tooMany = filtered.length >= 4;
    if (tooMany) {
      return [
        ...filtered.slice(0, 4),
        { id: 0, name: t(Labels.ui_koperative_more_results, { count: filtered.length - 4 }) } as Ville,
      ];
    }

    return filtered;
  };

  return (
    <Autocomplete<Ville, Multiple, false, false>
      id={providedId ?? useId()}
      multiple={multiple}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={villes}
      filterOptions={customFilterOptions}
      getOptionLabel={getVilleLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      disabled={disabled || !!queryError}
      noOptionsText={isLoading ? t(Labels.loading) : t(Labels.ui_city_no_available)}
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
      renderOption={(props, ville) => (
        <MenuItem disabled={ville.id === 0} {...props} key={ville.id}>
          <ListItemIcon>
            <StyledIcon icon={LocationCityIcon} />
          </ListItemIcon>
          <ListItemText primary={getVilleLabel(ville)} secondary={getVilleDetails(ville)} />
        </MenuItem>
      )}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error || !!queryError}
          helperText={queryError ? t(Labels.error_loading_voyages) : helperText}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: StartIcon ? (
                <>
                  <InputAdornment position="start">
                    <StyledIcon icon={StartIcon} />
                  </InputAdornment>
                  {params.slotProps.input.startAdornment}
                </>
              ) : (
                params.slotProps.input.startAdornment
              ),
              endAdornment: (
                <>
                  {isLoading && <CircularProgress color="inherit" size={20} />}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default VilleAutocomplete;
