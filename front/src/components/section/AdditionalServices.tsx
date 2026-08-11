import React from 'react';
import { Box, Divider, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import { Icon } from '@/shared/IconMapper';
import type { AdditionalServices as AdditionalServicesType, AdditionalServiceItem } from '@/api/dynamic-page.api';

interface AdditionalServicesProps {
  section: AdditionalServicesType;
  sx?: SxProps<Theme>;
}

const AdditionalServices: React.FC<AdditionalServicesProps> = ({ section, sx }) => {
  return (
    <Box sx={{ ...sx }} data-section={section.__component}>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h3" component="h2" gutterBottom>
        {section.title}
      </Typography>
      <Grid container spacing={3}>
        {section.services.map((service: AdditionalServiceItem) => (
          <Grid size={{ xs: 12, md: 4 }} key={`service-${service.id}`}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Icon iconName={service.icon} color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                {service.title}
              </Typography>
              <Typography variant="body2">{service.description}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdditionalServices;
