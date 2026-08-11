import React from 'react';
import { Alert, AlertTitle, Box, Card, CardContent, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import type { ContactItem, EmergencyContacts as EmergencyContactsType } from '@/api/dynamic-page.api';
import { Icon } from '@/shared/IconMapper';

interface EmergencyContactsProps {
  section: EmergencyContactsType;
  sx?: SxProps<Theme>;
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.emergency-contacts">
      <Typography variant="h3" component="h2" gutterBottom>
        {section.title}
      </Typography>
      <Card>
        <CardContent>
          {section.alertMessage && (
            <Alert severity={section.alertType ?? 'warning'} sx={{ mb: 3 }}>
              {section.alertTitle && <AlertTitle>{section.alertTitle}</AlertTitle>}
              {section.alertMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            {section.contacts.map((contact: ContactItem) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`contact-${contact.id}`}>
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  <Icon iconName={contact.icon} color="primary" sx={{ mb: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {contact.name}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {contact.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {contact.available}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmergencyContacts;
