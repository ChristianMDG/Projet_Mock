import React, { useState, memo } from 'react';
import { Card, CardMedia, CardContent, IconButton, Stack, Typography, alpha, Theme } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import type { StrapiMedia } from '@/types/cms.types';

interface ProductImageGalleryProps {
  images: StrapiMedia[];
  alt: string;
  badges?: React.ReactNode;
}

const navSx = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.85),
  backdropFilter: 'blur(4px)',
  color: 'text.primary',
  '&:hover': {
    bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.95),
  },
} as const;

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, alt, badges }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = images.length;
  const hasImages = total > 0;
  const hasMultiple = total > 1;

  const go = (delta: number) => setActiveIndex(index => (index + delta + total) % total);

  return (
    <Stack spacing={2}>
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: { xs: '1 / 1', md: '4 / 3' },
        }}
      >
        {hasImages ? (
          <CardMedia
            component="img"
            image={images[activeIndex]?.url}
            alt={alt}
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
            }}
          />
        ) : (
          <CardContent
            sx={{
              width: 1,
              height: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h1" sx={{ color: 'text.disabled' }}>
              📦
            </Typography>
          </CardContent>
        )}

        {badges && (
          <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
            {badges}
          </Stack>
        )}

        {hasMultiple && (
          <>
            <IconButton size="small" aria-label="Previous image" onClick={() => go(-1)} sx={{ ...navSx, left: 12 }}>
              <ChevronLeft />
            </IconButton>
            <IconButton size="small" aria-label="Next image" onClick={() => go(1)} sx={{ ...navSx, right: 12 }}>
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Card>

      {hasMultiple && (
        <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 0.5 }}>
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <Card
                key={image.id ?? `${image.url}-${index}`}
                onClick={() => setActiveIndex(index)}
                sx={{
                  flex: '0 0 auto',
                  width: { xs: 64, md: 80 },
                  aspectRatio: '1 / 1',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  opacity: isActive ? 1 : 0.7,
                  ...(isActive && {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  }),
                }}
              >
                <CardMedia
                  component="img"
                  image={image.url}
                  alt={`${alt} ${index + 1}`}
                  sx={{
                    width: 1,
                    height: 1,
                    objectFit: 'cover',
                  }}
                />
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default memo(ProductImageGallery);
