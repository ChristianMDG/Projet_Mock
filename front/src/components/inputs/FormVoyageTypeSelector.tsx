import React from 'react';
import Labels from '@/labelKeys.json';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { VoyageTypeEnum } from '@/models/enums';

interface FormVoyageTypeSelectorProps {
  name?: string;
  fullWidth?: boolean;
  row?: boolean;
}

const FormVoyageTypeSelector: React.FC<FormVoyageTypeSelectorProps> = ({
  name = 'typeVoyage',
  fullWidth = true,
  row = true,
}) => {
  const { t } = useTranslation();
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <FormControl component="fieldset" fullWidth={fullWidth}>
      <FormLabel component="legend">{t(Labels.voyage_type_label)}</FormLabel>
      <RadioGroup value={field.value} row={row} onChange={e => setFieldValue(name, e.target.value)} sx={{ mt: 1 }}>
        <FormControlLabel
          value={VoyageTypeEnum.NATIONAL}
          control={<Radio />}
          label={t(Labels.enum_voyage_type_national)}
        />
        <FormControlLabel
          value={VoyageTypeEnum.REGIONAL}
          control={<Radio />}
          label={t(Labels.enum_voyage_type_regional)}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default FormVoyageTypeSelector;
