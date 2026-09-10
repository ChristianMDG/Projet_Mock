import React from 'react';
import { Card, CardMedia, Button, Box, useTheme, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { ROUTES } from '@/constants/routes';
import Labels from '@/labelKeys.json';

const ShopPresenceBanner: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const shopRoute = ROUTES.shop[i18n.language as keyof typeof ROUTES.shop] ?? ROUTES.shop.mg;

  return (
    <Card
      sx={{
        boxShadow: theme.shadows[1],
      }}
    >
      <CardActionArea onClick={() => navigate(shopRoute)}>
        <CardMedia
          component="img"
          image="/images/shop-banner.jpg"
          alt="Shop Banner"
          sx={{
            width: '100%',
            height: { xs: 150, md: 220 },
            objectFit: 'cover',
          }}
        />
        {/* Overlay subtle gradient just for the button contrast */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 12, md: 24 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<StorefrontIcon />}
            sx={{
              px: { xs: 3, md: 5 },
              py: { xs: 1, md: 1.5 },
              borderRadius: 8,
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: theme.shadows[6],
              whiteSpace: 'nowrap',
              pointerEvents: 'none', // Let the CardActionArea handle the click and ripple
            }}
          >
            {t(Labels.shop_browse_products)}
          </Button>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ShopPresenceBanner;
