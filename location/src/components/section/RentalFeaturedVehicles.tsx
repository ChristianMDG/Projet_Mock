import React from 'react';
import { Box, Container, Typography, Grid, Button, type SxProps, type Theme } from '@mui/material';
import type { RentalFeaturedVehicles as RentalFeaturedVehiclesType } from '@/api/dynamic-page.api';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Link as RouterLink } from 'react-router-dom';

import ArrowForward from '@mui/icons-material/ArrowForward';
import VehicleCard from './VehicleCard';

interface RentalFeaturedVehiclesProps {
  section: RentalFeaturedVehiclesType;
  sx?: SxProps<Theme>;
}

const RentalFeaturedVehicles: React.FC<RentalFeaturedVehiclesProps> = ({ section, sx }) => {
  const { t } = useTranslation();
  const { title, subtitle, vehicles, showViewAllButton, viewAllLabel, viewAllUrl, backgroundColor, containerMaxWidth } =
    section;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: backgroundColor ?? 'background.paper', ...sx }}>
      <Container maxWidth={containerMaxWidth ?? 'lg'}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            mb: { xs: 4, md: 6 },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {title}
            </Typography>
            {Boolean(subtitle) && (
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 600 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {showViewAllButton && viewAllUrl && (
            <Button
              component={RouterLink}
              to={viewAllUrl}
              variant="outlined"
              color="primary"
              endIcon={<ArrowForward />}
            >
              {viewAllLabel ?? t(Labels.rental_featured_view_all)}
            </Button>
          )}
        </Box>

        {Boolean(vehicles?.length) && (
          <Grid container spacing={4}>
            {vehicles.map(vehicle => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vehicle.id}>
                <VehicleCard vehicle={vehicle} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default RentalFeaturedVehicles;
