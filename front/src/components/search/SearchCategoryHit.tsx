import React, { memo, useMemo } from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchHighlight from './SearchHighlight';
import type { GlobalSearchHit } from '@/api/global-search.api';
import { useTranslation } from 'react-i18next';
import { useCategories as useCmsCategories } from '@/hooks/cms.hooks';

export interface SearchCategoryHitProps {
  hit: GlobalSearchHit;
  query: string;
  isSelected?: boolean;
  onSelect: (hit: GlobalSearchHit) => void;
}

export const SearchCategoryHit: React.FC<SearchCategoryHitProps> = ({ hit, query, isSelected = false, onSelect }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: cmsCategories = [] } = useCmsCategories();
  const imageUrl = useMemo(() => {
    if (hit.imageUrl) {
      return hit.imageUrl;
    }
    const ctg = cmsCategories.find(cat => cat.slug === hit.slug);
    return ctg?.image?.url;
  }, [cmsCategories, hit.imageUrl, hit.slug]);

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
            src={imageUrl}
            variant="rounded"
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'action.selected',
              color: 'primary.main',
              '& img': { objectFit: 'cover' },
            }}
          >
            <CategoryIcon fontSize="small" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <SearchHighlight
              text={hit.title}
              query={query}
              component={Typography}
              sx={{ fontWeight: 600, fontSize: '0.85rem' }}
            />
          }
          secondary={
            Boolean(hit.subtitle) && (
              <Typography variant="caption" color="text.secondary">
                {t(hit.subtitle!)}
              </Typography>
            )
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default memo(SearchCategoryHit);
