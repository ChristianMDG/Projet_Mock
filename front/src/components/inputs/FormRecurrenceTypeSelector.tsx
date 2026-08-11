import React from 'react';
import Labels from '@/labelKeys.json';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { RecurrenceTypeEnum } from '@/models/enums';

interface FormRecurrenceTypeSelectorProps {
  name?: string;
  fullWidth?: boolean;
  row?: boolean;
}

const FormRecurrenceTypeSelector: React.FC<FormRecurrenceTypeSelectorProps> = ({
  name = 'recurrenceType',
  fullWidth = true,
  row = true,
}) => {
  const { t } = useTranslation();
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <FormControl component="fieldset" fullWidth={fullWidth} sx={{ mb: 2 }}>
      <RadioGroup value={field.value} row={row} onChange={e => setFieldValue(name, e.target.value)}>
        <FormControlLabel
          value={RecurrenceTypeEnum.ONE_OFF}
          control={<Radio />}
          label={t(Labels.voyage_recurrence_one_off)}
        />
        <FormControlLabel
          value={RecurrenceTypeEnum.DAILY}
          control={<Radio />}
          label={t(Labels.voyage_recurrence_daily)}
        />
        <FormControlLabel
          value={RecurrenceTypeEnum.WEEKLY}
          control={<Radio />}
          label={t(Labels.voyage_recurrence_weekly)}
        />
        <FormControlLabel
          value={RecurrenceTypeEnum.MONTHLY}
          control={<Radio />}
          label={t(Labels.voyage_recurrence_monthly)}
        />
        <FormControlLabel
          value={RecurrenceTypeEnum.CUSTOM}
          control={<Radio />}
          label={t(Labels.voyage_recurrence_custom)}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default FormRecurrenceTypeSelector;
