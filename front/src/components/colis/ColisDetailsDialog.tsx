import React from 'react';
import { SwipeableDrawer, Typography, Box, Grid, Chip, Card, CardContent, Avatar } from '@mui/material';
import {
  Inventory2,
  PersonOutlined,
  Phone,
  Scale,
  AttachMoney,
  Description,
  ArrowForward,
  CheckCircle,
  Schedule,
  Inventory2Outlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Colis } from '@/types';

interface ColisDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  colis: Colis | null;
}

const ColisDetailsDialog: React.FC<ColisDetailsDialogProps> = ({ open, onClose, colis }) => {
  const { t } = useTranslation();

  if (!colis) return null;

  const getStatusConfig = (statut: string) => {
    switch (statut) {
      case 'LOADED':
        return {
          color: 'success' as const,
          label: t(Labels.colis_status_loaded),
          icon: (
            <CheckCircle
              sx={{
                fontSize: 'small',
              }}
            />
          ),
        };
      case 'REGISTERED':
        return {
          color: 'warning' as const,
          label: t(Labels.colis_status_registered),
          icon: (
            <Schedule
              sx={{
                fontSize: 'small',
              }}
            />
          ),
        };
      case 'DELIVERED':
        return {
          color: 'info' as const,
          label: t(Labels.colis_status_delivered),
          icon: (
            <Inventory2Outlined
              sx={{
                fontSize: 'small',
              }}
            />
          ),
        };
      default:
        return {
          color: 'default' as const,
          label: statut,
          icon: (
            <Inventory2
              sx={{
                fontSize: 'small',
              }}
            />
          ),
        };
    }
  };

  const statusConfig = getStatusConfig(colis.status || '');

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%' },
          maxWidth: 600,
          margin: '0 auto',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: '85vh',
          overflow: 'hidden',
        },
      }}
    >
      {/* Puller */}
      <Box
        sx={{
          width: 40,
          height: 4,
          bgcolor: 'divider',
          borderRadius: 2,
          mx: 'auto',
          mt: 1.5,
          mb: 2,
        }}
      />
      <Box sx={{ px: 3, pb: 3, overflow: 'auto' }}>
        {/* Header with Status */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mx: 'auto',
              mb: 1.5,
              bgcolor: 'primary.main',
              boxShadow: 2,
            }}
          >
            <Inventory2
              sx={{
                fontSize: 'large',
              }}
            />
          </Avatar>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: '600',
            }}
          >
            {t(Labels.colis_details_title)} #{colis.id}
          </Typography>
          <Chip
            icon={statusConfig.icon}
            label={statusConfig.label}
            color={statusConfig.color}
            size="medium"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Route Card */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            bgcolor: 'action.hover',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: '500',
                  }}
                >
                  {t(Labels.colis_form_sender_info)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  sx={{
                    fontWeight: '600',
                  }}
                >
                  {colis.senderName}
                </Typography>
              </Box>

              <ArrowForward sx={{ color: 'primary.main', fontSize: 28 }} />

              <Box sx={{ flex: 1, textAlign: 'right' }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: '500',
                  }}
                >
                  {t(Labels.colis_form_recipient_info)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  sx={{
                    fontWeight: '600',
                  }}
                >
                  {colis.recipientName}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: '600',
          }}
        >
          <PersonOutlined
            sx={{
              fontSize: 'small',
            }}
          />{' '}
          {t(Labels.colis_details_contacts)}
        </Typography>

        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            <Card elevation={0} sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mb: 0.5,
                    display: 'block',
                  }}
                >
                  {t(Labels.colis_form_sender_info)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: '500',
                    }}
                  >
                    {colis.senderPhone}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Card elevation={0} sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mb: 0.5,
                    display: 'block',
                  }}
                >
                  {t(Labels.colis_form_recipient_info)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: '500',
                    }}
                  >
                    {colis.recipientPhone}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Package Details */}
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: '600',
          }}
        >
          <Description
            sx={{
              fontSize: 'small',
            }}
          />{' '}
          {t(Labels.colis_details_package_info)}
        </Typography>

        <Card elevation={0} sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', mb: 2 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'action.selected', width: 40, height: 40 }}>
                    <Scale sx={{ fontSize: 20, color: 'primary.main' }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                      }}
                    >
                      {t(Labels.colis_details_weight)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: '600',
                      }}
                    >
                      {colis.weight} kg
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'success.light', width: 40, height: 40 }}>
                    <AttachMoney sx={{ fontSize: 20, color: 'success.dark' }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                      }}
                    >
                      {t(Labels.colis_details_price)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: '600',
                      }}
                    >
                      {colis.price?.toLocaleString()} {t(Labels.currency_ariary_short)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Additional Details */}
        {(colis.type || colis.content || colis.estimatedValue) && (
          <Card
            elevation={0}
            sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', mb: 2 }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Grid container spacing={2}>
                {colis.type && (
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        display: 'block',
                      }}
                    >
                      {t(Labels.colis_details_type)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: '500',
                      }}
                    >
                      {colis.type}
                    </Typography>
                  </Grid>
                )}
                {colis.content && (
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        display: 'block',
                      }}
                    >
                      {t(Labels.colis_details_content)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: '500',
                      }}
                    >
                      {colis.content}
                    </Typography>
                  </Grid>
                )}
                {colis.estimatedValue && (
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        display: 'block',
                      }}
                    >
                      {t(Labels.colis_details_estimated_value)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: '500',
                      }}
                    >
                      {colis.estimatedValue.toLocaleString()} {t(Labels.currency_ariary_short)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {colis.description && (
          <Card elevation={0} sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mb: 0.5,
                  display: 'block',
                }}
              >
                {t(Labels.colis_details_description)}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                {colis.description}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </SwipeableDrawer>
  );
};

export default ColisDetailsDialog;
