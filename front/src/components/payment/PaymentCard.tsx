import React from 'react';
import { Avatar, Grid } from '@mui/material';

interface PaymentCardProps {
  logoUrl: string;
  logoAlt: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ logoUrl, logoAlt }) => {
  return (
    <Grid size="auto">
      <Avatar
        src={logoUrl}
        alt={logoAlt}
        sx={{
          width: { xs: 45, xm: 55, sm: 65 },
          height: { xs: 45, xm: 55, sm: 65 },
          boxShadow: { xs: 0, xm: 1 },
          bgcolor: 'grey.100',
        }}
      />
    </Grid>
  );
};

export default PaymentCard;
