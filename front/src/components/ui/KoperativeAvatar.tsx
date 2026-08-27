import React from 'react';
import { Avatar, type SxProps, type Theme } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

interface KoperativeAvatarProps {
  logoUrl?: string | null;
  name?: string | null;
  size?: number;
  sx?: SxProps<Theme>;
  isSelected?: boolean;
}

export const KoperativeAvatar: React.FC<KoperativeAvatarProps> = ({
  logoUrl,
  name,
  size = 64,
  sx,
  isSelected = false,
}) => {
  const hasLogo = Boolean(logoUrl);

  const bgcolor = isSelected
    ? hasLogo
      ? 'background.paper'
      : 'primary.contrastText'
    : hasLogo
      ? 'grey.100'
      : 'primary.main';

  const color = isSelected ? (hasLogo ? 'text.primary' : 'primary.main') : hasLogo ? 'inherit' : 'primary.contrastText';

  return (
    <Avatar
      src={logoUrl ?? undefined}
      alt={name ?? 'Koperative'}
      sx={{
        width: size,
        height: size,
        bgcolor,
        color,
        ...sx,
      }}
    >
      {!logoUrl && <BusinessIcon fontSize={size >= 64 ? 'large' : 'medium'} />}
    </Avatar>
  );
};

export default KoperativeAvatar;
