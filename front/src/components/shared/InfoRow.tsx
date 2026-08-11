import React from 'react';
import { Stack, Typography } from '@mui/material';

interface InfoRowProps {
  icon: React.ReactNode;
  text: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ icon, text }) => (
  <Stack
    direction="row"
    spacing={1}
    sx={{
      alignItems: 'center',
    }}
  >
    {icon}
    <Typography variant="body2" color="text.primary" noWrap>
      {text}
    </Typography>
  </Stack>
);
