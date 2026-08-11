import React from 'react';
import { Box, Paper, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import { NetworkSection as NetworkSectionType } from '@/api/dynamic-page.api';

interface Props {
  section: NetworkSectionType;
  sx?: SxProps<Theme>;
}

const NetworkSection: React.FC<Props> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.network-section">
      {section.title && (
        <Typography variant="h3" component="h2" gutterBottom>
          {section.title}
        </Typography>
      )}
      {section.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {section.description}
        </Typography>
      )}

      <Grid container spacing={2}>
        {section.regions.map(region => (
          <Grid size={{ xs: 12, md: 4, sm: 6 }} key={region.id}>
            <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ApartmentRoundedIcon color="primary" />
              <Typography variant="h5" color="primary">
                {region.name?.toUpperCase()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NetworkSection;
