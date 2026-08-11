import React from 'react';
import { Box, Chip } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const monthlyDateOptions = Array.from({ length: 31 }, (_, i) => i + 1);

interface FormMonthlyDateSelectorProps {
  name?: string;
  gap?: number;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  maxHeight?: number | string;
  chipSize?: 'small' | 'medium';
}

const FormMonthlyDateSelector: React.FC<FormMonthlyDateSelectorProps> = ({
  gap = 1,
  name = 'selectedMonthlyDates',
  flexWrap = 'wrap',
  maxHeight = 200,
  chipSize = 'small',
}) => {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <Box sx={{ display: 'flex', gap, flexWrap, maxHeight, overflow: 'auto' }}>
      {monthlyDateOptions.map(date => (
        <Chip
          key={date}
          label={date.toString()}
          variant={field.value.includes(date) ? 'filled' : 'outlined'}
          onClick={() => {
            const newValue = field.value.includes(date)
              ? field.value.filter((d: number) => d !== date)
              : [...field.value, date];
            setFieldValue(name, newValue);
          }}
          color={field.value.includes(date) ? 'primary' : 'default'}
          size={chipSize}
        />
      ))}
    </Box>
  );
};

export default FormMonthlyDateSelector;
