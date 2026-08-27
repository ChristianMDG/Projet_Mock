import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import LocalOffer from '@mui/icons-material/LocalOffer';
import Star from '@mui/icons-material/Star';
import Timer from '@mui/icons-material/Timer';
import { useTranslation } from 'react-i18next';
import { usePromotionBanner } from '@/hooks/cms.hooks';
import Labels from '@/labelKeys.json';
import PromotionBannerSkeleton from '@/skeleton/PromotionBannerSkeleton';
import MissingContent from '@/components/shared/MissingContent';
import ImageMedia from '@/components/shared/ImageMedia';

const PromotionBanner: React.FC = () => {
  const { t } = useTranslation();
  const { data: content, isLoading } = usePromotionBanner();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && isLoading) {
    return <PromotionBannerSkeleton />;
  }

  if (!content?.data || Object.keys(content.data).length === 0 || !content.data.Active) {
    return <MissingContent componentName="Promotion Banner" />;
  }

  const { Title, SubTitle, Image } = content.data;

  return (
    <Card
      sx={{
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
        },
      }}
    >
      <CardContent sx={{ py: 3, position: 'relative', zIndex: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalOffer />
              <Chip
                label={t(Labels.loyalty_benefit_exclusive_offers)}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
                icon={<Star sx={{ color: 'white !important' }} />}
              />
              <Chip
                label={t(Labels.offers_book_now)}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 193, 7, 0.9)',
                  color: 'black',
                  fontWeight: 600,
                }}
                icon={<Timer />}
              />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {Title}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              {SubTitle}
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                alignItems: 'flex-start',
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                {t(Labels.discover_best_offers_from)}
              </Button>

              <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
                {t(Labels.offers_discount)}
              </Typography>
            </Stack>
          </Box>

          {Image && (
            <Box
              sx={{
                width: { xs: 80, sm: 120 },
                height: { xs: 80, sm: 120 },
                borderRadius: 2,
                overflow: 'hidden',
                flexShrink: 0,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <ImageMedia media={Image} />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PromotionBanner;
