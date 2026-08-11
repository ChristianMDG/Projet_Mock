import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { Article, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { NewsSection as NewsSectionType, NewsItem } from '@/api/dynamic-page.api';

interface NewsSectionProps {
  section: NewsSectionType;
  sx?: SxProps<Theme>;
}

const NewsSection: React.FC<NewsSectionProps> = ({ section, sx }) => {
  const { t } = useTranslation();

  const handleNewsClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box
      sx={{
        py: 6,
        bgcolor: section.backgroundColor || 'background.default',
        ...sx,
      }}
      data-section="page.news-section"
    >
      <Container maxWidth={section.containerMaxWidth || 'lg'}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
          >
            <Article />
            {section.title}
          </Typography>
          {section.subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {section.subtitle}
            </Typography>
          )}
        </Box>

        <Grid container spacing={4}>
          {section.newsItems.map((item: NewsItem) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                {item.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image.url}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip label={item.category} color="primary" size="small" sx={{ mb: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>

                {item.link && (
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="text"
                      endIcon={<ArrowForward />}
                      onClick={() => handleNewsClick(item.link)}
                      fullWidth
                    >
                      {item.buttonText || t('common.read_more')}
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default NewsSection;
