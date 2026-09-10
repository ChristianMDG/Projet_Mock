import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';

export type FormTextFieldProps = TextFieldProps & {
  name: string;
  inputProps?: Record<string, unknown>;
  InputProps?: Record<string, unknown>;
};

export const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  helperText,
  inputProps,
  InputProps,
  slotProps,
  ...props
}) => {
  const [field, meta] = useField(name);

  return (
    <TextField
      fullWidth
      margin="dense"
      variant="outlined"
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error ? meta.error : helperText}
      slotProps={{
        ...(inputProps && { htmlInput: inputProps }),
        ...(InputProps && { input: InputProps }),
        ...slotProps,
      }}
    />
  );
};

export default FormTextField;
