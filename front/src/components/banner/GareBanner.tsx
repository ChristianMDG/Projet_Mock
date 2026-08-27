import React, { useState, useEffect } from 'react';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { HeroBackgroundContainer, HeroContentPanel, HeroSectionContainer } from '@/components/ui/HeroSection';
import HeroLoadingSkeleton from '@/skeleton/HeroLoadingSkeleton';
import { HERO_DIMENSIONS } from '@/constants/hero.constants';
import MissingContent from '@/components/shared/MissingContent';
import ImageMedia from '@/components/shared/ImageMedia';
import { useGareBanner } from '@/hooks/cms.hooks';
import { HideOnMobile } from '@/shared';

const GareBanner: React.FC = () => {
  const { data: content, isLoading } = useGareBanner();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = mounted ? isMobileQuery : false;

  if (mounted && isLoading) {
    return <HeroLoadingSkeleton />;
  }

  if (!content?.data || Object.keys(content.data).length === 0) {
    return <MissingContent componentName="Gare Banner" />;
  }

  const { Title, SubTitle, Localisation, Description, Image } = content.data;

  return (
    <HeroSectionContainer component="section" aria-label={Title} sx={HERO_DIMENSIONS}>
      <HeroBackgroundContainer>
        <ImageMedia
          media={Image}
          responsivePreset="banner"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </HeroBackgroundContainer>

      <HeroContentPanel component="article">
        <Typography
          variant="overline"
          sx={{
            display: 'inline-block',
            fontWeight: 800,
            letterSpacing: '0.08em',
            opacity: 0.9,
            mb: 1.5,
            color: 'secondary.light',
          }}
        >
          TAXIBROUSSE
        </Typography>

        <Typography variant="h2" sx={{ color: 'common.white' }}>
          {Title}
        </Typography>

        <Typography variant="h5" component="h3" sx={{ mb: 2, color: 'secondary.main', fontWeight: 600 }}>
          {SubTitle}
        </Typography>

        <HideOnMobile mobile={isMobile}>
          <>
            {Localisation && (
              <Typography variant="h6" sx={{ mb: 1, color: 'secondary.light', fontWeight: 500 }}>
                {Localisation}
              </Typography>
            )}

            {Description && (
              <Typography variant="body1" sx={{ color: 'common.white', opacity: 0.9 }}>
                {Description}
              </Typography>
            )}
          </>
        </HideOnMobile>
      </HeroContentPanel>
    </HeroSectionContainer>
  );
};

export default GareBanner;
