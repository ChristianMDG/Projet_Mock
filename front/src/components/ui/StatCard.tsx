import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Icon } from '@/shared/IconMapper';

interface StatCardProps {
  iconName?: string;
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ iconName, value, label }) => {
  return (
    <Card
      elevation={0}
      sx={{
        textAlign: 'center',
        height: '100%',
        borderRadius: 3,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ padding: '16px !important' }}>
        <Icon iconName={iconName} size="large" sx={{ width: 32, height: 32, mx: 'auto', mb: 1 }} />
        <Typography
          variant="h3"
          color="primary"
          gutterBottom
          sx={{
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
