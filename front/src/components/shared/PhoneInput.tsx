import React, { useCallback, useEffect, useState } from 'react';
import { Box, Chip, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';
import {
  formatPhoneForDisplay,
  formatPhoneInput,
  getOperatorName,
  isDisplayFormat,
  normalizePhoneNumber,
  validatePhoneNumber,
} from '@/utils/phoneUtils';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export interface PhoneInputProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  storageFormat?: boolean;
  showOperator?: boolean;
  validateOnBlur?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  storageFormat = false,
  showOperator = false,
  validateOnBlur = true,
  error: externalError,
  helperText: externalHelperText,
  ...textFieldProps
}) => {
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = useState('');
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (value) {
      if (!isDisplayFormat(value)) {
        setDisplayValue(formatPhoneForDisplay(value));
      } else {
        setDisplayValue(value);
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const formatted = formatPhoneInput(inputValue);
      setDisplayValue(formatted);
      if (internalError) {
        setInternalError(null);
      }
      if (storageFormat) {
        const normalized = normalizePhoneNumber(formatted);
        onChange(normalized ?? formatted);
      } else {
        onChange(formatted);
      }
    },
    [onChange, storageFormat, internalError],
  );

  const handleBlur = useCallback(() => {
    if (validateOnBlur && displayValue) {
      const validation = validatePhoneNumber(displayValue);
      if (!validation.isValid) {
        setInternalError(validation.message ?? t(Labels.ui_phoneinput_invalid));
      } else {
        setInternalError(null);
      }
    }
  }, [displayValue, validateOnBlur, t]);

  const handleFocus = useCallback(() => {
    if (internalError) {
      setInternalError(null);
    }
  }, [internalError]);

  const hasError = Boolean(externalError ?? internalError);
  const helperText = internalError ?? externalHelperText ?? t(Labels.ui_phoneinput_helper);
  const operatorName = showOperator && displayValue ? getOperatorName(displayValue) : null;

  return isMounted ? (
    <Box>
      <TextField
        {...textFieldProps}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        error={hasError}
        helperText={helperText}
        placeholder="034 00 000 00"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color={hasError ? 'error' : 'action'} />
              </InputAdornment>
            ),
            ...textFieldProps.slotProps?.input,
          },
          htmlInput: {
            inputMode: 'tel',
            type: 'tel',
            ...textFieldProps.slotProps?.htmlInput,
          },
        }}
      />
      {showOperator && operatorName && operatorName !== 'Unknown' && (
        <Box sx={{ mt: 1 }}>
          <Chip
            label={`${t(Labels.ui_phoneinput_operator)}: ${operatorName}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  ) : null;
};

export default PhoneInput;
