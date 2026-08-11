import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { Email, LocationOn, Phone, Facebook } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import type { Contact as ContactType, ContactMethod } from '@/api/dynamic-page.api';

interface ContactProps {
  section: ContactType;
  sx?: SxProps<Theme>;
}

const Contact: React.FC<ContactProps> = ({ section, sx }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ mb: 6, ...sx }} data-section="page.contact-section">
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: 'center', bgcolor: 'primary.50', borderRadius: 2 }}>
              <Typography variant="h3" component="h2" gutterBottom>
                {section.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {section.description}
              </Typography>
            </Box>
            <List>
              {section.contactMethods.map((info: ContactMethod) => (
                <ListItem key={info.id} sx={{ p: 0 }}>
                  <ListItemIcon>
                    {info.type === 'phone' && <Phone color="primary" />}
                    {info.type === 'email' && <Email color="primary" />}
                    {info.type === 'address' && <LocationOn color="primary" />}
                  </ListItemIcon>
                  <ListItemText primary={info.label} secondary={info.value} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: 'center', bgcolor: 'primary.50', borderRadius: 2 }}>
              <Facebook
                sx={{
                  fontSize: 48,
                  color: theme => (theme.palette.mode === 'dark' ? 'white' : '#1877F2'),
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                {t(Labels.contact_facebook_title)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t(Labels.contact_facebook_description)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Facebook />}
                href="https://www.facebook.com/profile.php?id=61570079625295"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(Labels.contact_facebook_button)}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Contact;
