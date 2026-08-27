import React from 'react';
import {
  Box,
  Typography,
  Paper,
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
import { useTranslation } from 'react-i18next';
import type { Product } from '@/models/Shop';
import Labels from '@/labelKeys.json';
import { Inventory } from '@mui/icons-material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';

interface SellerInfoProps {
  product: Product;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ product }) => {
  const { t } = useTranslation();
  const seller = product.seller;
  const isTopRated = (seller?.rating ?? 0) >= 4.5;

  return seller ? (
    <Paper variant="outlined" sx={{ mt: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            fontSize: 28,
          }}
        >
          <StorefrontOutlined />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
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
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: 'center', color: 'text.secondary', justifyContent: 'space-between' }}
            >
              <LocationOn sx={{ fontSize: 14 }} />
              <Typography variant="caption">{seller.location}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <Rating value={seller?.rating ?? 0} size="small" readOnly precision={0.1} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {(seller?.rating ?? 0).toFixed(1)}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Stats footer */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', color: 'text.secondary' }}>
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
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
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
        </Box>
      </Box>
    </Paper>
  ) : null;
};

export default SellerInfo;
