import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { useField, useFormikContext } from 'formik';
import dayjs, { DATE_FORMATS } from '@/utils/dayjs';

interface FormDateTimePickerProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
}

export function FormDateTimePicker({
  name,
  label,
  required = false,
  disabled = false,
  fullWidth = true,
  helperText,
  variant = 'outlined',
}: FormDateTimePickerProps) {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <DateTimePicker
      label={label}
      value={field.value ? dayjs.tz(field.value, 'Indian/Antananarivo') : null}
      onChange={value => setFieldValue(name, value?.tz('Indian/Antananarivo').format(DATE_FORMATS.DATETIME_API) ?? '')}
      disabled={disabled}
      timezone="Indian/Antananarivo"
      slotProps={{
        textField: {
          fullWidth,
          variant,
          error: meta.touched && !!meta.error,
          helperText: meta.touched && meta.error ? meta.error : helperText,
          required: required,
        },
      }}
    />
  );
}

interface FormDatePickerProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
}

export function FormDatePicker({
  name,
  label,
  required = false,
  disabled = false,
  fullWidth = true,
  helperText,
  variant = 'outlined',
}: FormDatePickerProps) {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <DatePicker
      label={label}
      value={field.value ? dayjs.tz(field.value, 'Indian/Antananarivo') : null}
      onChange={value => setFieldValue(name, value?.tz('Indian/Antananarivo').format(DATE_FORMATS.DATE_API) ?? '')}
      disabled={disabled}
      timezone="Indian/Antananarivo"
      slotProps={{
        textField: {
          fullWidth,
          variant,
          error: meta.touched && !!meta.error,
          helperText: meta.touched && meta.error ? meta.error : helperText,
          required: required,
        },
      }}
    />
  );
}
