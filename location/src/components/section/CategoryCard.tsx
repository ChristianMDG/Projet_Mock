import React from 'react';
import { Box, Card, CardActionArea } from '@mui/material';
import type { RentalCategoryItem } from '@/api/dynamic-page.api';
import { Link as RouterLink } from 'react-router-dom';
import CategoryCardContent from './CategoryCardContent';

const CategoryCard: React.FC<{ category: RentalCategoryItem }> = ({ category }) => {
  const { link } = category;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      {link ? (
        <CardActionArea
          component={RouterLink}
          to={link}
          sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        >
          <CategoryCardContent category={category} />
        </CardActionArea>
      ) : (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CategoryCardContent category={category} />
        </Box>
      )}
    </Card>
  );
};

export default CategoryCard;
