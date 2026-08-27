import React, { useState, useEffect } from 'react';
import { useMediaQuery, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHeroContent } from '@/hooks/cms.hooks';
import { HeroBackgroundContainer, HeroSectionContainer } from '@/components/ui/HeroSection';
import HeroLoadingSkeleton from '@/skeleton/HeroLoadingSkeleton';
import { HERO_DIMENSIONS } from '@/constants/hero.constants';
import MissingContent from '@/components/shared/MissingContent';
import vacancesEn from '@/assets/madagascar_vacances_en.png';
import vacancesFr from '@/assets/madagascar_vacances_fr.png';
import vacancesMg from '@/assets/madagascar_vacances_mg.png';

const VACANCES_IMAGES: Record<string, string> = {
  en: vacancesEn,
  fr: vacancesFr,
  mg: vacancesMg,
};

const IndependenceHeroContent: React.FC = () => {
  const { data: content, isLoading } = useHeroContent();
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme => theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if ((mounted ? isMobileQuery : false) && isLoading) {
    return <HeroLoadingSkeleton />;
  }

  if (!content?.data || Object.keys(content.data).length === 0) {
    return <MissingContent componentName="Hero Content" />;
  }

  const { Title } = content.data;
  const vacancesImage = VACANCES_IMAGES[i18n.language] ?? vacancesFr;

  return (
    <HeroSectionContainer component="section" aria-label={Title} sx={HERO_DIMENSIONS}>
      <HeroBackgroundContainer>
        <Box
          component="img"
          src={vacancesImage}
          alt={`Madagascar Vacances - ${i18n.language.toUpperCase()}`}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </HeroBackgroundContainer>
    </HeroSectionContainer>
  );
};

export default IndependenceHeroContent;
