import { TextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';

interface FormTextFieldProps {
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  inputProps?: Record<string, unknown>;
  InputProps?: Record<string, unknown>;
  helperText?: string;
  fullWidth?: boolean;
  placeholder?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  slotProps?: TextFieldProps['slotProps'];
}

function FormTextField({
  name,
  label,
  type = 'text',
  multiline = false,
  rows,
  required = false,
  disabled = false,
  inputProps,
  InputProps,
  helperText,
  fullWidth = true,
  placeholder,
  variant = 'outlined',
  slotProps,
}: FormTextFieldProps) {
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      fullWidth={fullWidth}
      label={label}
      placeholder={placeholder}
      type={type}
      variant={variant}
      multiline={multiline}
      rows={rows}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error ? meta.error : helperText}
      required={required}
      disabled={disabled}
      slotProps={{
        ...(inputProps && { htmlInput: inputProps }),
        ...(InputProps && { input: InputProps }),
        ...slotProps,
      }}
    />
  );
}

export default FormTextField;
