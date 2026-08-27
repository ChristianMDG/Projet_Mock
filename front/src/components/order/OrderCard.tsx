import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Divider, Stack, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/types/order.types';
import dayjs from '@/utils/dayjs';
import { getStatusChipColor, getStatusLabel } from '@/utils/order.utils';

export interface OrderCardProps {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, expanded, onToggle }) => {
  const { t, i18n } = useTranslation();
  const hasItems = Boolean(order.items?.length);
  const orderRef = order.orderNumber ? `#${order.orderNumber}` : `#${order.id}`;
  const createdAt = order.createdAt ? dayjs(order.createdAt).locale(i18n.language).format('D MMMM YYYY') : null;

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggle}
      elevation={1}
      sx={{
        mb: 1,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ArrowDropDownIcon />} sx={{ px: 2, py: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, width: 1 }}>
          <ReceiptIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: 'monospace', flexGrow: 1 }}>
            {orderRef}
          </Typography>
          <Chip
            label={getStatusLabel(order.status, t)}
            color={getStatusChipColor(order.status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {order.total?.toLocaleString(i18n.language)} {order.currency ?? 'Ar'}
          </Typography>
        </Stack>
      </AccordionSummary>

      <Divider />

      <AccordionDetails sx={{ px: 2, py: 1.5 }}>
        <Stack spacing={1.5}>
          {createdAt && (
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Date
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {createdAt}
              </Typography>
            </Stack>
          )}

          {order.deliveryAddress && (
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <LocalShippingIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Livraison
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
                {order.deliveryAddress}
              </Typography>
            </Stack>
          )}

          {hasItems && (
            <Box>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mb: 1 }}>
                <Inventory2Icon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Articles
                </Typography>
              </Stack>
              <Stack spacing={0.5} sx={{ pl: 1 }}>
                {order.items.map(item => (
                  <Stack key={item.id} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption">
                      {item.productName} × {item.quantity}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {item.lineTotal?.toLocaleString(i18n.language)} Ar
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderCard;
