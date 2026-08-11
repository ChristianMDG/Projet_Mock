import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { Icon } from '@/shared/IconMapper';
import type { HelpArticle, HelpCategory, HelpCenterSection as HelpCenterSectionType } from '@/api/dynamic-page.api';

interface HelpCenterSectionProps {
  section: HelpCenterSectionType;
  sx?: SxProps<Theme>;
}

const HelpCenterSection: React.FC<HelpCenterSectionProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.help-center-section">
      <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4 }}>
        {section.title}
      </Typography>

      <Grid container spacing={4}>
        {section.categories.map((category: HelpCategory) => (
          <Grid key={`category-${category.id}`} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {category.icon && <Icon iconName={category.icon} color="primary" sx={{ fontSize: 32, mr: 2 }} />}
                  <Typography variant="h6" component="h3">
                    {category.name}
                  </Typography>
                </Box>

                {category.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                )}

                {Boolean(category.articles?.length) && (
                  <List dense>
                    {category.articles.map((article: HelpArticle) => (
                      <ListItem key={`article-${article.id}`} sx={{ px: 0 }}>
                        <ListItemText primary={article.title} secondary={article.content} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HelpCenterSection;
