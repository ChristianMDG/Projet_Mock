import React from 'react';
import { Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/types/order.types';
import dayjs from '@/utils/dayjs';
import { getStatusChipColor, getStatusLabel } from '@/utils/order.utils';

export interface OrderResultCardProps {
  order: Order;
}

const OrderResultCard: React.FC<OrderResultCardProps> = ({ order }) => {
  const { t, i18n } = useTranslation();
  const hasItems = Boolean(order.items?.length);
  const orderRef = order.orderNumber ? `#${order.orderNumber}` : `#${order.id}`;
  const createdAt = order.createdAt ? dayjs(order.createdAt).locale(i18n.language).format('D MMMM YYYY') : null;

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <ReceiptLongIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
              {orderRef}
            </Typography>
          </Stack>
          <Chip
            label={getStatusLabel(order.status, t)}
            color={getStatusChipColor(order.status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        <Divider />

        <Stack spacing={1}>
          {createdAt && (
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Date
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {createdAt}
              </Typography>
            </Stack>
          )}

          {order.customerName && (
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Client
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {order.customerName}
              </Typography>
            </Stack>
          )}

          {order.deliveryAddress && (
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                <LocalShippingIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Livraison
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
                {order.deliveryAddress}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {order.total?.toLocaleString(i18n.language)} {order.currency ?? 'Ar'}
            </Typography>
          </Stack>
        </Stack>

        {hasItems && (
          <>
            <Divider />
            <Stack spacing={0.5}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <Inventory2Icon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Articles
                </Typography>
              </Stack>
              {order.items.map(item => (
                <Stack key={item.id} direction="row" sx={{ justifyContent: 'space-between', pl: 1 }}>
                  <Typography variant="body2">
                    {item.productName} × {item.quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.lineTotal?.toLocaleString(i18n.language)} Ar
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default OrderResultCard;
