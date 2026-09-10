import { useId } from 'react';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import TaxibrousseRedIcon from '@/components/ui/TaxibrousseRedIcon';
import StyledIcon from '@/components/ui/StyledIcon';

interface ComboBoxProps {
  id?: string;
}

export default function ComboBox({ id: providedId }: Readonly<ComboBoxProps>) {
  const { t } = useTranslation();
  const fallbackId = useId();

  return (
    <Autocomplete
      disabled
      id={providedId ?? `combobox-${fallbackId}`}
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
          margin="dense"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps?.input,
              startAdornment: (
                <InputAdornment position="start">
                  <StyledIcon icon={TaxibrousseRedIcon} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
