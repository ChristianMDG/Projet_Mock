import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCheckoutStore } from '@/stores/checkout.store';
import Labels from '@/labelKeys.json';

const CHECKOUT_STEPS_KEYS = [
  Labels.shop_step_cart,
  Labels.shop_step_delivery,
  Labels.shop_step_payment,
  Labels.shop_step_confirmation,
];

const CheckoutProgress: React.FC = () => {
  const { t } = useTranslation();
  const activeStep = useCheckoutStore(state => state.activeStep);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Simple step labels for mobile */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          display: { xs: 'flex', md: 'none' },
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {t(CHECKOUT_STEPS_KEYS[activeStep])}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {activeStep + 1} / {CHECKOUT_STEPS_KEYS.length}
        </Typography>
      </Stack>

      {/* Full step labels for desktop */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        {CHECKOUT_STEPS_KEYS.map((labelKey, index) => (
          <Typography
            key={labelKey}
            variant="caption"
            sx={{
              fontWeight: index <= activeStep ? 700 : 500,
              color: index === activeStep ? 'primary.main' : index < activeStep ? 'text.primary' : 'text.disabled',
              flex: 1,
              textAlign: 'center',
            }}
          >
            {t(labelKey)}
          </Typography>
        ))}
      </Stack>

      <Stack direction="row" spacing={1}>
        {CHECKOUT_STEPS_KEYS.map((_, index) => (
          <Box
            key={index}
            sx={{
              height: 4,
              flexGrow: 1,
              bgcolor: index < activeStep ? 'primary.main' : index === activeStep ? 'primary.light' : 'divider',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default CheckoutProgress;
