import { useId } from 'react';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { TaxibrousseRedIcon } from '../ui';

interface ComboBoxProps {
  id?: string;
}

export default function ComboBox({ id: providedId }: ComboBoxProps) {
  const { t } = useTranslation();

  return (
    <Autocomplete
      disabled
      id={providedId ?? `combobox-${useId()}`}
      disablePortal
      value={{ label: t(Labels.voyage_search_one_way) }}
      options={[
        { label: t(Labels.voyage_search_one_way) },
        { label: t(Labels.voyage_search_round_trip) },
        { label: t(Labels.voyage_search_multi_destination) },
      ]}
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      renderInput={params => (
        <TextField
          {...params}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <TaxibrousseRedIcon sx={{ width: 16 }} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
