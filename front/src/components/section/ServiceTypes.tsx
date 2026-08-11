import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import type { FeatureItem, ServiceItem, ServiceTypes as ServiceTypesType } from '@/api/dynamic-page.api';

interface ServiceTypesProps {
  section: ServiceTypesType;
  sx?: SxProps<Theme>;
}

const ServiceTypes: React.FC<ServiceTypesProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.service-types">
      <Typography variant="h3" component="h2" gutterBottom>
        {section.title}
      </Typography>
      <Grid container spacing={3}>
        {section.services.map((service: ServiceItem) => (
          <Grid size={{ xs: 12, md: 4 }} key={service.id}>
            <Card sx={{ height: '100%', border: 2, borderColor: `${service.color}.main` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Chip label={service.name} color={service.color} sx={{ mb: 2, fontWeight: 'bold' }} />
                <Typography variant="h6" color="primary" gutterBottom>
                  {service.price}
                </Typography>
                {service.features?.length ? (
                  <List dense>
                    {service.features.map((feature: FeatureItem) => (
                      <ListItem key={feature.id} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Info fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.title}
                          secondary={feature.description}
                          slotProps={{
                            secondary: { variant: 'caption', color: 'text.secondary' },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <>Build FEATURES from api call</>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServiceTypes;
