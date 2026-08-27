import React, { useState } from 'react';
import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useOrders } from '@/hooks/order.hooks';
import type { Order } from '@/types/order.types';
import OrderCard from './OrderCard';

const OrderList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useOrders({ page: 0, size: 20 });
  const [expandedId, setExpandedId] = useState<number | false>(false);

  const orders: Order[] = data?.content ?? [];
  const hasItems = orders.length > 0;

  const handleToggle = (id: number) => () => {
    setExpandedId(prev => (prev === id ? false : id));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        {t(Labels.shop_error)}
      </Alert>
    );
  }

  if (hasItems) {
    return (
      <Box>
        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            expanded={expandedId === order.id}
            onToggle={handleToggle(order.id!)}
          />
        ))}
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
      <Inventory2Icon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {t(Labels.shop_empty)}
      </Typography>
    </Paper>
  );
};

export default OrderList;
