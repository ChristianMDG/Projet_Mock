import React from 'react';
import { Box, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import { StatisticsSection as StatisticsSectionType } from '@/api/dynamic-page.api';
import StatCard from '@/components/ui/StatCard';

interface Props {
  section: StatisticsSectionType;
  sx?: SxProps<Theme>;
}

const StatisticsSection: React.FC<Props> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.statistics-section">
      {section.title && (
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 600 }}>
          {section.title}
        </Typography>
      )}
      <Grid
        container
        spacing={3}
        sx={{
          justifyContent: 'center',
        }}
      >
        {section.statistics?.map(stat => (
          <Grid size={{ xs: 6, sm: 6, md: 3 }} key={stat.id}>
            <StatCard iconName={stat.icon} value={stat.value} label={stat.label} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatisticsSection;
