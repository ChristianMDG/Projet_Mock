import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <Box sx={{ mb: 4, textAlign: 'center' }}>
    <Typography
      variant="h3"
      component="h1"
      gutterBottom
      sx={{
        fontWeight: 700,
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default PageHeader;
