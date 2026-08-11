import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DynamicPageItem } from '@/api/dynamic-page.api';
import { Icon } from '@/shared/IconMapper';
import Labels from '@/labelKeys.json';
import { generateRoute } from '@/constants/routes';

interface DynamicPageCardProps {
  page: DynamicPageItem;
  t: (key: string) => string;
}

const DynamicPageCard: React.FC<DynamicPageCardProps> = ({ page, t }) => {
  const { i18n } = useTranslation();
  const dynamicPageRoute = generateRoute.dynamicPage(page.slug, i18n.language);
  const { pageHeader } = page;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        borderLeft: '4px solid',
        borderLeftColor: 'secondary.main',
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            color: 'primary.main',
          }}
        >
          <Icon iconName={page.icon ?? 'Info'} />
          <Typography variant="h6" component="h3" sx={{ ml: 1, fontWeight: 'bold' }}>
            {pageHeader?.title}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {pageHeader?.description}
        </Typography>

        <Button component={Link} to={dynamicPageRoute} variant="contained" fullWidth sx={{ mt: 'auto' }}>
          {t(Labels.learn_more)}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DynamicPageCard;
