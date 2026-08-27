import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useActivePromotions } from '@/hooks/promotion.hooks';
import type { Promotion } from '@/types/promotion.types';

const PromotionList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useActivePromotions();

  const promotions: Promotion[] = data ?? [];
  const hasItems = promotions.length > 0;

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t(Labels.promotion_list_title)}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t(Labels.promotion_list_title)}
        </Typography>
        <Typography color="error">{t(Labels.shop_error)}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.promotion_list_title)}
      </Typography>
      {hasItems ? (
        <List>
          {promotions.map(promo => (
            <ListItem key={promo.id}>
              <ListItemText
                primary={`${promo.code} — ${promo.name}`}
                secondary={`${promo.discountType} ${promo.discountValue}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">{t(Labels.shop_empty)}</Typography>
      )}
    </Box>
  );
};

export default PromotionList;
