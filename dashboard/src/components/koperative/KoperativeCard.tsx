import { useTranslation } from 'react-i18next';
import { Box, Typography, Card, CardContent, Chip, Stack, Avatar } from '@mui/material';
import { Phone, Email, Place } from '@mui/icons-material';
import { getKoperativeChipColor } from '@/utils/statusColors';
import type { Koperative } from '@/types/koperative.types';
import { KoperativeStatusLabels } from '@/types/koperative.types';

interface KoperativeCardProps {
  koperative: Koperative;
  onClick: () => void;
}

export function KoperativeCard({ koperative, onClick }: KoperativeCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={koperative.logoUrl ?? undefined}
            sx={{
              width: 52,
              height: 52,
              bgcolor: 'primary.main',
              fontSize: '1.2rem',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {koperative.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem', color: 'primary.main' }} noWrap>
              {koperative.name}
            </Typography>
            {koperative.status && (
              <Chip
                label={t(KoperativeStatusLabels[koperative.status] ?? koperative.status)}
                color={getKoperativeChipColor(koperative.status) as any}
                size="small"
                sx={{ mt: 0.5, fontSize: '0.65rem', height: 20, fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>

        <Stack spacing={1}>
          {koperative.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: '1rem', color: 'primary.main', opacity: 0.7 }} />
              <Typography variant="body2">{koperative.phone}</Typography>
            </Box>
          )}
          {koperative.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ fontSize: '1rem', color: 'primary.main', opacity: 0.7 }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }} noWrap>
                {koperative.email}
              </Typography>
            </Box>
          )}
          {koperative.address && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Place sx={{ fontSize: '1rem', color: 'primary.main', opacity: 0.7 }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }} noWrap>
                {koperative.address}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Ville chips */}
        {koperative.villes && koperative.villes.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ mt: 2, flexWrap: 'wrap' }} useFlexGap>
            {koperative.villes.slice(0, 3).map((v) => (
              <Chip
                key={v.id}
                label={v.name}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.65rem', height: 20, borderColor: 'divider' }}
              />
            ))}
            {koperative.villes.length > 3 && (
              <Chip
                label={`+${koperative.villes.length - 3}`}
                size="small"
                sx={{ fontSize: '0.65rem', height: 20, bgcolor: 'action.hover' }}
              />
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
