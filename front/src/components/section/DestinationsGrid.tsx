import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import type { DestinationItem, DestinationsGrid as DestinationsGridType } from '@/api/dynamic-page.api';

interface DestinationsGridProps {
  section: DestinationsGridType;
  sx?: SxProps<Theme>;
}

const DestinationsGrid: React.FC<DestinationsGridProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.destinations-grid">
      <Typography variant="h3" component="h2" gutterBottom>
        {section.title}
      </Typography>
      {section.subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {section.subtitle}
        </Typography>
      )}
      <Grid container spacing={3}>
        {section.destinations.map((destination: DestinationItem) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={destination.id}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {destination.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {destination.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`${destination.duration}`} color="primary" size="small" />
                    <Chip label={`${destination.frequency}`} color="secondary" size="small" />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DestinationsGrid;
