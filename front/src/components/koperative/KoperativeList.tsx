import React from 'react';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { KoperativeVerifiedIcon } from '@/components/shared';
import { IconButtonTx } from '@/components/ui';
import { Koperative, Ville } from '@/types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { generateRoute } from '@/constants/routes';
import Labels from '@/labelKeys.json';

interface KoperativeListProps {
  koperatives: Koperative[];
  selectedId?: string;
  onSelect?: (koperative: Koperative) => void;
  onEdit?: (koperative: Koperative) => void;
  showEditButton?: boolean;
  isEmpty?: boolean;
}

export const KoperativeList: React.FC<KoperativeListProps> = ({
  koperatives,
  selectedId,
  onSelect,
  onEdit,
  showEditButton = false,
  isEmpty = false,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleInfo = (e: React.MouseEvent, koperativeId: number) => {
    e.stopPropagation();
    navigate(generateRoute.cooperativeInfo(koperativeId, i18n.language));
  };

  const formatVilles = (villes?: Ville[]): string => {
    return Array.isArray(villes) && villes.length > 0
      ? villes.map(v => v.name).join(', ')
      : t(Labels.no_koperative_associated_city);
  };

  if (isEmpty || koperatives.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
          {t(Labels.no_koperative_found)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t(Labels.voyage_try_different_filters)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box component={Paper} elevation={1} sx={{ borderRadius: 2, mb: 3 }}>
      <List sx={{ pt: 0, pb: 0, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        {koperatives.map((k: Koperative, idx) => (
          <React.Fragment key={k.id}>
            <ListItem
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* Info Button */}
                  {k.id && (
                    <IconButton
                      edge="end"
                      aria-label="info"
                      title={t(Labels.koperative_info_button)}
                      onClick={e => handleInfo(e, k.id!)}
                    >
                      <InfoIcon />
                    </IconButton>
                  )}
                  {/* Edit Button */}
                  {showEditButton && (
                    <IconButtonTx edge="end" aria-label="edit" onClick={() => onEdit?.(k)}>
                      <EditIcon />
                    </IconButtonTx>
                  )}
                </Box>
              }
              disablePadding
            >
              <ListItemButton selected={selectedId === k.id?.toString()} onClick={() => onSelect?.(k)}>
                <Grid container sx={{ width: 1, display: 'flex', alignItems: 'center' }} spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {k.logoUrl && (
                        <Box
                          component="img"
                          src={k.logoUrl}
                          alt={k.name}
                          sx={{
                            width: 48,
                            height: 48,
                            objectFit: 'cover',
                            borderRadius: 2,
                            boxShadow: 1,
                            bgcolor: 'grey.100',
                          }}
                        />
                      )}
                      <ListItemText
                        color="text.primary"
                        primary={
                          <Typography
                            variant="h4"
                            color="text.primary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                          >
                            {k.name?.toUpperCase()}
                            <KoperativeVerifiedIcon koperative={k} fontSize="small" />
                          </Typography>
                        }
                        secondary={k.description}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography component="h5">{formatVilles(k.villes)}</Typography>
                  </Grid>
                </Grid>
              </ListItemButton>
            </ListItem>
            {idx < koperatives.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default KoperativeList;
