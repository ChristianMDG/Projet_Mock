import React from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  CardGiftcard as CardGiftIcon,
  CheckCircle as CheckCircleIcon,
  Stars as StarsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface LoyaltyTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  benefits: string[];
}

const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 999,
    color: '#CD7F32',
    benefits: [Labels.loyalty_benefit_basic_points, Labels.loyalty_benefit_birthday_bonus],
  },
  {
    name: 'Silver',
    minPoints: 1000,
    maxPoints: 4999,
    color: '#C0C0C0',
    benefits: [
      Labels.loyalty_benefit_basic_points,
      Labels.loyalty_benefit_birthday_bonus,
      Labels.loyalty_benefit_priority_support,
      Labels.loyalty_benefit_exclusive_offers,
    ],
  },
  {
    name: 'Gold',
    minPoints: 5000,
    maxPoints: 9999,
    color: '#FFD700',
    benefits: [
      Labels.loyalty_benefit_double_points,
      Labels.loyalty_benefit_birthday_bonus,
      Labels.loyalty_benefit_priority_support,
      Labels.loyalty_benefit_exclusive_offers,
      Labels.loyalty_benefit_free_upgrades,
    ],
  },
  {
    name: 'Platinum',
    minPoints: 10000,
    maxPoints: Infinity,
    color: '#E5E4E2',
    benefits: [
      Labels.loyalty_benefit_triple_points,
      Labels.loyalty_benefit_birthday_bonus,
      Labels.loyalty_benefit_vip_support,
      Labels.loyalty_benefit_exclusive_offers,
      Labels.loyalty_benefit_free_upgrades,
      Labels.loyalty_benefit_lounge_access,
    ],
  },
];

interface AccountLoyaltyPointsProps {
  userId?: number;
}

const AccountLoyaltyPoints: React.FC<AccountLoyaltyPointsProps> = () => {
  const { t } = useTranslation();

  // Note: Replace with actual API call when loyalty endpoint is available
  // const { data: loyaltyData, isLoading } = useLoyaltyPoints(userId);

  // Mock data for demonstration
  const mockLoyaltyPoints = 2500;
  const isLoading = false;

  const getCurrentTier = (points: number): LoyaltyTier => {
    return LOYALTY_TIERS.find(tier => points >= tier.minPoints && points <= tier.maxPoints) || LOYALTY_TIERS[0];
  };

  const getNextTier = (currentTier: LoyaltyTier): LoyaltyTier | null => {
    const currentIndex = LOYALTY_TIERS.indexOf(currentTier);
    return currentIndex < LOYALTY_TIERS.length - 1 ? LOYALTY_TIERS[currentIndex + 1] : null;
  };

  const getProgressToNextTier = (points: number, currentTier: LoyaltyTier, nextTier: LoyaltyTier | null): number => {
    if (!nextTier) return 100;
    const pointsInCurrentTier = points - currentTier.minPoints;
    const pointsNeededForNextTier = nextTier.minPoints - currentTier.minPoints;
    return (pointsInCurrentTier / pointsNeededForNextTier) * 100;
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  const currentTier = getCurrentTier(mockLoyaltyPoints);
  const nextTier = getNextTier(currentTier);
  const progress = getProgressToNextTier(mockLoyaltyPoints, currentTier, nextTier);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        {t(Labels.loyalty_coming_soon)}
      </Alert>
      {/* Points Overview Card */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${currentTier.color}15 0%, ${currentTier.color}05 100%)`,
          borderLeft: `4px solid ${currentTier.color}`,
        }}
      >
        <CardContent>
          <Grid
            container
            spacing={3}
            sx={{
              alignItems: 'center',
            }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: currentTier.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 2,
                  }}
                >
                  <StarsIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {mockLoyaltyPoints.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_total_points)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${t(Labels.loyalty_tier)}: ${currentTier.name}`}
                sx={{
                  bgcolor: currentTier.color,
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Grid>

            {nextTier && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_progress_to_next_tier)}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: nextTier.color,
                      fontWeight: 'bold',
                    }}
                  >
                    {nextTier.minPoints - mockLoyaltyPoints} {t(Labels.loyalty_points_to)} {nextTier.name}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: nextTier.color,
                    },
                  }}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={3}>
        {/* Current Tier Benefits */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CardGiftIcon color="primary" />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {t(Labels.loyalty_your_benefits)}
                </Typography>
              </Box>
              <List dense>
                {currentTier.benefits.map((benefit, index) => (
                  <React.Fragment key={benefit}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: currentTier.color, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={t(benefit)}
                        slotProps={{
                          primary: { variant: 'body2' },
                        }}
                      />
                    </ListItem>
                    {index < currentTier.benefits.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* How to Earn Points */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUpIcon color="success" />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {t(Labels.loyalty_how_to_earn)}
                </Typography>
              </Box>
              <Stack spacing={2}>
                <Box component={Paper} variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {t(Labels.loyalty_earn_by_booking)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_earn_by_booking_desc)}
                  </Typography>
                </Box>
                <Box component={Paper} variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {t(Labels.loyalty_earn_by_referral)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_earn_by_referral_desc)}
                  </Typography>
                </Box>
                <Box component={Paper} variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {t(Labels.loyalty_earn_by_review)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.loyalty_earn_by_review_desc)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Next Tier Preview */}
        {nextTier && (
          <Grid size={12}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${nextTier.color}10 0%, ${nextTier.color}05 100%)`,
                borderLeft: `4px solid ${nextTier.color}`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {t(Labels.loyalty_unlock_next_tier)}: {nextTier.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t(Labels.loyalty_unlock_desc)}
                </Typography>
                <List dense>
                  <Grid container spacing={1}>
                    {nextTier.benefits
                      .filter(benefit => !currentTier.benefits.includes(benefit))
                      .map(benefit => (
                        <Grid size={{ xs: 12, sm: 6 }} key={benefit}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircleIcon sx={{ color: nextTier.color, fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={t(benefit)}
                              slotProps={{
                                primary: {
                                  variant: 'body2',
                                  sx: {
                                    fontWeight: 500,
                                  },
                                },
                              }}
                            />
                          </ListItem>
                        </Grid>
                      ))}
                  </Grid>
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AccountLoyaltyPoints;
