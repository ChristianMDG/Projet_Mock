export const optimizeCloudinaryUrl = (url?: string, { width, height }: { width?: number; height?: number } = {}) => {
  const isValidUrl = Boolean(url);

  if (isValidUrl) {
    const isCloudinary = url!.includes('res.cloudinary.com');
    const hasTransforms = /\/upload\/[fwq]_/.test(url!);
    const canOptimize = isCloudinary && hasTransforms === false;

    if (canOptimize) {
      const transforms = ['f_auto', 'q_auto', 'c_fill', width ? `w_${width}` : '', height ? `h_${height}` : '']
        .filter(Boolean)
        .join(',');

      return url!.replace('/upload/', `/upload/${transforms}/`);
    }

    return url;
  }

  return '';
};
