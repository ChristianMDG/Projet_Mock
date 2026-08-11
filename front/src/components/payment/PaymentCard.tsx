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
          width: 65,
          height: 65,
          boxShadow: 1,
          bgcolor: 'grey.100',
        }}
      />
    </Grid>
  );
};

export default PaymentCard;
