import { Typography, Paper, Grid, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface RentalDriverInfoStepProps {
  vehicleId: number;
  startParam: string;
  endParam: string;
  createRes: any;
  setReservation: (id: number) => void;
}

export default function RentalDriverInfoStep({
  vehicleId,
  startParam,
  endParam,
  createRes,
  setReservation,
}: RentalDriverInfoStepProps) {
  const { t } = useTranslation();

  const driverValidationSchema = Yup.object({
    firstName: Yup.string().required(t(Labels.authform_field_required)),
    lastName: Yup.string().required(t(Labels.authform_field_required)),
    phone: Yup.string().required(t(Labels.authform_field_required)),
    email: Yup.string().email(t(Labels.authform_email_invalid)).required(t(Labels.authform_field_required)),
  });

  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {t(Labels.rental_checkout_driver_title)}
      </Typography>
      <Formik
        initialValues={{ firstName: '', lastName: '', phone: '', email: '' }}
        validationSchema={driverValidationSchema}
        onSubmit={values => {
          createRes(
            {
              vehicleId,
              startDate: startParam,
              endDate: endParam,
              driverName: `${values.firstName} ${values.lastName}`,
              driverPhone: values.phone,
              driverEmail: values.email,
            },
            {
              onSuccess: (res: any) => {
                setReservation(res.id);
              },
            },
          );
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form id="driver-form">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="firstName"
                  label={t(Labels.authform_first_name)}
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && (errors.firstName as string)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="lastName"
                  label={t(Labels.authform_last_name)}
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && (errors.lastName as string)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="email"
                  label={t(Labels.rental_checkout_email)}
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && (errors.email as string)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="phone"
                  label={t(Labels.rental_checkout_phone)}
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && (errors.phone as string)}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
