import React from 'react';
import { Box, Button, Card, CardContent, Chip, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import ImageMedia from '@/components/shared/ImageMedia';
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useReservation } from '@/hooks/reservation.hook';
import type { PopularDestinations as PopularDestinationsType } from '@/api/dynamic-page.api';

interface PopularDestinationsProps {
  section: PopularDestinationsType;
  sx?: SxProps<Theme>;
}

const PopularDestinations: React.FC<PopularDestinationsProps> = ({ section, sx }) => {
  const { t } = useTranslation();
  const { handleRouteReservation, isLoading } = useReservation();

  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.popular-destinations">
      <Typography variant="h3" component="h2" gutterBottom>
        {section.title}
      </Typography>
      {section.subtitle && (
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          {section.subtitle}
        </Typography>
      )}

      <Grid container spacing={3}>
        {section.destinations.map(destination => (
          <Grid size={{ xs: 12, md: 4 }} key={destination.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
                position: 'relative',
              }}
            >
              {destination.image && (
                <ImageMedia media={destination.image} variant="card" height={200} altText={destination.route} />
              )}
              <Chip
                label={destination.frequency}
                color="primary"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {destination.route}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {destination.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">
                    <strong>{t(Labels.duration_label)}</strong> {destination.duration}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {destination.price}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Search />}
                  size="small"
                  disabled={isLoading}
                  onClick={() => handleRouteReservation(destination.route)}
                >
                  {t(Labels.search_find_koperativa)}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularDestinations;
