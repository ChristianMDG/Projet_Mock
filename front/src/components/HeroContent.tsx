import React, { useState, useEffect } from 'react';
import { Typography, useMediaQuery } from '@mui/material';
import { useHeroContent } from '@/hooks/cms.hooks';
import { HeroBackgroundContainer, HeroContentPanel, HeroSectionContainer } from '@/components/ui/HeroSection';
import ImageMedia from '@/components/shared/ImageMedia';
import RichText from '@/components/shared/RichText';
import WelcomeMessage from '@/components/shared/WelcomeMessage';
import { useWelcomeMessageVisible } from '@/hooks/auth.hooks';
import HeroLoadingSkeleton from '@/skeleton/HeroLoadingSkeleton';
import { HERO_DIMENSIONS } from '@/constants/hero.constants';
import MissingContent from '@/components/shared/MissingContent';

const HeroContent: React.FC = () => {
  const { data: content, isLoading } = useHeroContent();
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme => theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });
  const showWelcome = useWelcomeMessageVisible();

  useEffect(() => {
    setMounted(true);
  }, []);

  if ((mounted ? isMobileQuery : false) && isLoading) {
    return <HeroLoadingSkeleton />;
  }

  if (!content?.data || Object.keys(content.data).length === 0) {
    return <MissingContent componentName="Hero Content" />;
  }

  const { Title, SubTitle, Destination, Description, Image } = content.data;
  return (
    <HeroSectionContainer component="section" aria-label={Title} sx={HERO_DIMENSIONS}>
      <HeroBackgroundContainer>
        <ImageMedia
          media={Image}
          variant="card"
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
          Réservation TAXIBROUSSE
        </Typography>

        {showWelcome ? (
          <WelcomeMessage />
        ) : (
          <>
            <Typography variant="h2" sx={{ color: 'common.white' }}>
              {Title}
            </Typography>
            <Typography variant="h5" component="h3" sx={{ mb: 2, color: 'secondary.main', fontWeight: 600 }}>
              {SubTitle}
            </Typography>
            {Destination && (
              <Typography variant="h6" component="h4" sx={{ mb: 1, color: 'secondary.light', fontWeight: 500 }}>
                {Destination}
              </Typography>
            )}
            <Typography variant="body1">
              <RichText content={Description} />
            </Typography>
          </>
        )}
      </HeroContentPanel>
    </HeroSectionContainer>
  );
};

export default HeroContent;
