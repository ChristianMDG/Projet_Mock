import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, TextField, type SxProps, type Theme } from '@mui/material';
import type { RentalContactSection as RentalContactSectionType } from '@/api/dynamic-page.api';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import SupportAgent from '@mui/icons-material/SupportAgent';
import Phone from '@mui/icons-material/Phone';
import Email from '@mui/icons-material/Email';
import LocationOn from '@mui/icons-material/LocationOn';
import AccessTime from '@mui/icons-material/AccessTime';
import Send from '@mui/icons-material/Send';

interface RentalContactSectionProps {
  section: RentalContactSectionType;
  sx?: SxProps<Theme>;
}

const RentalContactSection: React.FC<RentalContactSectionProps> = ({ section, sx }) => {
  const { t } = useTranslation();
  const {
    title,
    subtitle,
    assistancePhone,
    servicePhone,
    email,
    address,
    openingHours,
    showContactForm,
    backgroundColor,
    containerMaxWidth,
  } = section;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: backgroundColor ?? 'background.default', ...sx }}>
      <Container maxWidth={containerMaxWidth ?? 'lg'}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            {title}
          </Typography>
          {Boolean(subtitle) && (
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 800, mx: 'auto' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: showContactForm ? 5 : 12 }}>
            <Box sx={{ pr: { md: 4 } }}>
              <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                {t(Labels.rental_contact_coordinates)}
              </Typography>

              {[
                {
                  condition: Boolean(assistancePhone),
                  icon: <SupportAgent fontSize="large" />,
                  title: t(Labels.rental_contact_assistance),
                  content: assistancePhone,
                },
                {
                  condition: Boolean(servicePhone),
                  icon: <Phone fontSize="large" />,
                  title: t(Labels.rental_contact_customer_service),
                  content: servicePhone,
                },
                {
                  condition: Boolean(email),
                  icon: <Email fontSize="large" />,
                  title: t(Labels.rental_contact_email),
                  content: email,
                },
                {
                  condition: Boolean(address),
                  icon: <LocationOn fontSize="large" />,
                  title: t(Labels.rental_contact_main_agency),
                  content: <span style={{ whiteSpace: 'pre-line' }}>{address}</span>,
                },
                {
                  condition: Boolean(openingHours),
                  icon: <AccessTime fontSize="large" />,
                  title: t(Labels.rental_contact_opening_hours),
                  content: <span style={{ whiteSpace: 'pre-line' }}>{openingHours}</span>,
                },
              ]
                .filter(item => item.condition)
                .map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <Box sx={{ color: 'primary.main', mt: 0.5 }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', mb: 0.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {item.content}
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Grid>

          {showContactForm && (
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  {t(Labels.rental_contact_write_to_us)}
                </Typography>
                <form onSubmit={e => e.preventDefault()}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label={t(Labels.rental_contact_first_name)} variant="outlined" required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label={t(Labels.rental_contact_last_name)} variant="outlined" required />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth label={t(Labels.email)} type="email" variant="outlined" required />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth label={t(Labels.rental_contact_subject)} variant="outlined" required />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label={t(Labels.rental_contact_message)}
                        multiline
                        rows={4}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button variant="contained" color="primary" size="large" type="submit" endIcon={<Send />}>
                        {t(Labels.rental_contact_send_message)}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default RentalContactSection;
