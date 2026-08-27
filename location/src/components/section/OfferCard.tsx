import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  alpha,
} from '@mui/material';
import type { RentalOfferItem } from '@/api/dynamic-page.api';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Link as RouterLink } from 'react-router-dom';
import Timer from '@mui/icons-material/Timer';

const OfferCard: React.FC<{ offer: RentalOfferItem }> = ({ offer }) => {
  const { t } = useTranslation();
  const {
    title,
    subtitle,
    description,
    discount,
    image,
    imageUrl,
    ctaLabel,
    ctaUrl,
    validUntil,
    isLimited,
    remaining,
    progress,
    gridSize,
  } = offer;
  const displayImage = image?.data?.url ?? imageUrl;
  const hasImage = Boolean(displayImage);
  const isLarge = gridSize === 'large';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: isLarge ? { xs: 'column', md: 'row' } : 'column',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hasImage && (
        <Box sx={{ width: isLarge ? { xs: '100%', md: '50%' } : '100%', position: 'relative' }}>
          <CardMedia
            component="img"
            height={isLarge ? '100%' : '200'}
            image={displayImage}
            alt={title}
            sx={{ objectFit: 'cover', minHeight: isLarge ? '100%' : 'auto' }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: theme =>
                `linear-gradient(to right, ${alpha(theme.palette.common.black, 0.6)} 0%, transparent 100%)`,
              zIndex: 1,
            }}
          />
          {Boolean(discount) && (
            <Chip
              label={`-${discount}%`}
              color="error"
              size="medium"
              sx={{ position: 'absolute', top: 16, left: 16, fontWeight: 900, fontSize: '1.2rem', zIndex: 2 }}
            />
          )}
        </Box>
      )}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3, position: 'relative', zIndex: 2 }}>
        <CardContent sx={{ p: 0, flexGrow: 1 }}>
          <Typography variant="overline" sx={{ fontWeight: 700, color: 'secondary.main', mb: 1, display: 'block' }}>
            {subtitle}
          </Typography>
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            {description}
          </Typography>

          {isLimited && (
            <Box sx={{ mb: 3, bgcolor: theme => alpha(theme.palette.common.black, 0.2), p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t(Labels.rental_offers_hurry_up)}
                </Typography>
                <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 600 }}>
                  {remaining} {t(Labels.rental_offers_remaining)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress ?? 50}
                color="secondary"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          {Boolean(validUntil) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary', opacity: 0.8 }}>
              <Timer fontSize="small" />
              <Typography variant="caption">
                {t(Labels.rental_offers_valid_until)} {new Date(validUntil as string).toLocaleDateString('fr-FR')}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions sx={{ p: 0, mt: 2 }}>
          {Boolean(ctaUrl) && (
            <Button
              component={RouterLink}
              to={ctaUrl as string}
              variant="contained"
              color="secondary"
              size="large"
              fullWidth={!isLarge}
            >
              {ctaLabel ?? t(Labels.rental_offers_enjoy_offer)}
            </Button>
          )}
        </CardActions>
      </Box>
    </Card>
  );
};

export default OfferCard;
