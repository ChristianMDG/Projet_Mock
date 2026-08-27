import React from 'react';
import { Box, Typography, Table, TableBody, TableRow, TableCell, Paper, Divider, Chip } from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/models/Shop';
import Labels from '@/labelKeys.json';

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product }) => {
  const { t } = useTranslation();
  const specs = product.specifications ?? [];

  if (specs.length === 0) return null;

  return (
    <Box sx={{ mt: 6 }}>
      <Divider sx={{ mb: 4 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <InfoOutlined color="primary" />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t(Labels.shop_specifications)}
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <Table>
          <TableBody>
            {specs.map((spec, i) => (
              <TableRow key={spec.label} sx={{ bgcolor: i % 2 === 0 ? 'action.hover' : 'transparent' }}>
                <TableCell sx={{ fontWeight: 600, width: '35%', color: 'text.secondary', border: 'none', py: 1.5 }}>
                  {spec.label}
                </TableCell>
                <TableCell sx={{ border: 'none', py: 1.5 }}>{spec.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Product metadata */}
      <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
        {product.sku && <Chip label={`SKU: ${product.sku}`} size="small" variant="outlined" />}
        {product.origin && (
          <Chip label={`${t(Labels.shop_origin)}: ${product.origin}`} size="small" variant="outlined" />
        )}
        {product.isBestSeller && <Chip label={t(Labels.shop_best_seller)} size="small" color="warning" />}
      </Box>
    </Box>
  );
};

export default ProductSpecifications;
