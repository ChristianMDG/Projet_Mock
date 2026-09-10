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
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import SearchHighlight from './SearchHighlight';
import type { GlobalSearchHit } from '@/api/global-search.api';
import { optimizeCloudinaryUrl } from '@/utils/cloudinaryUtils';

export interface SearchProductHitProps {
  hit: GlobalSearchHit;
  query: string;
  isSelected?: boolean;
  onSelect: (hit: GlobalSearchHit) => void;
}

const formatPrice = (price?: number) => {
  if (price !== undefined && price !== null) {
    return new Intl.NumberFormat('fr-MG').format(price) + ' Ar';
  }
  return '';
};

export const SearchProductHit: React.FC<SearchProductHitProps> = ({ hit, query, isSelected = false, onSelect }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const imageUrl = optimizeCloudinaryUrl(hit.imageUrl, { width: 88, height: 88 }) ?? hit.imageUrl;

  return (
    <ListItem
      disablePadding
      secondaryAction={<ArrowForwardIcon fontSize="small" color="action" />}
      sx={{
        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
      }}
    >
      <ListItemButton onClick={() => onSelect(hit)} sx={{ py: 1, px: 2 }}>
        <ListItemAvatar sx={{ minWidth: 56 }}>
          <Avatar
            src={imageUrl}
            alt={hit.title}
            variant="rounded"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'action.hover',
              border: 1,
              borderColor: 'divider',
              color: 'primary.main',
              '& img': { objectFit: 'cover', width: '100%', height: '100%' },
            }}
          >
            <ShoppingBagIcon fontSize="small" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <SearchHighlight
                text={hit.title}
                query={query}
                component={Typography}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              />
              {Boolean(hit.badge) && (
                <Chip
                  label={t(hit.badge!)}
                  size="small"
                  variant="outlined"
                  sx={{ height: 18, fontSize: '0.65rem', display: { xs: 'none', sm: 'inline-flex' } }}
                />
              )}
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.25 }}>
              {Boolean(hit.subtitle) && (
                <Typography variant="caption" color="text.secondary">
                  {hit.subtitle}
                </Typography>
              )}
              {hit.price !== undefined && (
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
                  {formatPrice(hit.price)}
                </Typography>
              )}
            </Stack>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default memo(SearchProductHit);
