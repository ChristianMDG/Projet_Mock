import React from 'react';
import { Box, Container, Typography, type SxProps, type Theme, alpha } from '@mui/material';
import type { RentalHeroSection as RentalHeroSectionType } from '@/api/dynamic-page.api';

interface RentalHeroSectionProps {
  section: RentalHeroSectionType;
  sx?: SxProps<Theme>;
}

const RentalHeroSection: React.FC<RentalHeroSectionProps> = ({ section, sx }) => {
  const { title, subtitle, backgroundImage, backgroundImageUrl, overlayOpacity = 0.5, backgroundColor } = section;

  const bgImage = backgroundImage?.data?.url ?? backgroundImageUrl;
  const hasBgImage = Boolean(bgImage);

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: { xs: '60vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        bgcolor: backgroundColor ?? 'background.default',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {hasBgImage && (
        <Box
          component="img"
          src={bgImage}
          alt={title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
      )}

      {hasBgImage && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: theme => alpha(theme.palette.common.black, overlayOpacity),
            zIndex: 1,
          }}
        />
      )}

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' },
          color: hasBgImage ? 'common.white' : 'text.primary',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            maxWidth: '800px',
            textShadow: theme => (hasBgImage ? `0 2px 10px ${alpha(theme.palette.common.black, 0.3)}` : 'none'),
          }}
        >
          {title}
        </Typography>

        {Boolean(subtitle) && (
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              maxWidth: '600px',
              fontWeight: 400,
              opacity: 0.9,
              textShadow: theme => (hasBgImage ? `0 1px 5px ${alpha(theme.palette.common.black, 0.3)}` : 'none'),
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default RentalHeroSection;
