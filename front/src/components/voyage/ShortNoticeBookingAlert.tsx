import React, { useMemo } from 'react';
import { Alert, Box, IconButton, Stack, SvgIcon, Tooltip, Typography } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { FaFacebookMessenger } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { CONTACT_LINKS } from '@/constants/contact.constants';
import { isShortNoticeDeparture } from '@/utils/voyage.utils';

interface ShortNoticeBookingAlertProps {
  departureTime?: string | null;
}

interface ContactActionItem {
  id: string;
  labelKey: string;
  href: string;
  paletteColor: 'success' | 'info';
  icon: React.ReactNode;
}

const CONTACT_ACTIONS: readonly ContactActionItem[] = [
  {
    id: 'whatsapp',
    labelKey: Labels.chat_whatsapp,
    href: CONTACT_LINKS.WHATSAPP,
    paletteColor: 'success',
    icon: <WhatsAppIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />,
  },
  {
    id: 'messenger',
    labelKey: Labels.chat_messenger,
    href: CONTACT_LINKS.MESSENGER,
    paletteColor: 'info',
    icon: <SvgIcon component={FaFacebookMessenger} inheritViewBox sx={{ fontSize: { xs: 14, sm: 16 } }} />,
  },
];

export const ShortNoticeBookingAlert: React.FC<ShortNoticeBookingAlertProps> = ({ departureTime }) => {
  const { t } = useTranslation();

  const isShortNotice = useMemo(() => isShortNoticeDeparture(departureTime), [departureTime]);

  if (isShortNotice) {
    return (
      <Alert
        severity="warning"
        icon={<SupportAgentIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />}
        sx={{
          mb: 2,
          alignItems: 'center',
          '& .MuiAlert-icon': {
            mr: { xs: 1, sm: 1.5 },
            p: 0,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiAlert-message': {
            width: '100%',
            overflow: 'visible',
            minWidth: 0,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1.5 },
            flexWrap: 'nowrap',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              flex: 1,
              minWidth: 0,
              fontWeight: 500,
              lineHeight: { xs: 1.3, sm: 1.4 },
              color: 'text.primary',
            }}
          >
            {t(Labels.voyage_short_notice_contact_message)}
          </Typography>
          <Stack
            direction="row"
            spacing={{ xs: 0.75, sm: 1 }}
            sx={{
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {CONTACT_ACTIONS.map(({ id, labelKey, href, paletteColor, icon }) => {
              const label = t(labelKey);
              return (
                <Tooltip key={id} title={label}>
                  <IconButton
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    size="small"
                    sx={{
                      width: { xs: 30, sm: 32 },
                      height: { xs: 30, sm: 32 },
                      p: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: `${paletteColor}.main`,
                      bgcolor: 'background.paper',
                      border: 1,
                      borderColor: 'divider',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: `${paletteColor}.main`,
                        color: `${paletteColor}.contrastText`,
                        borderColor: `${paletteColor}.main`,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {icon}
                  </IconButton>
                </Tooltip>
              );
            })}
          </Stack>
        </Box>
      </Alert>
    );
  }

  return null;
};

export default ShortNoticeBookingAlert;
