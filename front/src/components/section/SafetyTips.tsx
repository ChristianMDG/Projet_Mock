import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, type SxProps, type Theme } from '@mui/material';
import type { SafetyTips as SafetyTipsType } from '@/api/dynamic-page.api';
import { Icon } from '@/shared/IconMapper';

interface SafetyTipsProps {
  section: SafetyTipsType;
  sx?: SxProps<Theme>;
}

const SafetyTips: React.FC<SafetyTipsProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.safety-tips">
      <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4 }}>
        {section.title}
      </Typography>
      <List>
        {section.tips.map(tip => (
          <ListItem key={tip.id}>
            <ListItemIcon>
              <Icon iconName={tip.icon ?? 'CheckCircle'} color="success" />
            </ListItemIcon>
            <ListItemText primary={tip.title} secondary={tip.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SafetyTips;
