import React from 'react';
import { alpha, Box, Typography, Chip, Stack, Grid, CardMedia, Card, CardActionArea, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LabelKeys from '@/labelKeys.json';
import { Route } from '@/models/Route';
import { StyledIcon, TaxibrousseRedIcon } from '@/components';
import { useVilleDetailByVilleId } from '@/hooks/ville-detail.hooks';
import { ROUTES } from '@/constants/routes';
import { useVoyageSearchUrl } from '@/hooks/useVoyageSearchUrl';

interface RouteItemProps {
  route: Route;
  showPromo?: boolean;
  date?: string;
}

const RouteItem: React.FC<RouteItemProps> = ({ route, showPromo = true, date }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: villeDetailData } = useVilleDetailByVilleId(route.arrivalGare?.ville?.id ?? 0);
  const { buildUrlQuery } = useVoyageSearchUrl();

  const arrivalCity = route.arrivalGare?.ville?.name ?? route.name;
  const arrivalStation = route.arrivalGare?.name;
  const price = route.fraisTaxibrousse?.toLocaleString() ?? '---';

  const handleClick = () => {
    const from = route.departureGare?.ville?.name;
    const to = route.arrivalGare?.ville?.name;
    if (from && to && date) {
      const query = buildUrlQuery({
        fromVilleName: from,
        toVilleName: to,
        departureDate: date,
        passengers: 1,
      });
      navigate(`${ROUTES.searchResults[i18n.language]}${query}`);
    }
  };

  return (
    <Card
      sx={theme => ({
        my: 1,
        backdropFilter: 'blur(16px) saturate(180%)',
        transition: theme.transitions.create(['box-shadow', 'border-color'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.6),
          boxShadow: theme.shadows[4],
        },
      })}
    >
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ alignItems: 'center' }}>
            {/* Image */}
            <Grid size={{ xs: 4, sm: 2, md: 1.5 }}>
              <CardMedia
                component="img"
                image={
                  villeDetailData?.data?.ImageGalery?.[0]?.url ??
                  'https://res.cloudinary.com/dba8nelvb/image/upload/v1770477736/voyage_photoe_vgrslj.jpg'
                }
                alt={arrivalCity}
                sx={{ width: '100%', height: { xs: 80, sm: 72, md: 80 }, borderRadius: 2, objectFit: 'cover' }}
              />
            </Grid>
            {/* Route Details */}
            <Grid size={{ xs: 8, sm: 4, md: 4 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {arrivalCity}
              </Typography>
              {arrivalStation && (
                <Typography variant="body2" color="text.secondary">
                  ({arrivalStation})
                </Typography>
              )}
            </Grid>
            {/* Promo & Round Trip */}
            <Grid size={{ xs: 6, sm: 3, md: 3 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
              >
                {showPromo && <Chip label={t(LabelKeys.promo_chip)} variant="outlined" color="primary" size="small" />}
                <Stack direction="row" spacing={0.5} sx={{ color: 'text.secondary', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t(LabelKeys.voyage_search_one_way)}
                  </Typography>
                  <StyledIcon icon={TaxibrousseRedIcon} sx={{ fontSize: 'small' }} />
                </Stack>
              </Stack>
            </Grid>
            {/* Price Section */}
            <Grid size={{ xs: 6, sm: 3, md: 3.5 }}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t(LabelKeys.from_price)}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                    {price} {t(LabelKeys.currency_ariary_short)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RouteItem;
