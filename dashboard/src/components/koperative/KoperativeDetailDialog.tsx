import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
} from '@mui/material';
import { Business, Phone, Email, Place, LocalShipping, Person, Storefront, LocationCity } from '@mui/icons-material';
import { useKoperativeCrafters, useKoperativeGuichets, useKoperativeChauffeurs } from '@/hooks/koperative.hook';
import { getKoperativeChipColor } from '@/utils/statusColors';
import type { Koperative } from '@/types/koperative.types';
import { KoperativeStatusLabels } from '@/types/koperative.types';
import Labels from '@/labelKeys.json';

interface KoperativeDetailDialogProps {
  koperative: Koperative | null;
  open: boolean;
  onClose: () => void;
}

export function KoperativeDetailDialog({ koperative, open, onClose }: KoperativeDetailDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const koopId = koperative?.id ?? 0;

  const { data: crafters = [] } = useKoperativeCrafters(koopId);
  const { data: guichets = [] } = useKoperativeGuichets(koopId);
  const { data: chauffeurs = [] } = useKoperativeChauffeurs(koopId);

  if (!koperative) return null;

  const sections = [
    {
      title: t(Labels.koperative_info),
      icon: <Business fontSize="small" />,
      color: theme.palette.primary.main,
      items: [
        { icon: <Phone fontSize="small" />, value: koperative.phone },
        { icon: <Email fontSize="small" />, value: koperative.email },
        { icon: <Place fontSize="small" />, value: koperative.address },
      ],
      extra: koperative.registrationNumber && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {t(Labels.koperative_registration)}: {koperative.registrationNumber}
        </Typography>
      ),
    },
    {
      title: t(Labels.koperative_villes),
      icon: <LocationCity fontSize="small" />,
      color: theme.palette.info.main,
      count: koperative.villes?.length ?? 0,
      render: () => (
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }} useFlexGap>
          {koperative.villes?.map((v) => (
            <Chip key={v.id} label={v.name} size="small" variant="outlined" />
          ))}
        </Stack>
      ),
    },
    {
      title: t(Labels.koperative_guichets),
      icon: <Storefront fontSize="small" />,
      color: theme.palette.warning.main,
      count: guichets.length,
      render: () => (
        <List dense disablePadding>
          {guichets.map((g) => (
            <ListItem key={g.id} disablePadding sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Storefront sx={{ fontSize: '0.9rem' }} />
              </ListItemIcon>
              <ListItemText
                primary={g.gare?.name ?? `Guichet #${g.id}`}
                slotProps={{ primary: { variant: 'body2', sx: { fontSize: '0.8rem' } } }}
              />
            </ListItem>
          ))}
        </List>
      ),
    },
    {
      title: t(Labels.koperative_vehicles),
      icon: <LocalShipping fontSize="small" />,
      color: theme.palette.success.main,
      count: crafters.length,
      render: () => (
        <List dense disablePadding>
          {crafters.map((c: any) => (
            <ListItem key={c.id} disablePadding sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <LocalShipping sx={{ fontSize: '0.9rem' }} />
              </ListItemIcon>
              <ListItemText
                primary={`${c.name ?? t(Labels.koperative_vehicles)} ${c.matricule ? `(${c.matricule})` : ''}`}
                secondary={c.capacity ? `${c.capacity} ${t(Labels.koperative_places)}` : undefined}
                slotProps={{
                  primary: { variant: 'body2', sx: { fontSize: '0.8rem' } },
                  secondary: { sx: { fontSize: '0.7rem' } },
                }}
              />
            </ListItem>
          ))}
        </List>
      ),
    },
    {
      title: t(Labels.koperative_drivers),
      icon: <Person fontSize="small" />,
      color: theme.palette.secondary.main,
      count: chauffeurs.length,
      render: () => (
        <List dense disablePadding>
          {chauffeurs.map((ch) => (
            <ListItem key={ch.id} disablePadding sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Person sx={{ fontSize: '0.9rem' }} />
              </ListItemIcon>
              <ListItemText
                primary={`${ch.firstName ?? ''} ${ch.lastName ?? ''}`.trim() || `Chauffeur #${ch.id}`}
                secondary={ch.phone ?? undefined}
                slotProps={{
                  primary: { variant: 'body2', sx: { fontSize: '0.8rem' } },
                  secondary: { sx: { fontSize: '0.7rem' } },
                }}
              />
            </ListItem>
          ))}
        </List>
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar
              src={koperative.logoUrl ?? undefined}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 700,
                width: 56,
                height: 56,
                boxShadow: 1,
              }}
            >
              {koperative.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2, mb: 0.5 }}>
                {koperative.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {koperative.registrationNumber}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={t(KoperativeStatusLabels[koperative.status!] ?? koperative.status)}
            color={getKoperativeChipColor(koperative.status!)}
            size="small"
            sx={{ fontWeight: 700, height: 26, fontSize: '0.75rem' }}
          />
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        <Stack spacing={2.5}>
          {sections.map((section, idx) => {
            if (section.count === 0 && section.title !== t(Labels.koperative_info)) return null;
            return (
              <Paper
                key={idx}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: alpha(section.color, 0.15),
                  bgcolor: alpha(section.color, 0.02),
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    color: section.color,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {section.icon} {section.title} {section.count !== undefined ? `(${section.count})` : ''}
                </Typography>

                {section.items ? (
                  <Stack spacing={1}>
                    {section.items.map(
                      (item, iIdx) =>
                        item.value && (
                          <Box key={iIdx} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.value}
                            </Typography>
                          </Box>
                        )
                    )}
                    {section.extra}
                  </Stack>
                ) : (
                  section.render?.()
                )}
              </Paper>
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: 'action.hover' }}>
        <Button onClick={onClose} variant="contained" color="primary" size="small" sx={{ px: 4 }}>
          {t(Labels.common_close)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
