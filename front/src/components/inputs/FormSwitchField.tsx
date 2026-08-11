import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { useField } from 'formik';

interface FormSwitchFieldProps {
  name: string;
  label: string;
  disabled?: boolean;
}

const FormSwitchField: React.FC<FormSwitchFieldProps> = ({ name, label, disabled = false }) => {
  const [field] = useField({ name, type: 'checkbox' });
  return <FormControlLabel control={<Switch {...field} checked={field.value} disabled={disabled} />} label={label} />;
};

export default FormSwitchField;
