import React from 'react';
import { Box, Typography, CardContent, CardMedia } from '@mui/material';
import type { RentalCategoryItem } from '@/api/dynamic-page.api';

import { DynamicIcon } from '@/components/ui';

interface CategoryCardContentProps {
  category: RentalCategoryItem;
}

const CategoryCardContent: React.FC<CategoryCardContentProps> = ({ category }) => {
  const { label, description, icon, color, image, imageUrl } = category;
  const displayImage = image?.data?.url ?? imageUrl;
  const hasImage = Boolean(displayImage);
  const cardColor = color ?? 'primary.main';

  return (
    <>
      {hasImage && (
        <CardMedia component="img" height="160" image={displayImage} alt={label} sx={{ objectFit: 'cover' }} />
      )}
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ color: cardColor, mb: 2 }}>
          <DynamicIcon name={icon} fallback="DirectionsCar" sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        {Boolean(description) && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </>
  );
};

export default CategoryCardContent;
