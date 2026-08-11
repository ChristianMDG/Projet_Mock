import React from 'react';
import { Avatar, type SxProps, type Theme } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

interface KoperativeAvatarProps {
  logoUrl?: string | null;
  name?: string | null;
  size?: number;
  sx?: SxProps<Theme>;
}

export const KoperativeAvatar: React.FC<KoperativeAvatarProps> = ({ logoUrl, name, size = 64, sx }) => {
  return (
    <Avatar
      src={logoUrl ?? undefined}
      alt={name ?? 'Koperative'}
      sx={{
        width: size,
        height: size,
        bgcolor: logoUrl ? 'grey.100' : 'primary.main',
        color: logoUrl ? 'inherit' : 'primary.contrastText',
        ...sx,
      }}
    >
      {!logoUrl && <BusinessIcon fontSize={size >= 64 ? 'large' : 'medium'} />}
    </Avatar>
  );
};

export default KoperativeAvatar;
