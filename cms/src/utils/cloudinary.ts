/**
 * Cloudinary configuration utility
 * Shared configuration between frontend and CMS
 */

export const CLOUDINARY_CONFIG = {
  cloudName: 'dm4m7evkz',
  folder: 'taxibrousse',
};

/**
 * Common image transformations used in the frontend
 */
export const COMMON_TRANSFORMATIONS = {
  taxiBrousseThumb: {
    width: 125,
    gravity: 'auto',
    crop: 'auto',
  },
  offerImage: {
    width: 300,
    height: 200,
    gravity: 'auto',
    crop: 'fill',
  },
  heroImage: {
    width: 800,
    height: 400,
    gravity: 'auto',
    crop: 'fill',
  },
};

/**
 * Generate Cloudinary URL with transformations
 */
export const generateCloudinaryUrl = (
  publicId: string,
  transformation?: keyof typeof COMMON_TRANSFORMATIONS
) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  
  if (transformation && COMMON_TRANSFORMATIONS[transformation]) {
    const params = COMMON_TRANSFORMATIONS[transformation];
    const transformString = Object.entries(params)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    return `${baseUrl}/${transformString}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
};
