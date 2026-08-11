import React from 'react';
import { alpha, Avatar, Chip, Paper, Stack, Theme, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import Labels from '@/labelKeys.json';
import { Gare, Koperative, UserOperator } from '@/types';
import { useGuichetByGareAndKoperative } from '@/hooks/guichet.hooks';
import { InfoRow } from '@/components/shared';
import { GuichetInformationSkeleton } from '@/skeleton';

interface GuichetInformationProps {
  gare?: Gare;
  koperative?: Koperative;
  theme: Theme;
  t: (key: string) => string;
}

const getOperatorName = (operator: UserOperator): string => {
  const fullName = `${operator.firstName} ${operator.lastName}`.trim();
  return fullName ?? operator.username;
};

const getOperatorInitial = (operator: UserOperator): string => {
  return operator.firstName?.[0] ?? '?';
};

export const GuichetInformation: React.FC<GuichetInformationProps> = ({ gare, koperative, theme, t }) => {
  const { data: guichet, isLoading, error } = useGuichetByGareAndKoperative(gare?.id, koperative?.id);

  if (isLoading) {
    return <GuichetInformationSkeleton theme={theme} />;
  }

  if (error) {
    return (
      <Stack spacing={2} sx={{ mt: 3 }}>
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{
            fontWeight: 600,
          }}
        >
          {t(Labels.guichet_information)}
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.error.main, 0.05),
            borderColor: alpha(theme.palette.error.main, 0.2),
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <BusinessIcon
              sx={{
                p: 0.5,
                bgcolor: alpha(theme.palette.error.main, 0.15),
                borderRadius: 1,
                color: 'error.main',
              }}
            />
            <Typography variant="body2" color="error.main">
              {t(Labels.guichet_load_error)}
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return guichet ? (
    <Stack spacing={2} sx={{ mt: 3 }}>
      <Typography
        variant="subtitle2"
        color="primary"
        sx={{
          fontWeight: 600,
        }}
      >
        {t(Labels.guichet_information)}
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: 1,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.info.main, 0.05),
          borderColor: alpha(theme.palette.info.main, 0.2),
        }}
      >
        <Stack spacing={1.5}>
          {/* Header */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <BusinessIcon
              sx={{
                p: 0.5,
                bgcolor: alpha(theme.palette.info.main, 0.15),
                borderRadius: 1,
                color: 'info.main',
              }}
            />
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                noWrap
                sx={{
                  fontWeight: 600,
                }}
              >
                {guichet.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {gare?.name}
              </Typography>
            </Stack>
          </Stack>

          {/* Contact Info */}
          {guichet.phones && (
            <InfoRow icon={<PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />} text={guichet.phones} />
          )}

          {guichet.openingHours && (
            <InfoRow
              icon={<AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
              text={guichet.openingHours}
            />
          )}

          {/* Operators */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.primary" noWrap>
              {t(guichet.operateurs?.length ? Labels.guichet_operators_info : Labels.guichet_no_operators)}
            </Typography>
          </Stack>

          {guichet.operateurs && guichet.operateurs.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                gap: 1,
                ml: 3,
                flexWrap: 'wrap',
              }}
            >
              {guichet.operateurs.map((operator, index) => (
                <Chip
                  key={`${operator.id}-${index}`}
                  avatar={
                    <Avatar sx={{ width: 20, height: 20, fontSize: '0.75rem' }}>{getOperatorInitial(operator)}</Avatar>
                  }
                  label={getOperatorName(operator)}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 28 }}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  ) : (
    <></>
  );
};
