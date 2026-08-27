import React, { useEffect, useState } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HeroBackgroundContainer, HeroContentPanel, HeroSectionContainer } from '@/components/ui/HeroSection';
import HeroLoadingSkeleton from '@/skeleton/HeroLoadingSkeleton';
import { HERO_DIMENSIONS } from '@/constants/hero.constants';
import MissingContent from '@/components/shared/MissingContent';
import ImageMedia from '@/components/shared/ImageMedia';
import { useSectionByComponent } from '@/hooks/dynamic-page.hooks';
import { SECTION_TYPES } from '@/constants/section.types';
import type { PaymentSection } from '@/api/dynamic-page.api';
import { useShopBanner } from '@/hooks/cms.hooks';
import Labels from '@/labelKeys.json';

interface ShopBannerProps {
  onBrowse?: () => void;
}

const ShopBanner: React.FC<ShopBannerProps> = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: sectionData } = useSectionByComponent(SECTION_TYPES.PAYMENT_SECTION);
  const paymentMethods = (sectionData?.data as PaymentSection)?.paymentMethods;
  const { data: bannerResponse, isLoading } = useShopBanner();
  const banner = bannerResponse?.data;

  if (mounted && isLoading) {
    return <HeroLoadingSkeleton />;
  }

  const isBannerHidden = banner?.isActive === false;
  if (isBannerHidden) return null;

  const hasBannerData = Boolean(banner) && Object.keys(banner ?? {}).length > 0;
  if (!hasBannerData) {
    return <MissingContent componentName="Shop Banner" />;
  }

  const hasPaymentMethods = Boolean(paymentMethods?.length);
  const title = banner?.title ?? t(Labels.shop_banner_title);
  const subtitle = banner?.subtitle ?? t(Labels.shop_banner_subtitle);

  return (
    <HeroSectionContainer component="section" aria-label={title} sx={HERO_DIMENSIONS}>
      {banner?.backgroundImage && (
        <HeroBackgroundContainer>
          <ImageMedia
            media={banner.backgroundImage}
            responsivePreset="banner"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </HeroBackgroundContainer>
      )}

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
          {t(Labels.shop_banner_badge)}
        </Typography>

        <Typography variant="h2" sx={{ color: 'common.white', mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="caption" component="h6" sx={{ mb: 2, color: 'secondary.main', fontWeight: 600 }}>
          {subtitle}
        </Typography>

        {hasPaymentMethods && (
          <Stack spacing={1} sx={{ mt: 3, alignItems: 'flex-start' }}>
            <Typography variant="caption" sx={{ color: 'common.white', opacity: 0.75 }}>
              {t(Labels.shop_payment_methods_label)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {paymentMethods?.map(method => (
                <Avatar
                  key={method.id}
                  src={method.logo?.url}
                  alt={method.logo?.alternativeText ?? method.name}
                  sx={{ width: 32, height: 32, bgcolor: 'background.paper' }}
                />
              ))}
            </Stack>
          </Stack>
        )}
      </HeroContentPanel>
    </HeroSectionContainer>
  );
};

export default ShopBanner;
