import React from 'react';
import { Box, Card, CardContent, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import { Icon } from '@/shared/IconMapper';
import type { MeasureItem, SafetyMeasures as SafetyMeasuresType } from '@/api/dynamic-page.api';

interface SafetyMeasuresProps {
  section: SafetyMeasuresType;
  sx?: SxProps<Theme>;
}

const SafetyMeasures: React.FC<SafetyMeasuresProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.safety-measures">
      <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4 }}>
        {section.title}
      </Typography>
      <Grid container spacing={3}>
        {section.measures.map((measure: MeasureItem) => (
          <Grid size={{ xs: 12, md: 6 }} key={`measure-${measure.id}`}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <Icon iconName={measure.icon} color="primary" />
                  <Typography variant="h6" component="h3">
                    {measure.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {measure.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SafetyMeasures;
