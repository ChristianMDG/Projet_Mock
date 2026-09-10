import React, { memo } from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Stack,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AirlineSeatReclineNormal from '@mui/icons-material/AirlineSeatReclineNormal';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import { DATE_FORMATS, voyageDateUtils } from '@/utils/dayjs';
import Labels from '@/labelKeys.json';
import SearchHighlight from './SearchHighlight';
import type { GlobalSearchHit } from '@/api/global-search.api';
import { optimizeCloudinaryUrl } from '@/utils/cloudinaryUtils';

export interface SearchVoyageHitProps {
  hit: GlobalSearchHit;
  query: string;
  isSelected?: boolean;
  onSelect: (hit: GlobalSearchHit) => void;
}

export const SearchVoyageHit: React.FC<SearchVoyageHitProps> = ({ hit, query, isSelected = false, onSelect }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const logoUrl = optimizeCloudinaryUrl(hit.imageUrl, { width: 80, height: 80 }) ?? hit.imageUrl;

  const priceFormatted = hit.price ? `${new Intl.NumberFormat('fr-FR').format(hit.price)} Ar` : '';

  const formattedDate = hit.departureDate
    ? voyageDateUtils.formatWithLocale(hit.departureDate, DATE_FORMATS.VOYAGE_DATE, i18n.language)
    : '';

  return (
    <ListItem
      disablePadding
      secondaryAction={<ArrowForwardIcon fontSize="small" color="action" />}
      sx={{
        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
      }}
    >
      <ListItemButton onClick={() => onSelect(hit)} sx={{ py: 1, px: 2 }}>
        <ListItemAvatar>
          <Avatar
            src={logoUrl}
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: '12px',
              fontWeight: 700,
              '& img': { objectFit: 'contain' },
            }}
          >
            KB
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <SearchHighlight
              text={hit.title}
              query={query}
              component={Typography}
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'text.primary',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            />
          }
          secondary={
            <Stack spacing={0.4} sx={{ mt: 0.25 }}>
              {Boolean(hit.subtitle) && (
                <SearchHighlight
                  text={hit.subtitle!}
                  query={query}
                  component={Typography}
                  sx={{
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                />
              )}
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.5, mt: 0.25 }}>
                {Boolean(hit.badge) && (
                  <Chip
                    icon={<AccessTimeIcon sx={{ fontSize: '0.8rem !important' }} />}
                    label={hit.badge}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    }}
                  />
                )}
                {Boolean(hit.availableSeats !== undefined) && (
                  <Chip
                    icon={<AirlineSeatReclineNormal sx={{ fontSize: '0.85rem !important' }} />}
                    label={`${hit.availableSeats} ${t(Labels.seat_available_abbr)}`}
                    size="small"
                    variant="outlined"
                    color={hit.availableSeats! > 0 ? 'success' : 'default'}
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      borderColor: alpha(
                        hit.availableSeats! > 0 ? theme.palette.success.main : theme.palette.action.active,
                        0.3,
                      ),
                      bgcolor: alpha(
                        hit.availableSeats! > 0 ? theme.palette.success.main : theme.palette.action.active,
                        0.04,
                      ),
                    }}
                  />
                )}
                {Boolean(priceFormatted) && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      fontSize: '0.75rem',
                    }}
                  >
                    {priceFormatted}
                  </Typography>
                )}
                {Boolean(formattedDate) && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                    {formattedDate}
                  </Typography>
                )}
              </Stack>
            </Stack>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default memo(SearchVoyageHit);
