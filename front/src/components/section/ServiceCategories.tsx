import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { Icon } from '@/shared/IconMapper';
import type {
  ServiceCategories as ServiceCategoriesType,
  ServiceCategory,
  ServiceCategoryItem,
} from '@/api/dynamic-page.api';

interface ServiceCategoriesProps {
  section: ServiceCategoriesType;
  sx?: SxProps<Theme>;
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section={section.__component}>
      {section.title && (
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4 }}>
          {section.title}
        </Typography>
      )}
      <Grid container spacing={4}>
        {section.categories.map((category: ServiceCategory) => (
          <Grid size={{ xs: 12, md: 6 }} key={`category-${category.id}`}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2, color: `${category.color}.main` }}>
                    <Icon iconName={category.icon} />
                  </Box>
                  <Typography variant="h5">{category.title}</Typography>
                </Box>
                <List>
                  {category.services.map((service: ServiceCategoryItem, serviceIndex: number) => (
                    <ListItem key={`${category.id}-service-${serviceIndex}`} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Star fontSize="small" color={category.color} />
                      </ListItemIcon>
                      <ListItemText primary={service.text} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServiceCategories;
