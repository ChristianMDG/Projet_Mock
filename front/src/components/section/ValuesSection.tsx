import React from 'react';
import { Box, Card, CardContent, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import { Icon } from '@/shared/IconMapper';
import { ValuesSection as ValuesSectionType } from '@/api/dynamic-page.api';

interface Props {
  section: ValuesSectionType;
  sx?: SxProps<Theme>;
}

const ValuesSection: React.FC<Props> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.values-section">
      {section.title && (
        <Typography variant="h3" component="h2" gutterBottom>
          {section.title}
        </Typography>
      )}
      <Grid container spacing={3}>
        {section.values.map(value => (
          <Grid size={{ xs: 12, md: 6 }} key={value.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                  {value.icon && <Icon iconName={value.icon} />}
                  <Typography variant="h6">{value.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {value.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ValuesSection;
