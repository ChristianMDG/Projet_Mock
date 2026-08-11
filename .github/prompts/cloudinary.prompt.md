---
agent: agent
---

# Cloudinary Media Management - Taxibrousse
**Note:** Remove deprecated upload patterns. Prefer unsigned client uploads for non-sensitive media and signed server-side uploads for protected assets. Keep `quality: 'auto'` and never expose secrets.

## Agent Instructions

- Write MINIMALIST code; use shortest syntax, positive conditions, early returns
- Reuse utilities from `@/utils/cloudinary.ts`
- Always use `quality: 'auto'` and `format: 'auto'` 
- Never expose API secrets to frontend
- **ALWAYS format frontend files**: `cd front && npm run format`
- Use `@/` imports for clean module resolution

## Integration Points

| Layer | Usage |
|-------|-------|
| CMS (Strapi) | Admin uploads, content images |
| Frontend | Display, user uploads (unsigned) |
| Backend | Signed uploads for sensitive media |

## Structure

```
cms/config/plugins.ts           # Cloudinary provider config
front/src/utils/cloudinary.ts   # URL builder utilities
front/src/components/shared/ImageMedia.tsx  # Optimized image
front/src/components/inputs/FormCloudinaryUploader.tsx  # Upload
```

## CMS Configuration

```typescript
// cms/config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: { folder: 'taxibrousse/cms' },
      },
    },
  },
});
```

## Frontend URL Builder

```typescript
// front/src/utils/cloudinary.ts
const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;

export const buildCloudinaryUrl = ({
  publicId, width, height, crop = 'scale', quality = 'auto', format = 'auto',
}: CloudinaryImageProps): string => {
  const transforms = [
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].filter(Boolean).join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
};
```

## Common Transformations

```typescript
export const imageTransformations = {
  thumbnail: (publicId: string, size = 150) =>
    buildCloudinaryUrl({ publicId, width: size, height: size, crop: 'fill' }),
  
  hero: (publicId: string, width = 1920) =>
    buildCloudinaryUrl({ publicId, width, height: Math.round(width * 0.4), crop: 'fill' }),
  
  profile: (publicId: string, size = 200) =>
    buildCloudinaryUrl({ publicId, width: size, height: size, crop: 'fill', gravity: 'face' }),
};
```

## Security

| Scenario | Approach |
|----------|----------|
| Public marketing images | Unsigned preset |
| User avatar (< 2MB) | Unsigned preset |
| Sensitive docs | Signed upload via backend |
| Large media (> 10MB) | Signed upload |

## Environment Variables

```env
# Frontend
VITE_CLOUDINARY_NAME=your_cloud_name

# CMS
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

## Best Practices

- Use width breakpoints: 320, 768, 1200, 1920
- Use `loading="lazy"` except for hero images
- Stable transformation order for CDN cache hits
- Max 6-7 variations per asset
