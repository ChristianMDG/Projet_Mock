import React from 'react';
import { Box } from '@mui/material';
import { HeroBackgroundContainer, HeroSectionContainer } from '@/components/ui/HeroSection';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useVoyageSearchStore } from '@/stores/voyage-search.store';
import { useVilleDetailByVilleId } from '@/hooks/ville-detail.hooks';

const VoyageWeeklyBanner: React.FC = () => {
  const { t } = useTranslation();
  const fromVille = useVoyageSearchStore(state => state.fromVille);
  const { data: villeDetailData } = useVilleDetailByVilleId(fromVille?.id ?? 0);

  const BANNER_DIMENSIONS = {
    height: { xs: 75, sm: 110, md: 140 },
  };

  const title = t(Labels.voyage_search_title);

  return (
    <HeroSectionContainer
      component="section"
      aria-label={title}
      sx={{ ...BANNER_DIMENSIONS, borderRadius: 2, mb: { xs: 2, sm: 3 } }}
    >
      <HeroBackgroundContainer>
        <Box
          component="img"
          src={villeDetailData?.data?.ImageGalery?.[0]?.url ?? '/weekly-voyage-rect-banner.png'}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </HeroBackgroundContainer>
    </HeroSectionContainer>
  );
};

export default VoyageWeeklyBanner;
