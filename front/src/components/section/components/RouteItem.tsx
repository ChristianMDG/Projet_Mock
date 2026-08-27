import React from 'react';
import { alpha, Box, Typography, Chip, Stack, CardMedia, Card, CardActionArea, Paper } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LabelKeys from '@/labelKeys.json';
import { Route } from '@/models/Route';
import TaxibrousseRedIcon from '@/components/ui/TaxibrousseRedIcon';
import StyledIcon from '@/components/ui/StyledIcon';
import { useVilleDetailByVilleId } from '@/hooks/ville-detail.hooks';
import { ROUTES } from '@/constants/routes';
import { useVoyageSearchUrl } from '@/hooks/useVoyageSearchUrl';
import { optimizeCloudinaryUrl } from '@/utils/cloudinaryUtils';

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

  const departureCity = route.departureGare?.ville?.name ?? '—';
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
    <Card sx={{ my: 1 }}>
      <CardActionArea onClick={handleClick} sx={{ display: 'flex', alignItems: 'stretch' }}>
        {/* ── Left image ───────────────────────────────────────── */}
        <Box sx={{ position: 'relative', flexShrink: 0, width: { xs: 120, sm: 150, md: 170 } }}>
          <CardMedia
            component="img"
            image={optimizeCloudinaryUrl(
              villeDetailData?.data?.ImageGalery?.[0]?.url ??
                'https://res.cloudinary.com/dba8nelvb/image/upload/v1770477736/voyage_photoe_vgrslj.jpg',
              { width: 500, height: 400 },
            )}
            alt={arrivalCity}
            width="500"
            height="400"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              minHeight: { xs: 70, sm: 80 },
            }}
          />
        </Box>

        {/* ── Body ─────────────────────────────────────────────── */}
        <Stack
          direction="row"
          sx={{
            flex: 1,
            alignItems: 'center',
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Route direction */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
              <Typography
                variant="subtitle2"
                sx={theme => ({
                  fontWeight: 600,
                  color: alpha(theme.palette.text.primary, 0.55),
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                })}
              >
                {departureCity}
              </Typography>
              <EastIcon fontSize="small" sx={{ color: 'secondary.dark', flexShrink: 0 }} />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  lineHeight: 1.2,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {arrivalCity}
              </Typography>
            </Stack>

            {arrivalStation && (
              <Typography
                variant="caption"
                sx={theme => ({
                  color: alpha(theme.palette.text.secondary, 0.75),
                  display: 'block',
                  mb: 0.25,
                })}
              >
                {arrivalStation}
              </Typography>
            )}

            {/* Tags row */}
            <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {showPromo && (
                <Chip
                  label={t(LabelKeys.promo_chip)}
                  size="small"
                  color="secondary"
                  sx={{ height: 20, fontWeight: 700, borderRadius: '6px' }}
                />
              )}
              <Stack direction="row" spacing={0.4} sx={{ alignItems: 'center' }}>
                <AirlineSeatReclineNormalIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {t(LabelKeys.voyage_search_one_way)}
                </Typography>
                <StyledIcon icon={TaxibrousseRedIcon} sx={{ fontSize: 'small' }} />
              </Stack>
            </Stack>
          </Box>

          {/* ── Price pill ──────────────────────────────────── */}
          <Paper
            variant="outlined"
            sx={theme => ({
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 3,
              px: { xs: 0.5, sm: 1 },
              py: { xs: 0.25, sm: 0.5 },
              minWidth: { xs: 70, sm: 80 },
              ml: { xs: 'auto', sm: 0 },
            })}
          >
            <Typography
              variant="caption"
              sx={theme => ({
                display: 'block',
                color: theme.palette.text.secondary,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                mb: 0.15,
                whiteSpace: 'nowrap',
              })}
            >
              {t(LabelKeys.from_price)}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={theme => ({
                color: theme.palette.primary.main,
                fontWeight: 800,
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              })}
            >
              {price}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              {t(LabelKeys.currency_ariary_short)}
            </Typography>
          </Paper>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default RouteItem;
