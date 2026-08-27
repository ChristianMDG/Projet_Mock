import React, { useState } from 'react';
import { Box, IconButton, Stack, Typography, alpha, Theme } from '@mui/material';
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
  boxShadow: 2,
  '&:hover': {
    bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.95),
    transform: 'translateY(-50%) scale(1.1)',
  },
  transition: 'transform 0.2s, background-color 0.2s',
} as const;

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, alt, badges }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = images.length;
  const hasImages = total > 0;
  const hasMultiple = total > 1;

  const go = (delta: number) => setActiveIndex(index => (index + delta + total) % total);

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'action.hover',
          overflow: 'hidden',
          aspectRatio: { xs: '1 / 1', md: '4 / 3' },
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {hasImages ? (
          <Box
            component="img"
            src={images[activeIndex]?.url}
            alt={alt}
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.03)',
              },
            }}
          />
        ) : (
          <Stack sx={{ width: 1, height: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h1" sx={{ color: 'text.disabled' }}>
              📦
            </Typography>
          </Stack>
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
      </Box>

      {hasMultiple && (
        <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 0.5 }}>
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <Box
                key={image.id ?? `${image.url}-${index}`}
                component="img"
                src={image.url}
                alt={`${alt} ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                sx={{
                  flex: '0 0 auto',
                  width: { xs: 64, md: 80 },
                  aspectRatio: '1 / 1',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  border: '2px solid',
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  opacity: isActive ? 1 : 0.65,
                  objectFit: 'cover',
                  display: 'block',
                  transform: isActive ? 'scale(1.05)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    opacity: 1,
                    transform: 'scale(1.05)',
                  },
                }}
              />
            );
          })}
        </Box>
      )}
    </Stack>
  );
};

export default ProductImageGallery;
