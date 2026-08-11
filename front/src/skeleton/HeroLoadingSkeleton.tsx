import { useState, useEffect } from 'react';
import { HeroBackgroundContainer, HeroContentPanel, HeroSectionContainer } from '@/components';
import { Skeleton, useMediaQuery, useTheme } from '@mui/material';

export const HERO_DIMENSIONS = {
  height: { xs: '40vh', sm: '45vh', md: '50vh' },
  minHeight: { xs: 320, sm: 380, md: 400 },
};

const HeroLoadingSkeleton: React.FC = () => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use false during SSR to match server render
  const isMobile = mounted ? isMobileQuery : false;

  return (
    <HeroSectionContainer component="section" sx={HERO_DIMENSIONS}>
      <HeroBackgroundContainer>
        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: 'grey.300' }} />
      </HeroBackgroundContainer>
      <HeroContentPanel component="article">
        <Skeleton variant="text" width="30%" height={isMobile ? 24 : 32} sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="80%" height={isMobile ? 36 : 56} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={isMobile ? 24 : 32} sx={{ mb: 2 }} />
        {!isMobile && <Skeleton variant="text" width="90%" height={24} />}
      </HeroContentPanel>
    </HeroSectionContainer>
  );
};

export default HeroLoadingSkeleton;
