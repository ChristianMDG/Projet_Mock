import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useDeliveryZones } from '@/hooks/delivery.hooks';
import type { DeliveryZone } from '@/types/delivery.types';

const DeliveryZoneList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useDeliveryZones();

  const zones: DeliveryZone[] = data ?? [];
  const hasItems = zones.length > 0;

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t(Labels.delivery_zone_list_title)}
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
          {t(Labels.delivery_zone_list_title)}
        </Typography>
        <Typography color="error">{t(Labels.shop_error)}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.delivery_zone_list_title)}
      </Typography>
      {hasItems ? (
        <List>
          {zones.map(zone => (
            <ListItem key={zone.id}>
              <ListItemText primary={zone.name} secondary={zone.isActive ? 'active' : 'inactive'} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">{t(Labels.shop_empty)}</Typography>
      )}
    </Box>
  );
};

export default DeliveryZoneList;
