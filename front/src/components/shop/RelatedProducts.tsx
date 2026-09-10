import React, { memo, useMemo } from 'react';
import { Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/models/Shop';
import { useProducts } from '@/hooks/cms.hooks';
import ProductCard from './ProductCard';
import { ScrollableRow } from '@/components/ui';
import Labels from '@/labelKeys.json';

interface RelatedProductsProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ product, onProductClick }) => {
  const { t } = useTranslation();
  const { data: allProducts = [] } = useProducts();

  const relatedProducts = useMemo(() => {
    const fromIds = (product.relatedProductIds ?? [])
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => Boolean(p));

    if (fromIds.length > 0) {
      return fromIds.slice(0, 10);
    }

    if (product.category?.slug) {
      return allProducts.filter(p => p.category?.slug === product.category?.slug && p.id !== product.id).slice(0, 10);
    }

    return [];
  }, [allProducts, product]);

  const hasRelated = relatedProducts.length > 0;

  if (hasRelated) {
    return (
      <Stack spacing={2} sx={{ mt: 5 }}>
        <Typography variant="h6">{t(Labels.shop_related_products)}</Typography>
        <ScrollableRow sxList={{ alignItems: 'stretch' }}>
          {relatedProducts.map(p => (
            <Stack
              key={p.id}
              sx={{
                flex: '0 0 auto',
                width: { xs: 220, sm: 250, md: 270 },
              }}
            >
              <ProductCard product={p} onClick={onProductClick} />
            </Stack>
          ))}
        </ScrollableRow>
      </Stack>
    );
  }

  return null;
};

export default memo(RelatedProducts);
