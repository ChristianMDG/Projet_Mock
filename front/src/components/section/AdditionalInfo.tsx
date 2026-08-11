import React from 'react';
import { Alert, Box, Typography, type SxProps, type Theme } from '@mui/material';
import { Icon } from '@/shared/IconMapper';
import type { AdditionalInfo as AdditionalInfoType, AdditionalInfoItem } from '@/api/dynamic-page.api';

interface AdditionalInfoProps {
  section: AdditionalInfoType;
  sx?: SxProps<Theme>;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section={section.__component}>
      <Alert severity={section.alertType} sx={{ mb: 3 }}>
        <Typography variant="body1">
          <strong>Important :</strong> {section.alertMessage}
        </Typography>
      </Alert>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        {section.title}
      </Typography>

      {section.items.map((item: AdditionalInfoItem) => (
        <Box
          key={`additional-info-${item.id}`}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 2,
            gap: 1,
          }}
        >
          <Icon iconName={item.icon} color="primary" sx={{ mt: 0.5 }} />
          <Typography variant="body1">
            <strong>{item.label} :</strong> {item.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AdditionalInfo;
