import React from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { Icon } from '@/shared/IconMapper';
import type { CallToAction as CallToActionType } from '@/api/dynamic-page.api';

interface CallToActionProps {
  cta: CallToActionType;
}

const CallToAction: React.FC<CallToActionProps> = ({ cta }) => {
  const handleClick = () => {
    if (cta.buttonUrl.startsWith('http')) {
      globalThis.open(cta.buttonUrl, '_blank');
    } else {
      globalThis.location.href = cta.buttonUrl;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        textAlign: 'center',
        bgcolor: cta.backgroundColor ?? 'background.paper',
        borderRadius: 2,
      }}
      data-section={cta.__component}
    >
      <Typography variant="h5" gutterBottom>
        {cta.title}
      </Typography>
      {cta.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {cta.description}
        </Typography>
      )}
      <Button
        variant={cta.buttonVariant}
        color={cta.buttonColor}
        size="large"
        startIcon={<Icon iconName={cta.buttonIcon} />}
        onClick={handleClick}
      >
        {cta.buttonText}
      </Button>
    </Paper>
  );
};

export default CallToAction;
