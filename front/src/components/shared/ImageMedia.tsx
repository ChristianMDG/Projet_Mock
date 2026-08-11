import type { StrapiMedia } from '@/types/cms.types';
import { Box, CardMedia, type SxProps, type Theme } from '@mui/material';
import React from 'react';

interface ImageMediaProps {
  media: StrapiMedia;
  className?: string;
  altText?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Display as MUI CardMedia component */
  variant?: 'default' | 'card';
  /** Height for CardMedia variant */
  height?: number | string;
  /** Custom sx props */
  sx?: SxProps<Theme>;
}

// Lightweight responsive <picture> wrapper for Strapi media.
// Prefers largest available size for the <img> fallback while supplying
// progressively larger sources via media queries.
const ImageMedia: React.FC<ImageMediaProps> = ({
  media,
  className,
  altText,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  variant = 'default',
  height,
  sx,
}) => {
  const { formats = {}, url, alternativeText, caption, name } = media ?? {};
  const alt = altText ?? alternativeText ?? caption ?? name ?? 'Image';

  const smallUrl = formats?.small?.url;
  const mediumUrl = formats?.medium?.url;
  const largeUrl = formats?.large?.url;

  const hasMultiple = [smallUrl, mediumUrl, largeUrl].filter(Boolean).length > 1;

  // CardMedia variant for use in Card components
  if (variant === 'card') {
    return (
      <CardMedia
        component="img"
        image={largeUrl ?? mediumUrl ?? smallUrl ?? url}
        alt={alt}
        height={height}
        className={className}
        sx={sx}
      />
    );
  }

  if (hasMultiple) {
    return (
      <Box component="picture" sx={{ lineHeight: 0, ...sx }}>
        {smallUrl && <source media="(max-width: 599px)" srcSet={smallUrl} />}
        {mediumUrl && <source media="(min-width: 600px) and (max-width: 1199px)" srcSet={mediumUrl} />}
        {largeUrl && <source media="(min-width: 1200px)" srcSet={largeUrl} />}
        <Box
          component="img"
          src={url}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={className}
          fetchPriority={fetchPriority}
          sx={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={url}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={className}
      fetchPriority={fetchPriority}
      sx={{ width: '100%', height: 'auto', display: 'block', ...sx }}
    />
  );
};

export default ImageMedia;
