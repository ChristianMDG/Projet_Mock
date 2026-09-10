import React, { memo } from 'react';
import { Typography, Paper, Chip, Stack, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/models/Shop';
import Labels from '@/labelKeys.json';

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product }) => {
  const { t } = useTranslation();
  const specs = product.specifications ?? [];
  const hasSpecs = specs.length > 0;
  const hasSku = Boolean(product.sku);
  const hasOrigin = Boolean(product.origin);
  const isBestSeller = Boolean(product.isBestSeller);
  const tags = product.tags ?? [];
  const hasTags = tags.length > 0;
  const hasMetadata = hasSku || hasOrigin || isBestSeller || hasTags;
  const hasContent = hasSpecs || hasMetadata;

  if (hasContent) {
    return (
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t(Labels.shop_specifications)}
        </Typography>

        {hasSpecs && (
          <Grid container spacing={2}>
            {specs.map((spec, i) => (
              <Grid key={`${spec.label}-${i}`} size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                  {spec.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                  {spec.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}

        {hasMetadata && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              mt: hasSpecs ? 2.5 : 0,
              pt: hasSpecs ? 2 : 0,
              borderTop: hasSpecs ? 1 : 0,
              borderColor: 'divider',
            }}
          >
            {hasSku && <Chip label={`SKU: ${product.sku}`} size="small" variant="outlined" />}
            {hasOrigin && (
              <Chip label={`${t(Labels.shop_origin)}: ${product.origin}`} size="small" variant="outlined" />
            )}
            {isBestSeller && <Chip label={t(Labels.shop_best_seller)} size="small" color="warning" />}
            {hasTags && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center', ml: 0.5 }}>
                {tags.map(tag => {
                  const label = tag.startsWith('#') ? tag : `#${tag}`;
                  return (
                    <Typography
                      key={tag}
                      variant="caption"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {label}
                    </Typography>
                  );
                })}
              </Stack>
            )}
          </Stack>
        )}
      </Paper>
    );
  }

  return null;
};

export default memo(ProductSpecifications);
