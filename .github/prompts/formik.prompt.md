---
agent: agent
---

# Formik + Yup Forms - Taxibrousse
**Note:** Prefer Formik + Yup for complex forms; for tiny forms prefer local state. Avoid mixing Formik with uncontrolled components or legacy validation patterns.

## Agent Instructions

- Prefer small, composable components; reuse `FormTextField`, `FormSelect` from `@/components/inputs/`
- Keep schemas concise; validate only what's needed
- Use positive conditions and early returns for validation logic
- Integrate with React Query for submit; surface server errors via `setFieldError`
- Use MUI v7, `sx` prop, and Grid v2
- **ALWAYS format after editing**: `cd front && npm run format`
- Import from `@/` for clean module resolution

## When to Use Formik

### ✅ Use For
- Complex forms (multiple fields, validation)
- Multi-step forms
- Dynamic forms
- Forms with async operations

### ❌ Simple Alternative
For 1-2 fields, use `useState` with MUI components.

## Form Structure

```
front/src/components/
├── forms/
│   ├── UserForm.tsx
│   ├── UserSearchForm.tsx
│   └── SelectedSeats.tsx
└── inputs/
    ├── FormTextField.tsx
    ├── FormAutocomplete.tsx
    ├── FormDatePickers.tsx
    └── FormCloudinaryUploader.tsx
```

## Basic Form Pattern

```tsx
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormTextField } from '@/components/inputs';

const schema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

const MyForm = ({ onSubmit }) => (
  <Formik
    initialValues={{ name: '', email: '' }}
    validationSchema={schema}
    onSubmit={async (values, { setSubmitting }) => {
      await onSubmit(values);
      setSubmitting(false);
    }}
  >
    {({ isSubmitting }) => (
      <Form>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FormTextField name="name" label="Name" fullWidth required />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextField name="email" label="Email" type="email" fullWidth required />
          </Grid>
        </Grid>
        <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Form>
    )}
  </Formik>
);
```

## FormTextField Component

```tsx
import { useField } from 'formik';
import { TextField, TextFieldProps } from '@mui/material';

type Props = { name: string } & Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'error' | 'helperText'>;

export const FormTextField: React.FC<Props> = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};
```

## Common Validation Schemas

```typescript
// Madagascar phone
const phoneSchema = Yup.string()
  .matches(/^(032|033|034|038)\s?\d{2}\s?\d{3}\s?\d{2}$/, 'Invalid phone')
  .required('Required');

// Password
const passwordSchema = Yup.string()
  .min(6, 'Min 6 characters')
  .required('Required');

// Email (optional)
const optionalEmailSchema = Yup.string()
  .email('Invalid email')
  .nullable();
```

## Integration with React Query

```tsx
const ReservationForm = () => {
  const createMutation = useCreateReservation();
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, { setFieldError }) => {
        try {
          await createMutation.mutateAsync(values);
        } catch (error) {
          if (error.field) {
            setFieldError(error.field, error.message);
          }
        }
      }}
    >
      {/* Form content */}
    </Formik>
  );
};
```

## Multi-Step Form

```tsx
const [step, setStep] = useState(0);
const schemas = [step1Schema, step2Schema, step3Schema];

<Formik
  initialValues={allStepsValues}
  validationSchema={schemas[step]}
  onSubmit={(values, helpers) => {
    if (step < schemas.length - 1) {
      setStep(step + 1);
      helpers.setTouched({});
    } else {
      submitFinalForm(values);
    }
  }}
>
```

## Existing Form Components

| Component | Location |
|-----------|----------|
| `FormTextField` | `components/inputs/` |
| `FormAutocomplete` | `components/inputs/` |
| `FormDatePickers` | `components/inputs/` |
| `FormCloudinaryUploader` | `components/inputs/` |
| `PhoneInput` | `components/shared/` |
| `VilleAutocomplete` | `components/shared/` |
