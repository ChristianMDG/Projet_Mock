import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import StyledIcon from '@/components/ui/StyledIcon';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface VehicleCardProps {
  id?: number;
  brand: string;
  model: string;
  category: string;
  pricePerDay: number;
  imageUrl?: string;
  seats?: number;
  transmission?: string | null;
  fuel?: string | null;
}

export default function RentalVehicleCard({
  id = 1,
  brand,
  model,
  category,
  pricePerDay,
  imageUrl,
  seats = 5,
  transmission = 'Auto',
  fuel = 'Essence',
}: VehicleCardProps) {
  const { t } = useTranslation();
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3 }}>
      <Box sx={{ position: 'relative', bgcolor: 'background.default', p: 2 }}>
        <Chip
          label={category}
          size="small"
          variant="outlined"
          sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1, borderRadius: 1, fontSize: '0.7rem' }}
        />
        <CardMedia
          component="img"
          height="160"
          image={imageUrl || `https://placehold.co/300x160?text=${brand}+${model}`}
          alt={`${brand} ${model}`}
          sx={{ width: '100%', objectFit: 'cover' }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
          {brand} {model}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t(Labels.rental_vehicle_card_equivalent)} | {category}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, flexWrap: 'wrap', color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
            <StyledIcon icon={PersonIcon} sx={{ fontSize: '1rem' }} />
            {t(Labels.rental_vehicle_card_seats, { seats })}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
            <StyledIcon icon={SettingsIcon} sx={{ fontSize: '1rem' }} />
            {transmission}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
            <StyledIcon icon={LocalGasStationIcon} sx={{ fontSize: '1rem' }} />
            {fuel}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {t(Labels.rental_vehicle_card_starting_from)}
          </Typography>
          <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {pricePerDay.toLocaleString('fr-MG')} Ar
            <Typography component="span" variant="caption" color="text.secondary">
              {' '}
              {t(Labels.rental_vehicle_card_per_day)}
            </Typography>
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          component={Link}
          to={`/vehicule/${id}`}
          sx={{ fontWeight: 600 }}
        >
          {t(Labels.rental_vehicle_card_book_now)}
        </Button>
      </CardActions>
    </Card>
  );
}
