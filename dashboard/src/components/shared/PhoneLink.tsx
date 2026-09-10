import { Box, type SxProps, type Theme } from '@mui/material';

interface PhoneLinkProps {
  phone?: string | null;
  fallback?: string;
  sx?: SxProps<Theme>;
  stopPropagation?: boolean;
}

export default function PhoneLink({ phone, fallback = '-', sx, stopPropagation = false }: PhoneLinkProps) {
  if (phone && phone !== '-') {
    return (
      <Box
        component="a"
        href={`tel:${phone.replace(/\s+/g, '')}`}
        onClick={(e) => {
          if (stopPropagation) {
            e.stopPropagation();
          }
        }}
        sx={{
          fontWeight: 600,
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
          ...sx,
        }}
      >
        {phone}
      </Box>
    );
  }

  return <>{fallback}</>;
}
