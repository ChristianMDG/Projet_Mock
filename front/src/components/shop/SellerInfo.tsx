import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Rating,
  Avatar,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import LocationOn from '@mui/icons-material/LocationOn';
import Verified from '@mui/icons-material/Verified';
import StarBorder from '@mui/icons-material/StarBorder';
import Inventory from '@mui/icons-material/Inventory';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/models/Shop';
import Labels from '@/labelKeys.json';

interface SellerInfoProps {
  product: Product;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ product }) => {
  const { t } = useTranslation();
  const seller = product.seller;
  const isTopRated = (seller?.rating ?? 0) >= 4.5;

  return seller ? (
    <Card sx={{ mt: 1, overflow: 'hidden' }}>
      {/* Header */}
      <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, '&:last-child': { pb: 2 } }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            fontSize: 22,
          }}
        >
          <StorefrontOutlined />
        </Avatar>
        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
              {seller?.name}
            </Typography>
            <Chip
              icon={<Verified sx={{ fontSize: 14 }} />}
              label={t(Labels.shop_seller_verified)}
              size="small"
              color="primary"
            />
            {isTopRated && (
              <Chip
                icon={<StarBorder sx={{ fontSize: 14 }} />}
                label={t(Labels.shop_seller_top_rated)}
                size="small"
                color="secondary"
              />
            )}
          </Stack>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <LocationOn sx={{ fontSize: 14 }} />
              <Typography variant="caption">{seller.location}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <Rating value={seller?.rating ?? 0} size="small" readOnly precision={0.1} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {(seller?.rating ?? 0).toFixed(1)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

      <Divider />

      {/* Stats footer */}
      <CardActions
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          bgcolor: 'action.hover',
        }}
      >
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', color: 'text.secondary' }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Inventory fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {seller.productCount} {t(Labels.shop_seller_products)}
            </Typography>
          </Stack>
          {product.origin && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <LocationOn fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {product.origin}
              </Typography>
            </Stack>
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title={t(Labels.chat_messenger)}>
            <IconButton
              size="small"
              component="a"
              href="https://m.me/61570079625295"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'info.main', bgcolor: theme => alpha(theme.palette.info.main, 0.1) }}
            >
              <FacebookIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t(Labels.chat_whatsapp)}>
            <IconButton
              size="small"
              component="a"
              href="https://wa.me/261374107562"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'success.main', bgcolor: theme => alpha(theme.palette.success.main, 0.1) }}
            >
              <WhatsAppIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  ) : null;
};

export default SellerInfo;
