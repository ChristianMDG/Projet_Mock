import React from 'react';
import { Box, Card, CardContent, CardMedia, CardActions, Button, Chip, Stack, Typography } from '@mui/material';
import type { RentalVehicleItem } from '@/api/dynamic-page.api';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import People from '@mui/icons-material/People';
import Settings from '@mui/icons-material/Settings';
import LocalGasStation from '@mui/icons-material/LocalGasStation';

const VehicleCard: React.FC<{ vehicle: RentalVehicleItem }> = ({ vehicle }) => {
  const { t } = useTranslation();
  const { brand, model, category, pricePerDay, seats, transmission, fuel, image, imageUrl, isFeatured } = vehicle;
  const displayImage = image?.data?.url ?? imageUrl;
  const hasImage = Boolean(displayImage);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {hasImage && (
          <CardMedia
            component="img"
            height="220"
            image={displayImage}
            alt={`${brand} ${model}`}
            sx={{ objectFit: 'cover' }}
          />
        )}
        {isFeatured && (
          <Chip
            label={t(Labels.rental_featured_popular)}
            color="secondary"
            size="small"
            sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 'bold' }}
          />
        )}
        <Chip
          label={category}
          size="small"
          sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'background.paper', fontWeight: 600 }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
          {brand} {model}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2, color: 'text.secondary', flexWrap: 'wrap', gap: 1 }}>
          {Boolean(seats) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <People fontSize="small" />
              <Typography variant="body2">
                {seats} {t(Labels.rental_featured_places)}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Settings fontSize="small" />
            <Typography variant="body2">{transmission}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocalGasStation fontSize="small" />
            <Typography variant="body2">{fuel}</Typography>
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
            {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(
              pricePerDay,
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t(Labels.rental_featured_per_day)}
          </Typography>
        </Box>
        <Button variant="contained" color="primary">
          {t(Labels.rental_featured_book)}
        </Button>
      </CardActions>
    </Card>
  );
};

export default VehicleCard;
