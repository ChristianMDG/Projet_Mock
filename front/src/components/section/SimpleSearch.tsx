import React from 'react';
import { Box, Button, Grid, Paper, Typography, type SxProps, type Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import VilleAutocomplete from '@/components/shared/VilleAutocomplete';
import ImageMedia from '@/components/shared/ImageMedia';
import { useVoyageSearchStore } from '@/stores/voyage-search.store';
import { useVoyageSearchUrl } from '@/hooks/useVoyageSearchUrl';
import { ROUTES } from '@/constants/routes';
import dayjs from '@/utils/dayjs';
import Labels from '@/labelKeys.json';
import type { SimpleSearch as SimpleSearchSection } from '@/api/dynamic-page.api';

interface Props {
  section: SimpleSearchSection;
  sx?: SxProps<Theme>;
}

const SimpleSearch: React.FC<Props> = ({ section }) => {
  const { t, i18n } = useTranslation();
  const image = section.image;
  const title = section.title ?? t(Labels.voyage_search_title);
  const subtitle = section.subtitle ?? t(Labels.hero_discover_wonders_description);
  const navigate = useNavigate();

  const fromVille = useVoyageSearchStore(state => state.fromVille);
  const toVille = useVoyageSearchStore(state => state.toVille);
  const setSearchParams = useVoyageSearchStore(state => state.setSearchParams);

  const { buildUrlQuery } = useVoyageSearchUrl();

  const handleSearch = () => {
    if (fromVille && toVille) {
      const search = buildUrlQuery({
        fromVilleName: fromVille.name,
        toVilleName: toVille.name,
        departureDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        passengers: 1,
      });
      navigate({ pathname: ROUTES.searchResults[i18n.language], search });
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 'auto', md: '500px' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {image && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <ImageMedia
            media={image}
            fetchPriority="high"
            loading="eager"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(2px)',
          background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.10) 100%)',
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '900px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 700,
            mb: 1.5,
            textShadow: '0 2px 10px rgba(0,0,0,0.55)',
            fontSize: { xs: '1.9rem', sm: '2.4rem', md: '2.75rem' },
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="subtitle1"
            sx={{
              mb: 4,
              color: 'rgba(255,255,255,0.88)',
              textShadow: '0 1px 5px rgba(0,0,0,0.45)',
            }}
          >
            {subtitle}
          </Typography>
        )}

        <Paper elevation={8} sx={{ borderRadius: 3, p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, sm: 'grow' }}>
              <VilleAutocomplete
                value={fromVille}
                onChange={v => setSearchParams({ fromVille: v })}
                label={t(Labels.voyage_search_from_city)}
                placeholder={t(Labels.ui_label_city_departure)}
                startIcon={TripOriginIcon}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 'grow' }}>
              <VilleAutocomplete
                value={toVille}
                onChange={v => setSearchParams({ toVille: v })}
                label={t(Labels.voyage_search_to_city)}
                placeholder={t(Labels.ui_label_city_destination)}
                startIcon={LocationOnIcon}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 'auto' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<FindInPageIcon />}
                onClick={handleSearch}
                sx={{
                  height: '56px',
                  px: { xs: 4, sm: 3 },
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  width: { xs: '100%', sm: 'auto' },
                  whiteSpace: 'nowrap',
                }}
              >
                {t(Labels.button_search_voyages)}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default SimpleSearch;
