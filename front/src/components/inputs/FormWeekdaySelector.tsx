import React from 'react';
import { Box, Chip } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

const weekdayOptions = [
  { value: 1, labelKey: 'voyage_weekday_monday' },
  { value: 2, labelKey: 'voyage_weekday_tuesday' },
  { value: 3, labelKey: 'voyage_weekday_wednesday' },
  { value: 4, labelKey: 'voyage_weekday_thursday' },
  { value: 5, labelKey: 'voyage_weekday_friday' },
  { value: 6, labelKey: 'voyage_weekday_saturday' },
  { value: 0, labelKey: 'voyage_weekday_sunday' },
];

interface FormWeekdaySelectorProps {
  name?: string;
  gap?: number;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

const FormWeekdaySelector: React.FC<FormWeekdaySelectorProps> = ({
  name = 'selectedWeekdays',
  flexWrap = 'wrap',
  gap = 1,
}) => {
  const { t } = useTranslation();
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <Box sx={{ display: 'flex', gap, flexWrap }}>
      {weekdayOptions.map(option => (
        <Chip
          key={option.value}
          label={t(option.labelKey)}
          variant={field.value.includes(option.value) ? 'filled' : 'outlined'}
          onClick={() => {
            const newValue = field.value.includes(option.value)
              ? field.value.filter((d: number) => d !== option.value)
              : [...field.value, option.value];
            setFieldValue(name, newValue);
          }}
          color={field.value.includes(option.value) ? 'primary' : 'default'}
        />
      ))}
    </Box>
  );
};

export default FormWeekdaySelector;
