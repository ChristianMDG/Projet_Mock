import { PickersTextFieldProps } from '@mui/x-date-pickers';

/**
 * Default slotProps for DatePicker and DateTimePicker components
 * Provides consistent styling across the application
 */
export const defaultDatePickerSlotProps = {
  textField: {
    fullWidth: true,
    sx: {
      '& .MuiInputBase-root': {
        borderRadius: 2,
      },
    },
  } as Partial<PickersTextFieldProps>,
};

/**
 * Merge custom slotProps with default DatePicker slotProps
 * @param customSlotProps - Custom slotProps to merge with defaults
 * @returns Merged slotProps
 */
export const mergeDatePickerSlotProps = (customSlotProps?: { textField?: Partial<PickersTextFieldProps> }) => {
  if (customSlotProps?.textField) {
    return {
      textField: {
        ...defaultDatePickerSlotProps.textField,
        ...customSlotProps.textField,
        sx: {
          ...defaultDatePickerSlotProps.textField.sx,
          ...customSlotProps.textField.sx,
        },
      },
    };
  }

  return defaultDatePickerSlotProps;
};
