import React from 'react';
import { FormControl, FormHelperText, InputAdornment, InputLabel, Select } from '@mui/material';
import { useField } from 'formik';

interface FormSelectFieldProps {
  name: string;
  label: string;
  required?: boolean;
  startIcon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({
  name,
  label,
  required = false,
  startIcon,
  children,
  fullWidth = true,
}) => {
  const [field, meta] = useField(name);
  return (
    <FormControl fullWidth={fullWidth} error={meta.touched && !!meta.error}>
      <InputLabel required={required}>{label}</InputLabel>
      <Select
        {...field}
        label={label}
        startAdornment={startIcon ? <InputAdornment position="start">{startIcon}</InputAdornment> : undefined}
      >
        {children}
      </Select>
      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default FormSelectField;
