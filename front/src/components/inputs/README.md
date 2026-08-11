# Form Components Documentation

This directory contains reusable form components built with Formik hooks and Material-UI. All components follow consistent patterns and can be configured through props.

## Components Overview

### Core Form Components

#### FormTextField

A flexible text input component with full customization options.

```tsx
<FormTextField
  name="description"
  label="Description"
  placeholder="Enter description..."
  multiline
  rows={4}
  helperText="Optional helper text"
  required
/>
```

**Props:**

- `name` (required): Field name for Formik
- `label` (required): Input label
- `type?`: Input type (default: 'text')
- `multiline?`: Enable multiline mode
- `rows?`: Number of rows for multiline
- `required?`: Mark field as required
- `disabled?`: Disable the field
- `fullWidth?`: Full width (default: true)
- `placeholder?`: Placeholder text
- `variant?`: Material-UI variant ('outlined' | 'filled' | 'standard')
- `inputProps?`: Additional input properties
- `helperText?`: Helper text below the field

#### FormAutocomplete

Generic autocomplete component for object selection.

```tsx
<FormAutocomplete<User>
  name="assignedUser"
  label="Assigned User"
  options={users}
  getOptionLabel={user => `${user.firstName} ${user.lastName}`}
  placeholder="Select a user..."
  required
/>
```

**Props:**

- `name` (required): Field name for Formik
- `label` (required): Input label
- `options` (required): Array of options
- `getOptionLabel` (required): Function to get label from option
- `required?`: Mark field as required
- `disabled?`: Disable the field
- `fullWidth?`: Full width (default: true)
- `placeholder?`: Placeholder text
- `helperText?`: Helper text below the field

#### FormDateTimePicker & FormDatePicker

Date and time selection components.

```tsx
<FormDateTimePicker
  name="departureTime"
  label="Departure Time"
  required
/>

<FormDatePicker
  name="birthDate"
  label="Birth Date"
  helperText="Select your birth date"
/>
```

**Props:**

- `name` (required): Field name for Formik
- `label` (required): Input label
- `required?`: Mark field as required
- `disabled?`: Disable the field
- `fullWidth?`: Full width (default: true)
- `helperText?`: Helper text below the field
- `variant?`: Material-UI variant ('outlined' | 'filled' | 'standard')

### Specialized Form Components

#### FormRecurrenceTypeSelector

Radio group for selecting voyage recurrence types.

```tsx
<FormRecurrenceTypeSelector name="recurrenceType" fullWidth={false} row={false} />
```

**Props:**

- `name?`: Field name (default: 'recurrenceType')
- `fullWidth?`: Full width (default: true)
- `row?`: Display in row (default: true)

#### FormWeekdaySelector

Chip-based weekday selection for weekly recurrence.

```tsx
<FormWeekdaySelector name="selectedDays" gap={2} flexWrap="nowrap" />
```

**Props:**

- `name?`: Field name (default: 'selectedWeekdays')
- `gap?`: Gap between chips (default: 1)
- `flexWrap?`: Flex wrap behavior (default: 'wrap')

#### FormMonthlyDateSelector

Chip-based date selection for monthly recurrence.

```tsx
<FormMonthlyDateSelector name="selectedDates" maxHeight={300} chipSize="medium" />
```

**Props:**

- `name?`: Field name (default: 'selectedMonthlyDates')
- `gap?`: Gap between chips (default: 1)
- `flexWrap?`: Flex wrap behavior (default: 'wrap')
- `maxHeight?`: Maximum height (default: 200)
- `chipSize?`: Chip size ('small' | 'medium', default: 'small')

## Usage Patterns

### Basic Form Setup

```tsx
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormTextField, FormAutocomplete } from '@/components/form';

const validationSchema = Yup.object({
  name: Yup.string().required(),
  category: Yup.object().nullable().required(),
});

function MyForm() {
  return (
    <Formik
      initialValues={{ name: '', category: null }}
      validationSchema={validationSchema}
      onSubmit={values => console.log(values)}
    >
      <Form>
        <FormTextField name="name" label="Name" required />
        <FormAutocomplete<Category>
          name="category"
          label="Category"
          options={categories}
          getOptionLabel={cat => cat.name}
          required
        />
      </Form>
    </Formik>
  );
}
```

### Custom Field Names

All components support custom field names through props:

```tsx
// Instead of hardcoded field names, use props
<FormWeekdaySelector name="workingDays" />
<FormMonthlyDateSelector name="paymentDates" />
<FormRecurrenceTypeSelector name="scheduleType" />
```

## Architecture Notes

### Formik Integration

- All components use `useField` hook for field state management
- Components that need form actions use `useFormikContext` hook
- Error handling and validation display is built-in

### Material-UI Integration

- Components follow Material-UI v5+ patterns
- Support for theming and customization
- Responsive design considerations

### TypeScript Support

- Full TypeScript support with proper generic types
- Interface definitions for all props
- Type-safe option handling for autocomplete components

### Internationalization

- Components that display text use `useTranslation` hook
- Translation keys follow the project's naming conventions
- Weekday names are properly localized

## Contributing

When adding new form components:

1. Follow the existing naming convention: `Form[ComponentName]`
2. Use Formik hooks (`useField`, `useFormikContext`)
3. Include proper TypeScript interfaces
4. Support common props like `name`, `label`, `required`, `disabled`
5. Handle error display consistently
6. Add documentation to this README
7. Export from `index.ts`

## Testing

Each component should be tested for:

- Proper Formik integration
- Error state handling
- Prop customization
- Accessibility features
- Material-UI theme compatibility
