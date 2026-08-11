import React from 'react';
import { Box, Card, Typography, type SxProps, type Theme } from '@mui/material';
import { MissionSection as MissionSectionType } from '@/api/dynamic-page.api';

interface Props {
  section: MissionSectionType;
  sx?: SxProps<Theme>;
}

const MissionSection: React.FC<Props> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.mission-section">
      {section.title && (
        <Typography variant="h3" component="h2" gutterBottom>
          {section.title}
        </Typography>
      )}
      <Card sx={{ p: 3, bgcolor: 'primary.50' }}>
        {section.tagline && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            "{section.tagline}"
          </Typography>
        )}
        {section.description && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {section.description}
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default MissionSection;
