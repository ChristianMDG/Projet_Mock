import { Autocomplete, TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';

interface FormAutocompleteProps<T> {
  name: string;
  label: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  fullWidth?: boolean;
}

function FormAutocomplete<T>({
  name,
  label,
  options,
  getOptionLabel,
  required = false,
  disabled = false,
  placeholder,
  helperText,
  fullWidth = true,
}: FormAutocompleteProps<T>) {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <Autocomplete<T>
      options={options}
      getOptionLabel={getOptionLabel}
      value={field.value ?? null}
      onChange={(_, value) => setFieldValue(name, value)}
      disabled={disabled}
      fullWidth={fullWidth}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? meta.error : helperText}
          required={required}
        />
      )}
    />
  );
}

export default FormAutocomplete;
