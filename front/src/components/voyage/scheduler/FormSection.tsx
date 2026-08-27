import React from 'react';
import { Box, Typography } from '@mui/material';

export interface FormSectionProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, badge, action, children }) => {
  const titleNode =
    typeof title === 'string' ? (
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    ) : (
      title
    );

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          {icon}
          {titleNode}
          {badge}
        </Box>
        {action}
      </Box>
      {children}
    </Box>
  );
};

export default FormSection;
