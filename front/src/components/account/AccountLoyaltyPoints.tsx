import React from 'react';
import { Alert, Box, Card, CardContent, Chip, LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import CardGiftIcon from '@mui/icons-material/CardGiftcard';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useLoyaltyView } from '@/hooks/loyalty.hooks';

interface AccountLoyaltyPointsProps {
  userId?: number;
}

const formatKm = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

const AccountLoyaltyPoints: React.FC<AccountLoyaltyPointsProps> = ({ userId }) => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useLoyaltyView(userId);

  if (isLoading) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={180} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rounded" height={220} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rounded" height={220} />
          </Grid>
        </Grid>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message}
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const {
    kmEarned,
    kmRedeemed,
    kmAvailable,
    kmPerFreeVoyage,
    earnMultiplier,
    programActive,
    freeVoyagesAvailable,
    kmToNextFreeVoyage,
    progressToNextFreeVoyage,
  } = data;

  const progressPercent = Math.min(100, Math.max(0, Number(progressToNextFreeVoyage) * 100));
  const hasFreeVoyages = freeVoyagesAvailable > 0;
  const programInactive = programActive === false;

  return (
    <Stack spacing={3}>
      {programInactive && <Alert severity="info">{t(Labels.loyalty_program_inactive)}</Alert>}

      {/* Hero card: available km + free voyages */}
      <Card
        sx={{
          background: theme =>
            `linear-gradient(135deg, ${theme.palette.primary.light}26 0%, ${theme.palette.primary.main}10 100%)`,
          borderLeft: theme => `4px solid ${theme.palette.primary.main}`,
        }}
      >
        <CardContent>
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 2,
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.1 }}>
                    {formatKm(kmAvailable, i18n.language)} {t(Labels.loyalty_km_unit)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_km_available)}
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                <Chip
                  icon={<EmojiEventsIcon />}
                  color={hasFreeVoyages ? 'success' : 'default'}
                  variant={hasFreeVoyages ? 'filled' : 'outlined'}
                  label={`${t(Labels.loyalty_free_voyages_available)}: ${freeVoyagesAvailable}`}
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  icon={<TrendingUpIcon />}
                  variant="outlined"
                  label={t(Labels.loyalty_earn_rate, { multiplier: earnMultiplier })}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t(Labels.loyalty_progress_to_next_free_voyage)}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  {t(Labels.loyalty_km_to_next_free_voyage, {
                    km: formatKm(kmToNextFreeVoyage, i18n.language),
                  })}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': { borderRadius: 5 },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {t(Labels.loyalty_threshold_info, { km: formatKm(kmPerFreeVoyage, i18n.language) })}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Stats card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DirectionsBusIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {t(Labels.loyalty_your_benefits)}
                </Typography>
              </Box>
              <Stack spacing={2}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_total_km_earned)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {formatKm(kmEarned, i18n.language)} {t(Labels.loyalty_km_unit)}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_total_km_redeemed)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {formatKm(kmRedeemed, i18n.language)} {t(Labels.loyalty_km_unit)}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_km_available)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatKm(kmAvailable, i18n.language)} {t(Labels.loyalty_km_unit)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* How to earn */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CardGiftIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {t(Labels.loyalty_how_to_earn)}
                </Typography>
              </Box>
              <Stack spacing={2}>
                <Box component={Paper} variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {t(Labels.loyalty_earn_by_booking)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_earn_rate, { multiplier: earnMultiplier })}
                  </Typography>
                </Box>
                <Box component={Paper} variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {t(Labels.loyalty_unlock_next_tier)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_threshold_info, { km: formatKm(kmPerFreeVoyage, i18n.language) })}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AccountLoyaltyPoints;
