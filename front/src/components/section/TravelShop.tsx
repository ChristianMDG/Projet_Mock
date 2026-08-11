import React from 'react';
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import { StyledIcon } from '@/components/ui';

interface TravelShopProps {
  sx?: SxProps<Theme>;
}

const travelItems = [
  {
    id: 1,
    name: 'Sac de Voyage',
    price: '25 000 Ar',
    image: '/images/travel-bag.jpg',
    description: 'Sac résistant et pratique pour vos voyages',
  },
  {
    id: 2,
    name: 'Oreiller de Voyage',
    price: '8 000 Ar',
    image: '/images/travel-pillow.jpg',
    description: 'Confort optimal pendant le trajet',
  },
  {
    id: 3,
    name: 'Bouteille Isotherme',
    price: '12 000 Ar',
    image: '/images/water-bottle.jpg',
    description: 'Garde vos boissons fraîches ou chaudes',
  },
  {
    id: 4,
    name: 'Trousse de Premiers Soins',
    price: '15 000 Ar',
    image: '/images/first-aid.jpg',
    description: 'Kit essentiel pour votre sécurité',
  },
  {
    id: 5,
    name: 'Masque de Sommeil',
    price: '5 000 Ar',
    image: '/images/sleep-mask.jpg',
    description: 'Pour un repos paisible en voyage',
  },
  {
    id: 6,
    name: 'Chargeur Portable',
    price: '35 000 Ar',
    image: '/images/power-bank.jpg',
    description: 'Restez connecté tout au long du voyage',
  },
];

const TravelShop: React.FC<TravelShopProps> = ({ sx }) => {
  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <StyledIcon icon={ShoppingBag} variant="primary" sx={{ fontSize: 64, mb: 2, borderRadius: '50%', p: 1 }} />
        <Typography variant="h3" component="h2" gutterBottom>
          Boutique de Voyage
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Découvrez nos articles essentiels pour rendre votre voyage plus confortable et agréable
        </Typography>
      </Box>
      <Grid container spacing={1}>
        {travelItems.map(item => (
          <Grid size={{ xs: 6, sm: 6, md: 4 }} key={item.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag sx={{ fontSize: 80, color: 'grey.400' }} />
              </CardMedia>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {item.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {item.price}
                  </Typography>

                  <Button variant="contained" size="small" startIcon={<ShoppingBag />}>
                    Acheter
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TravelShop;
