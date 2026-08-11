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
  LinearProgress,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { AccessTime, LocalOffer, Percent, Star } from '@mui/icons-material';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { voyageDateUtils } from '@/utils/dayjs';
import { useReservation } from '@/hooks/reservation.hook';
import type { PromotionalContent as PromotionalContentType, PromotionItem } from '@/api/dynamic-page.api';
import { VehicleIcon } from '@/components/shared';

interface PromotionalContentProps {
  section: PromotionalContentType;
  sx?: SxProps<Theme>;
}

const PromotionalContent: React.FC<PromotionalContentProps> = ({ section, sx }) => {
  const { t, i18n } = useTranslation();
  const { handleRouteReservation, isLoading } = useReservation();

  return (
    <Box
      sx={{ bgcolor: section.backgroundColor ?? 'background.default', py: 6, ...sx }}
      data-section="page.promotional-content"
    >
      <Container
        sx={{
          padding: { xs: 0 },
          maxWidth: section.containerMaxWidth ?? 'lg',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LocalOffer />
          {section.title}
        </Typography>

        <Grid container spacing={3}>
          {section.promotions.map((promo: PromotionItem) => (
            <Grid key={promo.id} size={{ xs: 12, md: promo.gridSize === 'large' ? 6 : 4 }}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                {(promo.image || promo.imageUrl) && (
                  <CardMedia
                    component="img"
                    image={promo.image?.url ?? promo.imageUrl}
                    alt={promo.title}
                    sx={{
                      height: '200',
                    }}
                  />
                )}

                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip label={promo.category} color="secondary" size="small" />
                    {promo.isLimited && promo.remaining && (
                      <Chip
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AirlineSeatReclineNormalIcon
                              color="inherit"
                              sx={{
                                fontSize: 'small',
                              }}
                            />
                            {promo.remaining} {t(Labels.promotion_remaining)}
                          </Box>
                        }
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {promo.isVIP && <Chip icon={<Star />} label="VIP" color="warning" size="small" />}
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {promo.title}
                  </Typography>

                  {promo.subtitle && (
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {promo.subtitle}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {promo.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t(Labels.promotion_route_label)} {promo.route}
                    </Typography>
                  </Box>

                  {promo.discount && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h6" color="primary">
                        {promo.discountedPrice?.toLocaleString()} Ar
                      </Typography>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                        {promo.originalPrice?.toLocaleString()} Ar
                      </Typography>
                      <Chip icon={<Percent />} label={`-${promo.discount}%`} color="success" size="small" />
                    </Box>
                  )}

                  {promo.progress && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        gutterBottom
                        sx={{
                          display: 'block',
                        }}
                      >
                        {t(Labels.promotion_progress_label)} {promo.progress}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={promo.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AccessTime
                      color="action"
                      sx={{
                        fontSize: 'small',
                      }}
                    />
                    <Typography variant="caption">
                      {t(Labels.promotion_valid_until)}{' '}
                      {voyageDateUtils.formatWithLocale(promo.validUntil, 'DD MMMM YYYY', i18n.language)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      padding: 1,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      border: theme => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {t(Labels.promotion_code_label)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                      }}
                    >
                      {promo.code}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    variant="contained"
                    startIcon={<VehicleIcon />}
                    fullWidth
                    disabled={isLoading}
                    onClick={() => handleRouteReservation(promo.route)}
                  >
                    {t(Labels.promotion_button_book_now)}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {section.callToAction && (
          <Box
            sx={{
              mt: 6,
              p: 4,
              borderRadius: 2,
              bgcolor: section.callToAction.backgroundColor ?? 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom>
              {section.callToAction.title}
            </Typography>
            {section.callToAction.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {section.callToAction.description}
              </Typography>
            )}
            <Button
              variant={section.callToAction.buttonVariant ?? 'contained'}
              color={section.callToAction.buttonColor ?? 'primary'}
              size="large"
              href={section.callToAction.buttonUrl}
            >
              {section.callToAction.buttonText}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PromotionalContent;
