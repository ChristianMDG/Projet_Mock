import React from 'react';
import { Box, Typography, Paper, alpha } from '@mui/material';
import type { RentalStepItem } from '@/api/dynamic-page.api';
import { DynamicIcon } from '@/components/ui';

interface RentalStepCardProps {
  step: RentalStepItem;
  index: number;
  total: number;
}

const RentalStepCard: React.FC<RentalStepCardProps> = ({ step, index, total }) => {
  const { stepNumber, title, description, icon, color } = step;
  const stepColor = color ?? 'primary.main';
  const isLast = index === total - 1;

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          bgcolor: 'transparent',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme => `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}`,
            mb: 3,
            position: 'relative',
          }}
        >
          <DynamicIcon name={icon} fallback="CheckCircle" sx={{ fontSize: 48, color: stepColor }} />
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              right: -10,
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: stepColor,
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '3px solid',
              borderColor: 'background.paper',
            }}
          >
            {stepNumber}
          </Box>
        </Box>
        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Paper>

      {!isLast && (
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            top: 60,
            left: 'calc(50% + 40px)',
            width: 'calc(100% - 80px)',
            borderTop: '2px dashed',
            borderColor: 'divider',
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default RentalStepCard;
