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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Gare } from '@/models/Gare';
import { useGares } from '@/hooks/gare.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import StyledIcon from '@/components/ui/StyledIcon';

interface GareAutocompleteProps<Multiple extends boolean = false> {
  value: Multiple extends true ? Gare[] : Gare | null;
  onChange: (value: Multiple extends true ? Gare[] : Gare | null) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  multiple?: Multiple;
  readOnly?: boolean;
  id?: string;
  startIcon?: React.ElementType;
  options?: Gare[];
  isLoading?: boolean;
  fetchError?: unknown;
}

const GareAutocomplete = <Multiple extends boolean = false>({
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
  readOnly = false,
  id: providedId,
  startIcon: StartIcon,
  options: externalOptions,
  isLoading: externalIsLoading,
  fetchError: externalFetchError,
}: GareAutocompleteProps<Multiple>) => {
  const { t } = useTranslation();
  const fallbackId = useId();
  const { data: garesFetched = [], isLoading: internalLoading, error: internalError } = useGares();
  const gares = externalOptions ?? garesFetched;
  const isLoading = externalIsLoading ?? internalLoading;
  const queryError = externalFetchError ?? internalError;

  const getGareLabel = (gare: Gare) => gare?.name ?? '';
  const getGareDetails = (gare: Gare) => gare?.ville?.name ?? '';
  const filter = createFilterOptions<Gare>();

  const customFilterOptions = (
    options: Gare[],
    params: { inputValue: string; getOptionLabel: (option: Gare) => string },
  ) => {
    const filtered = filter(options, params);
    const tooMany = filtered.length >= 5;
    if (tooMany) {
      return [
        ...filtered.slice(0, 4),
        { id: 0, name: t(Labels.ui_koperative_more_results, { count: filtered.length - 4 }) } as Gare,
      ];
    }
    return filtered;
  };

  return (
    <Autocomplete<Gare, Multiple, false, false>
      id={providedId ?? `gare-autocomplete-${fallbackId}`}
      multiple={multiple}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={gares}
      filterOptions={customFilterOptions}
      getOptionLabel={getGareLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      disabled={disabled || !!queryError}
      readOnly={readOnly}
      noOptionsText={isLoading ? t(Labels.loading) : t(Labels.ui_gare_no_available)}
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
      renderOption={(props, gare) => (
        <MenuItem disabled={gare.id === 0} {...props} key={gare.id}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <StyledIcon icon={LocationOnIcon} />
          </ListItemIcon>
          <ListItemText primary={getGareLabel(gare)} secondary={getGareDetails(gare)} />
        </MenuItem>
      )}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error || Boolean(queryError)}
          helperText={queryError ? t(Labels.error_loading_voyages) : helperText}
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

export default GareAutocomplete;
