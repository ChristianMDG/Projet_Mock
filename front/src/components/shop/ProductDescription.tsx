import React, { memo } from 'react';
import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/models/Shop';
import Labels from '@/labelKeys.json';

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const { t } = useTranslation();
  const hasDescription = Boolean(product.description);

  if (hasDescription) {
    return (
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          {t(Labels.ui_description)}
        </Typography>
        <Typography
          variant="body2"
          component="div"
          dangerouslySetInnerHTML={{ __html: product.description! }}
          sx={{
            lineHeight: 1.6,
            '& p': { m: 0, mb: 1.5 },
            '& ul, & ol': { pl: 2.5, m: 0, mb: 1.5 },
            '& li': { mb: 0.75 },
            '& strong': { color: 'text.primary', fontWeight: 600 },
          }}
        />
      </Paper>
    );
  }

  return null;
};

export default memo(ProductDescription);
