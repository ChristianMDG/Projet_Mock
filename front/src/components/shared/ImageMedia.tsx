import type { StrapiMedia } from '@/types/cms.types';
import { Box, CardMedia, type SxProps, type Theme } from '@mui/material';
import React, { useMemo } from 'react';

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
  /** Explicit width to prevent CLS (unsized-images audit) */
  width?: number | string;
  /** Custom sx props */
  sx?: SxProps<Theme>;
  /** Responsive Cloudinary transformation preset */
  responsivePreset?: 'none' | 'banner';
}

const isCloudinaryUrl = (imageUrl?: string): boolean => {
  return Boolean(imageUrl?.includes('res.cloudinary.com') && imageUrl?.includes('/upload/'));
};

const withCloudinaryTransform = (imageUrl: string, transform: string): string => {
  return imageUrl.replace('/upload/', `/upload/${transform}/`);
};

const getBannerCloudinarySources = (imageUrl?: string) => {
  const hasCloudinaryUrl = Boolean(imageUrl) && isCloudinaryUrl(imageUrl);

  if (hasCloudinaryUrl && imageUrl) {
    return {
      mobile: withCloudinaryTransform(imageUrl, 'f_auto,q_auto:good,dpr_auto,c_fill,g_auto,w_1080,h_1350'),
      tablet: withCloudinaryTransform(imageUrl, 'f_auto,q_auto:good,dpr_auto,c_fill,g_auto,w_1536,h_1024'),
      desktop: withCloudinaryTransform(imageUrl, 'f_auto,q_auto:good,dpr_auto,c_fill,g_auto,w_2560,h_960'),
    };
  }

  return undefined;
};

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
  width,
  sx,
  responsivePreset = 'none',
}) => {
  const { formats = {}, url, alternativeText, caption, name } = media ?? {};

  const alt = useMemo(() => {
    return altText ?? alternativeText ?? caption ?? name ?? 'Image';
  }, [altText, alternativeText, caption, name]);

  const smallUrl = useMemo(() => formats?.small?.url, [formats]);
  const mediumUrl = useMemo(() => formats?.medium?.url, [formats]);
  const largeUrl = useMemo(() => formats?.large?.url, [formats]);

  const bannerSources = useMemo(() => {
    if (responsivePreset === 'banner') {
      return getBannerCloudinarySources(url);
    }

    return undefined;
  }, [responsivePreset, url]);

  const hasMultiple = useMemo(() => {
    return [smallUrl, mediumUrl, largeUrl].filter(Boolean).length > 1;
  }, [smallUrl, mediumUrl, largeUrl]);

  const cardImage = useMemo(() => {
    return bannerSources?.desktop ?? smallUrl ?? mediumUrl ?? largeUrl ?? url;
  }, [bannerSources, smallUrl, mediumUrl, largeUrl, url]);

  const showCloudinaryBannerSources = useMemo(() => {
    return Boolean(bannerSources);
  }, [bannerSources]);

  // CardMedia variant for use in Card components
  if (variant === 'card') {
    return (
      <CardMedia
        component="img"
        image={cardImage}
        alt={alt}
        height={height}
        width={width ?? '100%'}
        className={className}
        sx={sx}
        loading={loading}
        fetchPriority={fetchPriority}
      />
    );
  }

  if (showCloudinaryBannerSources && bannerSources) {
    return (
      <Box component="picture" sx={{ lineHeight: 0, ...sx }}>
        <source media="(max-width: 599px)" srcSet={bannerSources.mobile} />
        <source media="(min-width: 600px) and (max-width: 1199px)" srcSet={bannerSources.tablet} />
        <source media="(min-width: 1200px)" srcSet={bannerSources.desktop} />
        <Box
          component="img"
          src={bannerSources.desktop}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={className}
          fetchPriority={fetchPriority}
          width={width}
          height={height}
          sx={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </Box>
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
          width={width}
          height={height}
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
      width={width}
      height={height}
      sx={{ width: '100%', height: 'auto', display: 'block', ...sx }}
    />
  );
};

export default ImageMedia;
