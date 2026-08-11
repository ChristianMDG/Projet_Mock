import { Box, Typography, Avatar } from '@mui/material';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  /** MUI color token (e.g. 'primary.main') used for the Avatar background. Defaults to 'primary.main'. */
  color?: string;
  size?: 'small' | 'medium';
}

export default function SectionHeader({
  icon,
  title,
  subtitle,
  color = 'primary.main',
  size = 'medium',
}: SectionHeaderProps) {
  const dim = size === 'small' ? 36 : 42;
  const titleSize = size === 'small' ? '1rem' : '1.5rem';
  const variant = size === 'small' ? ('h6' as const) : ('h4' as const);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar
        sx={{
          bgcolor: color,
          width: dim,
          height: dim,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant={variant} sx={{ fontWeight: 700, fontSize: titleSize }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
