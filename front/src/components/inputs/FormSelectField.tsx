import React from 'react';
import { FormControl, FormHelperText, InputAdornment, InputLabel, Select } from '@mui/material';
import { useField } from 'formik';
import StyledIcon from '@/components/ui/StyledIcon';

interface FormSelectFieldProps {
  name: string;
  label: string;
  required?: boolean;
  startIcon?: React.ReactNode | React.ElementType;
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

  const renderStartIcon = () => {
    if (startIcon) {
      if (React.isValidElement(startIcon)) {
        return startIcon;
      }
      return <StyledIcon icon={startIcon as React.ElementType} />;
    }
    return undefined;
  };

  const renderedIcon = renderStartIcon();

  return (
    <FormControl fullWidth={fullWidth} error={meta.touched && Boolean(meta.error)} margin="dense">
      <InputLabel required={required}>{label}</InputLabel>
      <Select
        {...field}
        label={label}
        startAdornment={renderedIcon ? <InputAdornment position="start">{renderedIcon}</InputAdornment> : undefined}
      >
        {children}
      </Select>
      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default FormSelectField;
